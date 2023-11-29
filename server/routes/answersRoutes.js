const express = require("express");
const router = express.Router();
const answersController = require("../controllers/answersController");

// POST request for creating an answer.
router.post("/questions/:_id/answers", answersController.answer_create_post);

// GET request for a question's list of answers.
router.get("/questions/:_id/answers", answersController.answer_list);

// POST request for adding a comment to an answer.
router.post("/questions/:questionId/answers/:answerId/comments", answersController.answer_add_comment);

// GET request for a specific answer.
router.get("/questions/:questionId/answers/:answerId", answersController.get_answer);

// GET request for an answer's commments.
router.get("/questions/:questionId/answers/:answerId/comments", answersController.get_answer_comments);

// PUT request for upvoting an answer's comment.
router.put("/questions/:_id/answers/:answerId/comments/:comment_id/upvote", answersController.answer_comment_upvote);

// PUT request for downvoting an answer's comment.
router.put(
    "/questions/:_id/answers/:answerId/comments/:comment_id/downvote",
    answersController.answer_comment_downvote
);

// PUT request for upvoting an answer.
router.put("/questions/:_id/answers/:answerId/upvote", answersController.answer_upvote);

// PUT request for downvoting an answer.
router.put("/questions/:_id/answers/:answerId/downvote", answersController.answer_downvote);

module.exports = router;
