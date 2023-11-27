const answersModel = require("../models/answers");
const questionsModel = require("../models/questions");

// Display list of answers for a specific question.
exports.answer_list = async (req, res, next) => {
    try {
        const question = await questionsModel.findById(req.params._id).exec();

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const answersInQuestion = question.answers;

        const answers = await answersModel
            .find({ _id: { $in: answersInQuestion } })
            .exec();

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
