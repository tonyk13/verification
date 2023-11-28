const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

// POST request for creating a comment for a question.
router.post("/questions/:_id/comments", commentsController.question_comment_create_post);

// GET request for a question's list of comments.
router.get("/questions/:_id/comments", commentsController.question_comments_list);

// POST request for creating a comment for an answer.
router.post("/questions/:_id/answers/:_id/comments", commentsController.answer_comment_create_post);

// GET request for an answer's list of comments.
router.get("/questions/:_id/answers/:_id/comments", commentsController.answer_comments_list);

module.exports = router;
