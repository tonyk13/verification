const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questionsController");

// GET request for list of all questions.
router.get("/questions", questionsController.questions_list);

// POST request for creating a question.
router.post("/questions/", questionsController.question_create_post);

// GET request for a question. (this might not be needed)
router.get("/questions/:_id", questionsController.question_get);

module.exports = router;
