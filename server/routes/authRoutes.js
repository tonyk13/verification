const express = require("express");
const router = require("express").Router();
const {
    CreateAccount,
    Login,
    Logout,
    LoggedIn,
    getUsername,
    getUserReputation,
    getUserDateCreated,
    postQuestiontoUser,
    getUserQuestions,
    postTagtoUser,
    getUserTags
} = require("../controllers/authController");
const { userVerification } = require("../authMiddleware");

// POST request for create account.
router.post("/createaccount", CreateAccount);

// POST request for login.
router.post("/login", Login);

// POST request for user verification.
router.post("/", userVerification);

// POST request for log out.
router.post("/logout", Logout);

// POST request for loggedin.
router.post("/loggedIn", LoggedIn);

// GET request for username.
router.get("/getUsername/:_id", getUsername);

// GET request for a user's reputation.
router.get("/getUserReputation/:_id", getUserReputation);

// GET request for user's account date creation.
router.get("/getUserDateCreated/:_id", getUserDateCreated);

// POST request for user's question (SINGLE).
router.post("/postQuestiontoUser/:_id/questions", postQuestiontoUser);

// GET request for all user's questions
router.get("/getUserQuestions/:_id", getUserQuestions);

// POST request for user's tag (SINGLE).
router.post("/postTagtoUser/:_id/tags", postTagtoUser);

// GET request for all user's tags
router.get("/getUserTags/:_id", getUserTags);

module.exports = router;
