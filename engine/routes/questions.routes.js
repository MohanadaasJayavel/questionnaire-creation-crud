const express = require('express');
const router = express.Router();
const Question = require('../models/questions.model');
router.post('/', async (req, res) => {
    try {
        const { questionText, questionType, options, nestedQuestions, isLinked } = req.body;

        const newQuestion = new Question({
            questionText,
            questionType,
            isLinked,
            options
        });
        const savedQuestion = await newQuestion.save();
        if (isLinked && nestedQuestions && nestedQuestions.length > 0) {
            const createdNestedQuestions = await Question.insertMany(nestedQuestions.map(nested => ({
                questionText: nested.questionText,
                questionType: nested.questionType,
                isLinked: nested.isLinked
            })));
            savedQuestion.nestedQuestions = createdNestedQuestions.map(q => q._id);
            await savedQuestion.save();
        }

        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const questions = await Question.find().populate('nestedQuestions').populate('options.nestedQuestions');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
