import React, { useEffect, useState } from 'react';
import '../styles/QuestionList.css';

function QuestionList() {
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        fetchQuestions();
    }, []);
    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/questions');
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    return (
        <div className="question-list-container">
            <h2>All Questions</h2>
            {questions.length === 0 && <p>No questions available.</p>}
            {questions.map((question, index) => (
                <div key={index} className="question-item">
                    <h3>{question.questionText} ({question.questionType})</h3>
                    {(question.questionType === 'radio' || question.questionType === 'dropdown') && question.options?.length > 0 && (
                        <div>
                            <h4>Options:</h4>
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                    {option.text}
                                    {option.isLinked && option.nestedQuestions?.length > 0 && (
                                        <div className="nested-question">
                                            <h4>Nested Questions:</h4>
                                            {option.nestedQuestions.map((nested, nestedIndex) => (
                                                <div key={nestedIndex}>
                                                    {nested.questionText} ({nested.questionType})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <a href="/add" className="add-question-link">Create New Question</a>
        </div>
    );
}

export default QuestionList;
