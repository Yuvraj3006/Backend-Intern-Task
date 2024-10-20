const db = require("../database/database");
const { v4: uuidv4 } = require('uuid');
const { exact_split, equal_split, percentage_split } = require('../utils/split');

async function handleAddExpense(req, res) {
    const { expense_amount, expense_date, expense_description, issplit, splittype, split_users } = req.body;
    const { username, useremail } = req.user;

    try {
        // Validate input fields
        if (!expense_amount || !expense_date || typeof issplit !== 'boolean') {
            return res.status(400).send({ error: "Check the input fields properly" });
        }

        // Validate expense amount
        if (expense_amount <= 0) {
            return res.status(400).send({ error: "Expense amount must be greater than zero" });
        }

        // Create UUID for the new expense
        const expense_uuid = uuidv4();

        // Insert the expense into the `expense` table
        const insertExpenseQuery = `
            INSERT INTO expense 
            (username, useremail, expense_date, expense_amount, expense_description, issplit, splittype, expense_uuid) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const insertExpenseValues = [username, useremail, expense_date, expense_amount, expense_description, issplit, splittype, expense_uuid];
        await db.query(insertExpenseQuery, insertExpenseValues);

        // If the expense is split, handle the splitting logic
        if (issplit) {
            let splitDetails;
            let splitAmounts, splitUserNames;

            // Call the appropriate split function based on the `splittype`
            if (splittype === 'exact') {
                splitDetails = exact_split(split_users, expense_amount);
            } else if (splittype === 'equal') {
                splitDetails = equal_split(split_users, expense_amount);
            } else if (splittype === 'percentage') {
                splitDetails = percentage_split(split_users, expense_amount);
            } else {
                return res.status(400).send({ error: "Invalid split type" });
            }

            // Handle errors returned by the split functions
            if (splitDetails.error) {
                return res.status(400).send({ error: splitDetails.error });
            }

            // Extract splitAmounts and splitUserNames from splitDetails
            splitAmounts = splitDetails.splitAmounts;
            splitUserNames = splitDetails.splitUserNames;

            // Insert the split details into the `split_details` table
            const insertSplitDetailsQuery = `
                INSERT INTO split_details 
                (totalamount, split_type, split_ways, split_amount, split_among, expense_uuid) 
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            const insertSplitValues = [expense_amount, splittype, split_users.length, splitAmounts, splitUserNames, expense_uuid];
            await db.query(insertSplitDetailsQuery, insertSplitValues);
        }

        // Send success response
        return res.status(200).send({ message: "Details entered successfully" });

    } catch (error) {
        console.error("Error in handleAddExpense:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

async function handleGetIndividualExpense(req,res) {
    try {
        const{username,useremail} = req.user;
        const fetchExpensesQuery = `SELECT * FROM expense WHERE useremail = $1 AND issplit = false `;
        const result = await db.query(fetchExpensesQuery,[useremail]);

        const expenseDetails = result.rows;

        return res.status(200).json({
            expenseDetails
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({error : "Internal Server Error"});  
    }
}

async function handleGetExpenses(req,res) {
    try {
        const{username,useremail} = req.user;
        const fetchExpensesQuery = `SELECT DISTINCT e.*, s.*
                                    FROM expense e
                                    JOIN split_details s ON e.expense_uuid = s.expense_uuid
                                    WHERE e.useremail = $1;
                                    `;
        const result = await db.query(fetchExpensesQuery,[useremail]);

        const expenseDetails = result.rows;

        return res.status(200).json({
            expenseDetails
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({error : "Internal Server Error"});  
    }
}

async function handleBalanceSheet(params) {
    
}

module.exports = {
    handleAddExpense,
    handleGetIndividualExpense,
    handleGetExpenses,
    handleBalanceSheet
}