
const db = require("../database/database");
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function generateUserBalanceSheet(req, res) {
  //console.log("Generating balance sheet");
    try {
      // Get the authenticated user's email from the token
      const { useremail } = req.user;
      //console.log(useremail);
  
      // Query to get data for the specific user from the 'expense' and 'split_details' tables including new attributes
      const expenseQuery = `
        SELECT e.expense_uuid, e.username, e.useremail, e.expense_date, e.expense_amount, 
               e.expense_description, e.issplit, e.splittype, e.transaction_type, e.credited_from,
               s.split_ways, s.split_amount, s.split_among 
        FROM expense e 
        LEFT JOIN split_details s ON e.expense_uuid = s.expense_uuid
        WHERE e.useremail = $1;
      `;
  
      const result = await db.query(expenseQuery, [useremail]);
      const expenseData = result.rows;
  
      // If no data found for the user
      if (expenseData.length === 0) {
        return res.status(404).send({ error: 'No expense records found for this user.' });
      }
  
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Balance Sheet');
  
      // Define the columns for the balance sheet, including new attributes 'transaction_type' and 'credited_from'
      worksheet.columns = [
        { header: 'Expense UUID', key: 'expense_uuid', width: 30 },
        { header: 'Username', key: 'username', width: 15 },
        { header: 'User Email', key: 'useremail', width: 25 },
        { header: 'Expense Date', key: 'expense_date', width: 20 },
        { header: 'Expense Amount', key: 'expense_amount', width: 15 },
        { header: 'Expense Description', key: 'expense_description', width: 30 },
        { header: 'Is Split?', key: 'issplit', width: 10 },
        { header: 'Split Type', key: 'splittype', width: 15 },
        { header: 'Transaction Type', key: 'transaction_type', width: 15 },  // New column for credit/debit
        { header: 'Credited From', key: 'credited_from', width: 20 },        // New column for credited_from
        { header: 'Split Ways', key: 'split_ways', width: 10 },
        { header: 'Split Amounts', key: 'split_amount', width: 20 },
        { header: 'Split Among (Users)', key: 'split_among', width: 30 },
      ];
  
      // Add rows with the data from the query
      expenseData.forEach((row) => {
        worksheet.addRow({
          expense_uuid: row.expense_uuid,
          username: row.username,
          useremail: row.useremail,
          expense_date: row.expense_date,
          expense_amount: row.expense_amount,
          expense_description: row.expense_description,
          issplit: row.issplit,
          splittype: row.splittype,
          transaction_type: row.transaction_type,  // Add transaction_type (credit/debit)
          credited_from: row.credited_from,        // Add credited_from if transaction is credit
          split_ways: row.split_ways,
          split_amount: row.split_amount ? `{${row.split_amount}}` : null,  // Format array as string
          split_among: row.split_among ? `{${row.split_among}}` : null,    // Format array as string
        });
      });
  
      // Save the file locally or serve it as a download
      const filePath = path.join(__dirname, `balance_sheet_${useremail}.xlsx`);
      await workbook.xlsx.writeFile(filePath);
  
      // Send the file as a download
      res.download(filePath, `balance_sheet_${useremail}.xlsx`, (err) => {
        if (err) {
          console.error('Error while downloading the file:', err);
          res.status(500).send({ error: 'Error downloading the balance sheet' });
        }
  
        // Optionally, delete the file after download (if temporary)
        fs.unlinkSync(filePath);
        return res.json({message : "Balance-sheet generated successfully"});
      });
    } catch (error) {
      console.error('Error generating balance sheet:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  module.exports = generateUserBalanceSheet;