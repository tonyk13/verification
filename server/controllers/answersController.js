const answersModel = require("../models/answers");
const questionsModel = require("../models/questions");
const commentsModel = require("../models/comments");

// Display list of answers for a specific question.
exports.answer_list = async (req, res, next) => {
    try {
        const question = await questionsModel.findById(req.params._id).exec();

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const answersInQuestion = question.answers;

        const answers = await answersModel.find({ _id: { $in: answersInQuestion } }).exec();

        res.json(answers);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// create answer on POST
exports.answer_create_post = async (req, res, next) => {
    try {
        const answer = new answersModel(req.body);

        const question = await questionsModel.findById(req.params._id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        question.answers.push(answer._id);

        await answer.save();
        await question.save();

        return res.status(201).json(answer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// POST request for adding a comment to an answer.
exports.answer_add_comment = async (req, res, next) => {
    try {
        const comment = new commentsModel(req.body);

        const answer = await answersModel.findById(req.params.answerId);

        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        answer.comments.push(comment._id);

        await comment.save();
        await answer.save();

        return res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET an answer
exports.get_answer = async (req, res, next) => {
    try {
        const answer = await answersModel.findById(req.params.answerId).exec();

        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        res.json(answer);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// GET an answer's comments
exports.get_answer_comments = async (req, res, next) => {
    try {
        const answer = await answersModel.findById(req.params.answerId).exec();

        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        const commentsInAnswer = answer.comments;

        const comments = await commentsModel.find({ _id: { $in: commentsInAnswer } }).exec();

        res.json(comments);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// PUT upvote an answer
exports.answer_upvote = async (req, res, next) => {
    try {
        const answer = await answersModel.findByIdAndUpdate(req.params.answerId, { $inc: { votes: 1 } }, { new: true });

        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        res.json(answer);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

// PUT downvote an answer
exports.answer_downvote = async (req, res, next) => {
    try {
        const answer = await answersModel.findByIdAndUpdate(
            req.params.answerId,
            { $inc: { votes: -1 } },
            { new: true }
        );

        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        res.json(answer);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
