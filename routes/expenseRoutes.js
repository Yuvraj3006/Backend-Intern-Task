const express = require("express");
const { handleAddExpense, handleGetIndividualExpense, handleGetExpenses, handleBalanceSheet } = require("../controllers/expenseController");
const { authenticateToken } = require("../middlewares/user-auth");

const router = express.Router();

router.post("/add-expense",authenticateToken,handleAddExpense);

router.get("/individual-expense",authenticateToken,handleGetIndividualExpense);

router.get("/all-expense",authenticateToken,handleGetExpenses);

router.get("/balance-sheet",handleBalanceSheet);




module.exports = router;