const express = require("express");
const { handleAddExpense, handleGetIndividualExpense, handleGetExpenses, handleBalanceSheet } = require("../controllers/expenseController");
const { authenticateToken } = require("../middlewares/user-auth");
const generateUserBalanceSheet = require("../controllers/balanceSheet");

const router = express.Router();

router.post("/add-expense",authenticateToken,handleAddExpense);

router.get("/individual-expense",authenticateToken,handleGetIndividualExpense);

router.get("/all-expense",authenticateToken,handleGetExpenses);

router.get("/balance-sheet",authenticateToken,generateUserBalanceSheet);




module.exports = router;