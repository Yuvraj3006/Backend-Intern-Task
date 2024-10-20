const db = require("../database/database");
const { v4: uuidv4 } = require('uuid');

async function handleAddExpense(req,res) {
    const {expense_amount, expense_type, expense_date, expense_description, issplit,splittype,split_users} = req.body;
    const {username, useremail} = req.user;
    try {
        if(!expense_amount || !expense_type || !expense_date || !issplit){
            res.status(400).send({error : "Check the input fields properly"});
        }

        if(expense_amount < 0){
            res.status(400).send({error : "Expense amount cannot be less than zero"});
        }
        
        const expense_uuid = uuidv4();
        const insertExpenseQuery = `INSERT INTO expense (username,useremail,expense_date,expense_amount,expense_description,isplit,splittype,expense_uuid) VALUES  ($1,$2,$3,$4,$5,$6.$7,$8)`;
        const insertExpenseValues = [username,useremail,expense_date,expense_amount,expense_description,issplit,splittype,expense_uuid];
        await db.query(insertExpenseQuery,insertExpenseValues);


        if(issplit){
            if(!splittype){
                return res.status(400).send({error : "Please enter the split type"});
            }

            if(!split_users || split_users.length == 0){
                return res.status(400).send({error : "Please provide the users the amount is split into"});

            }

            let splitAmounts =[]
            let splitUserNames = []

            if(splittype == 'exact'){
                let totalExactAmount = 0;
                for(user in split_users){
                    const {username , exact_amount} = user;
                    
                    if(exact_amount === undefined || exact_amount < 0){
                        return res.status(400).send({error : "Exact amount needs to specified greater than zero"});
                    }

                    totalExactAmount += exact_amount;
                    splitAmounts.push(exact_amount);
                    splitUserNames.push(username);
                }
                if (totalExactAmount !== expense_amount) {
                    return res.status(400).send({ error: "The total of exact amounts must match the total expense amount." });
                }
            }

            else if(splittype === 'equal'){
                const equalAmount = expense_amount / split_users.length; 

                for (const user of split_users) {
                    const { username } = user; 
                    splitAmounts.push(equalAmount); 
                    splitUserNames.push(username); 
                }
            }

            else if(splittype === 'percentage'){
                let totalPercentage = 0;

                for (const user of split_users) {
                    const { username, percentage } = user; // Extract username and percentage

                    // Validate the percentage for each user
                    if (percentage === undefined || percentage < 0) {
                        return res.status(400).send({ error: "Each user's percentage must be specified and cannot be negative" });
                    }

                    totalPercentage += percentage; // Keep a running total of percentages

                    // Calculate exact amount based on percentage
                    const splitAmount = (percentage / 100) * expense_amount;
                    splitAmounts.push(splitAmount); // Add calculated amount to the array
                    splitUserNames.push(username);
            }
        }   
            const insertSplitDetails = `INSERT INTO split_details (totalamount, split_type, split_ways, split_amount, split_among, expense_uuid) 
                                       VALUES ($1, $2, $3, $4, $5, $6)`;
            const insertSplitValues = [expense_amount,splittype,split_users.length,splitAmounts,splitUserNames,expense_uuid];
            await db.query(insertSplitDetails,insertSplitValues);

            return res.status(200).send({message : "Details entered successfully"});
        }  
    } catch (error) {
        return res.status(500).send({error : "Internal Server Error"});
    }
}

async function handleGetIndividualExpense(params) {
    
}

async function handleGetExpenses(params) {
    
}

async function handleBalanceSheet(params) {
    
}

module.exports = {
    handleAddExpense,
    handleGetIndividualExpense,
    handleGetExpenses,
    handleBalanceSheet
}