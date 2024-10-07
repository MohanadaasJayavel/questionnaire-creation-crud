const express = require('express');
const router = express.Router();
const Question = require('../models/questions.model');
router.post('/', async (req, res) => {
    try {
        const { questionText, questionType, options } = req.body;

        const newQuestion = new Question({
            questionText,
            questionType,
            options
        });
        const savedQuestion = await newQuestion.save();
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
