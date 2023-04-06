const db = require("../models")
const jwt = require("jsonwebtoken");
const { Op, Sequelize } = require('sequelize');
const { validationResult } = require("express-validator");
const transaction = db.Transaction;
const event = db.Event;
// const user = db.User;

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

      // const ticketSum = await transaction.sum('ticket_qty', { where: { user_id, event_id } });
      // console.log(ticketSum);
      // if (ticketSum >= 3) throw 'You have reach limit 3 tickets'
      // if (ticketSum + ticket_qty > 3) throw  `You can only buy ${3 - ticketSum} ticket(s)`

      const eventData = await event.findOne({
        where: {
          id: event_id
        }
      })

      if (eventData.remaining_ticket == 0) throw `Ticket sold out`
      if (eventData.remaining_ticket < ticket_qty) throw `Ticket almost sold out. You can only buy ${eventData.remaining_ticket} tickets left`

      const total_price = eventData.price * ticket_qty;

      const data = await transaction.create({
        ...req.body,
        user_id,
        total_price
      });

      await event.decrement("remaining_ticket", {
        by: ticket_qty,
        where: {
          id: event_id
        }
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
  },
  showAttendances: async (req, res) => {
    try {
      let token = req.headers.authorization;
      if (!token) throw "Unauthorized / Token expired"
      token = token.split(" ")[1];
      const verifiedUser = jwt.verify(token, "JWT");
      if (!verifiedUser.isAdmin) throw "Access denied: You are not admin"

      const [results, metadata] = await db.sequelize.query(`
        SELECT fullstack.Events.name AS event_name, 
        CONCAT(fullstack.Users.firstName, " ", fullstack.Users.lastName) AS name, 
        SUM(fullstack.Transactions.ticket_qty) AS total_ticket
        FROM fullstack.Transactions
        INNER JOIN fullstack.Events ON fullstack.Transactions.event_id = fullstack.Events.id
        INNER JOIN fullstack.Users ON fullstack.Transactions.user_id = fullstack.Users.id
        GROUP BY fullstack.Events.name, fullstack.Users.id;
      `)

      res.status(200).send({
        status: true,
        results
      })

    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
}