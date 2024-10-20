const express = require("express")

const port = 8000;
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const UserRoute = require("./routes/userRoutes");
const ExpenseRoute = require("./routes/expenseRoutes")


app.use("/user",UserRoute);
app.use("/expense", ExpenseRoute);


app.listen(port,(req,res)=>{
    console.log(`Server is running on the port ${port}`)
});