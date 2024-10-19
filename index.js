const express = require("express")

const port = 8000;
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));




app.listen(port,(req,res)=>{
    console.log(`Server is running on the port ${port}`)
});