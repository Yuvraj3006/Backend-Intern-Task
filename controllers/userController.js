const db = require("../database/database");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middlewares/user-auth");

async function handleUserRegistration(req, res) {
    const { username, useremail, userphone, password } = req.body;
    try {
        // Validations
        if (!username || !useremail || !userphone || !password) {
            return res.status(400).send({ error: "Enter correct inputs" });
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isValidEmail = emailRegex.test(useremail);
        if (!isValidEmail) {
            return res.status(400).send({ error: "Enter a valid email address" });
        }

        const passwordRegex = /^(?=(.*[A-Za-z]){6,})(?=(.*\d){4,})(?=(.*[\W_]){1,}).{11,}$/;
        const validPassword = passwordRegex.test(password);
        if (!validPassword) {
            return res.status(400).send({ error: "The user password must contain at least 6 alphabets, 4 digits, and 1 special character." });
        }

        if (!(userphone.length === 10)) {
            return res.status(400).send({ error: "The mobile number should contain 10 digits" });
        }

        // Checking if the user already exists
        const existingUserQuery = `SELECT useremail FROM users WHERE useremail = $1`;
        const result = await db.query(existingUserQuery, [useremail]);

        if (result.rows.length > 0) {
            return res.status(400).send({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserting the new user into the database
        const userCreationQuery = `INSERT INTO users (username, useremail, userphone, userpass) VALUES ($1, $2, $3, $4)`;
        await db.query(userCreationQuery, [username, useremail, userphone, hashedPassword]);
        return res.status(200).json(generateToken({username: username,useremail : useremail}));
        //return res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}


async function handleUserLogin(req,res) {
    const {userEmail,userPass} = req.body;
    try {
        //validations
        const existingUserQuery = `SELECT useremail FROM users WHERE useremail = $1`;
        const result = await db.query(existingUserQuery, [userEmail]);

        if (result.rows.length  = 0) {
            return res.status(400).send({ error: "User does not exists" });
        }
        
        const FetchDetailsQuery = `SELECT username,userpass FROM users where useremail = $1`;
        const QueryResult = await db.query(FetchDetailsQuery,[userEmail]);
        
        const userDetails = QueryResult.rows[0].userpass;
        const userExists = bcrypt.compare(userPass,userDetails.userpass);
        if(userExists){
            return res.status(200).json(generateToken({username :userDetails.username,useremail : userEmail}));
        }
        else{
            return res.status(400).send({message : "Password is incorrect"});
        }


    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function handleGetUserDetails(req, res) {
    const userEmail = req.user.useremail;
    try {
        console.log(req.user)
        const userDetailsQuery = `SELECT * FROM users WHERE useremail = $1`;
        const result = await db.query(userDetailsQuery, [userEmail]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userDetails = result.rows[0];
        return res.status(200).json({
            username: userDetails.username,
            useremail: userDetails.useremail,
            userphone: userDetails.userphone,
        });
        
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


module.exports = {
    handleUserRegistration,
    handleUserLogin,
    handleGetUserDetails
}