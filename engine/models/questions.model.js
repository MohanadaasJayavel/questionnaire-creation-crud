const { text } = require('body-parser');
const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['text', 'number', 'radio', 'dropdown'], required: true },
    options: [{ type: String }], 
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
