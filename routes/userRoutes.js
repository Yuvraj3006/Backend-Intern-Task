const express = require("express");
const { handleUserLogin, handleUserRegistration ,handleGetUserDetails } = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/user-auth");

router = express.Router();

router.get("/details",handleGetUserDetails);

router.post("/login",handleUserLogin);

router.post("/register",handleUserRegistration);



module.exports = router;