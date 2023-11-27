const questionsModel = require("../models/questions");

exports.questions_list = async (req, res, next) => {
    try {
        const questions = await questionsModel.find().exec();

        res.json(questions);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.question_create_post = async (req, res, next) => {
    try {
        const question = new questionsModel(req.body);

        await question.save();

        return res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.question_get = async (req, res, next) => {
    try {
        const question = await questionsModel.findById(req.params._id).exec();

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json(question);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
