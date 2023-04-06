const db = require("../models")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = db.User

module.exports = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const userExist = await user.findOne({
        where: {
          email
        }
      })
      if (userExist) throw {
        status: false,
        message: `Email is already exist`
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);
      
      const data = await user.create({
        firstName,
        lastName,
        email,
        password: hashPass
      });
  
      res.status(200).send({
        status: true,
        message: "Register success",
        data
      })
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userExist = await user.findOne({
        where: {
          email
        }
      })

      if (!userExist) throw {
        status: false,
        message: `Email not found`
      }

      //Authentication
      const isValid = await bcrypt.compare(password, userExist.password);

      if (!isValid) throw {
        status: false,
        message: `Wrong password`
      }

      //Create JWT
      const payload = { id: userExist.id, isAdmin: userExist.isAdmin };
      const token = jwt.sign(payload, "JWT", { expiresIn: "24h"});

      res.status(200).send({
        status: true,
        message: `Login success`,
        data: {
          id: userExist.id,
          email: userExist.email,
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          isAdmin: userExist.isAdmin
        },
        token
      })
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}