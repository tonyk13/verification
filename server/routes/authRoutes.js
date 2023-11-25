const express = require("express");
const router = require("express").Router();
const { CreateAccount, Login, Logout, LoggedIn } = require("../controllers/authController");
const { userVerification } = require("../authMiddleware");

router.post("/createaccount", CreateAccount);
router.post("/login", Login);
router.post("/", userVerification);
router.post("/logout", Logout);
router.post("/loggedIn", LoggedIn);

module.exports = router;
