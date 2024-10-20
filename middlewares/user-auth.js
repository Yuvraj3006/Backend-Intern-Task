const jwt = require("jsonwebtoken");
require("dotenv").config();

//generating usertoken
const generateToken = ({ username ,useremail}) => {
    return jwt.sign({ useremail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "12h" });
}

// authencatuon user token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1]; // Ensure correct spelling

    if (!token) {
        return res.status(401).json({ error: "User not authorized" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" }); // Handle token expiration/invalidity
        }
        console.log(decoded); // You should see the decoded payload here (should include useremail)
        req.user = decoded; // Attach decoded token data (e.g., useremail) to request
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = {
    generateToken,
    authenticateToken
}
