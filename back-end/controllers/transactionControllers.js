const db = require("../models")
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const { validationResult } = require("express-validator");
const transaction = db.Transaction;
const event = db.Event;

module.exports = {
  createTransaction: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw "Maximum 3 tickets";
      const { event_id, ticket_qty } = req.body;

      let token = req.headers.authorization;
      if (!token) throw "Unauthorized / Token expired"
      token = token.split(" ")[1];

      const user_id = jwt.verify(token, "JWT").id;
      
      if (!event_id || !ticket_qty) throw "Please complete your form"

      const ticketSum = await transaction.sum('ticket_qty', { where: { user_id, event_id } });
      console.log(ticketSum);
      if (ticketSum + ticket_qty > 3) throw  `You can only buy ${3 - ticketSum} ticket(s)`

      const eventData = await event.findOne({
        where: {
          id: event_id
        }
      })
      const total_price = eventData.price * ticket_qty;

      const data = await transaction.create({
        ...req.body,
        user_id,
        total_price
      });
  
      res.status(200).send({
        status: true,
        message: "Transaction successfully created",
        data
      })
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  showTransactions: async (req, res) => {
    try {
      let token = req.headers.authorization;
      if (!token) throw "Unauthorized / Token expired"
      token = token.split(" ")[1];
      const verifiedUser = jwt.verify(token, "JWT");
      // if (!verifiedUser.isAdmin) throw "Access denied: You are not admin"

      const data = await transaction.findAll({
        where: {
          user_id: verifiedUser.id
        }
      });
      res.status(200).send({
        status: true,
        data
      })

    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}