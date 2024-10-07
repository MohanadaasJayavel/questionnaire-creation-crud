import React, { useEffect, useState } from 'react';

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
        <div>
            <h2>All Questions</h2>
            {questions.map((question, index) => (
                <div key={index}>
                    <h3>{question.questionText} ({question.questionType})</h3>
                    {question.isLinked && question.nestedQuestions && question.nestedQuestions.length > 0 && (
                        <div>
                            <h4>Nested Questions:</h4>
                            {question.nestedQuestions.map((nested, nestedIndex) => (
                                <div key={nestedIndex}>
                                    {nested.questionText} ({nested.questionType})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <a href="/add">Create New Question</a>
        </div>
    );
}

export default QuestionList;
