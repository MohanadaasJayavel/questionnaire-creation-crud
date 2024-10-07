const { text } = require('body-parser');
const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['text', 'number', 'radio', 'dropdown'], required: true },
    isLinked: { type: Boolean, default: false },
    options: [{ type: String }], 
    nestedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
