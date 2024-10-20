const express = require("express")
const db = require("./database/database")
const port = 3001;
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const UserRoute = require("./routes/userRoutes");
const ExpenseRoute = require("./routes/expenseRoutes")

if(db.connect()){
    console.log("database connected successfully !!")
}
else{
    console.log("error in database connection !")
}

app.use("/user",UserRoute);
app.use("/expense", ExpenseRoute);


app.listen(port,(req,res)=>{
    console.log(`Server is running on the port ${port}`)
});