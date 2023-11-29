const questionModel = require("../models/questions");
const commentsModel = require("../models/comments");

exports.questions_list = async (req, res, next) => {
    try {
        const questions = await questionModel.find().exec();

        res.json(questions);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.question_create_post = async (req, res, next) => {
    try {
        const question = new questionModel(req.body);

        await question.save();

        return res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.question_get = async (req, res, next) => {
    try {
        const question = await questionModel.findById(req.params._id).exec();

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json(question);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.question_upvote = async (req, res, next) => {
    try {
        const question = await questionModel.findByIdAndUpdate(req.params._id, { $inc: { votes: 1 } }, { new: true });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json(question);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.question_downvote = async (req, res, next) => {
    try {
        const question = await questionModel.findByIdAndUpdate(req.params._id, { $inc: { votes: -1 } }, { new: true });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json(question);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.getQuestionVotes = async (req, res) => {
    const questionId = req.params._id;

    try {
        const question = await questionModel.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ votes: question.votes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getQuestionComments = async (req, res) => {
    try {
        const question = await questionModel.findById(req.params._id).exec();

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const commentsInQuestion = question.comments;

        const comments = await commentsModel.find({ _id: { $in: commentsInQuestion } }).exec();

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.question_add_comment = async (req, res, next) => {
    try {
        const comment = new commentsModel(req.body);

        const question = await questionModel.findById(req.params._id).exec();

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        question.comments.push(comment._id);

        await comment.save();
        await question.save();

        return res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
