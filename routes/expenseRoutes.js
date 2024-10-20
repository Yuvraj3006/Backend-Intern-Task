const express = require("express");
const { handleAddExpense, handleGetIndividualExpense, handleGetExpenses, handleBalanceSheet } = require("../controllers/expenseController");

const router = express.Router();

router.post("/add-expense",handleAddExpense);

router.get("/individual-expense",handleGetIndividualExpense);

router.get("/all-expense",handleGetExpenses);

router.get("/balance-sheet",handleBalanceSheet);



module.exports = router;