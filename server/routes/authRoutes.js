const express = require("express");
const router = require("express").Router();
const {
    CreateAccount,
    Login,
    Logout,
    LoggedIn,
    getUsername,
    getUserReputation,
} = require("../controllers/authController");
const { userVerification } = require("../authMiddleware");

router.post("/createaccount", CreateAccount);
router.post("/login", Login);
router.post("/", userVerification);
router.post("/logout", Logout);
router.post("/loggedIn", LoggedIn);
router.get("/getUsername/:_id", getUsername);
router.get("/getUserReputation/:_id", getUserReputation);


module.exports = router;
