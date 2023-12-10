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
    deleteQuestionFromUser,
    postTagtoUser,
    getUserTags,
    deleteTagFromUser,
    postAnswerToUser,
    getUserAnswers,
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

// DELETE request for a user's question
router.delete("/deleteQuestionFromUser/:_id/questions/:_qid", deleteQuestionFromUser);

// POST request for user's tag (SINGLE).
router.post("/postTagtoUser/:_id/tags", postTagtoUser);

// GET request for all user's tags
router.get("/getUserTags/:_id", getUserTags);

// DELETE request for a user's tags
router.delete("/deleteTagFromUser/:_id/tags/:_tid", deleteTagFromUser);

// POST request to add an answer to a user's answers
router.post("/postAnswerToUser/:_id/answers", postAnswerToUser);

// GET request for all user's answers
router.get("/getUserAnswers/:_id", getUserAnswers);

module.exports = router;
