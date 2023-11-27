const express = require("express");
const router = express.Router();
const answersController = require("../controllers/answersController");

// POST request for creating an answer.
router.post("/questions/:_id/answers", answersController.answer_create_post);

// GET request for a question's list of answers.
router.get("/questions/:_id/answers", answersController.answer_list);

module.exports = router;
