const router = require("express").Router();
const { transactionControllers } = require("../controllers");
const { body } = require("express-validator");

router.post("/create",
  body("ticket_qty").isInt({ min: 1, max: 3}),
  transactionControllers.createTransaction
);
router.get("/show", transactionControllers.showTransactions);

module.exports = router;