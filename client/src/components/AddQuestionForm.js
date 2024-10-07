import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/style.css"

function AddQuestionForm() {
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('text');
    const [options, setOptions] = useState([{ text: '', isLinked: false, nestedQuestions: [] }]);
    const handleAddOption = () => {
        setOptions([...options, { text: '', isLinked: false, nestedQuestions: [] }]);
    };
    const handleRemoveOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index].text = value;
        setOptions(updatedOptions);
    };
    const handleIsLinkedChange = (index) => {
        const updatedOptions = [...options];
        updatedOptions[index].isLinked = !updatedOptions[index].isLinked;
        if (!updatedOptions[index].isLinked) {
            updatedOptions[index].nestedQuestions = [];
        }
        setOptions(updatedOptions);
    };
    const handleAddNestedQuestion = (optionIndex) => {
        const updatedOptions = [...options];
        updatedOptions[optionIndex].nestedQuestions.push({
            questionText: '',
            questionType: 'text',
            options: [],
        });
        setOptions(updatedOptions);
    };
    const handleNestedQuestionChange = (optionIndex, nestedIndex, key, value) => {
        const updatedOptions = [...options];
        updatedOptions[optionIndex].nestedQuestions[nestedIndex] = {
            ...updatedOptions[optionIndex].nestedQuestions[nestedIndex],
            [key]: value,
        };
        setOptions(updatedOptions);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            questionText,
            questionType,
            options: questionType === 'radio' || questionType === 'dropdown' ? options : [],
        };

        console.log('Payload to be sent:', JSON.stringify(payload, null, 2));

        try {
            const response = await fetch('http://localhost:5000/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Question created successfully');
            } else {
                console.error('Failed to create question');
            }
        } catch (error) {
            console.error('Error creating question:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="questionnaire-form">
            <div className="form-row Questiontext-rows">
                <label>Question Text:</label>
                <input
                    type="text" className='question-text-header'
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />
            </div>
            <div className='question-type-dropdown'>
                <div className="form-row">
                    <label>Question Type:</label>

                    <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="radio">Radio</option>
                        <option value="dropdown">Dropdown</option>
                    </select>
                </div>

            </div>

            {(questionType === 'radio' || questionType === 'dropdown') && (
                <div>
                    <h4>Options:</h4>
                    {options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option-container">
                            <input
                                type="text" className='question-input-box'
                                value={option.text}
                                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                                placeholder="Option Text"
                            />

                            <label>
                                <input
                                    type="checkbox"
                                    checked={option.isLinked}
                                    onChange={() => handleIsLinkedChange(optionIndex)}
                                />
                                Add Nested Questions
                            </label>

                            {option.isLinked && (
                                <div className="nested-questions">
                                    {option.nestedQuestions.map((nestedQuestion, nestedIndex) => (
                                        <div key={nestedIndex} className="nested-question">
                                            <input
                                                type="text"
                                                value={nestedQuestion.questionText}
                                                onChange={(e) =>
                                                    handleNestedQuestionChange(optionIndex, nestedIndex, 'questionText', e.target.value)
                                                }
                                                placeholder="Nested Question Text"
                                            />
                                            <select
                                                value={nestedQuestion.questionType}
                                                onChange={(e) =>
                                                    handleNestedQuestionChange(optionIndex, nestedIndex, 'questionType', e.target.value)
                                                }
                                            >
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="radio">Radio</option>
                                                <option value="dropdown">Dropdown</option>
                                            </select>

                                            {(nestedQuestion.questionType === 'radio' ||
                                                nestedQuestion.questionType === 'dropdown') && (
                                                    <div>
                                                        <h5>Nested Options:</h5>
                                                        {nestedQuestion.options.map((nestedOption, optIndex) => (
                                                            <div key={optIndex}>
                                                                <input
                                                                    type="text"
                                                                    value={nestedOption.text}
                                                                    onChange={(e) =>
                                                                        handleNestedQuestionChange(
                                                                            optionIndex,
                                                                            nestedIndex,
                                                                            'options',
                                                                            nestedQuestion.options.map((opt, i) =>
                                                                                i === optIndex
                                                                                    ? { ...opt, text: e.target.value }
                                                                                    : opt
                                                                            )
                                                                        )
                                                                    }
                                                                    placeholder="Nested Option Text"
                                                                />
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleNestedQuestionChange(
                                                                    optionIndex,
                                                                    nestedIndex,
                                                                    'options',
                                                                    [
                                                                        ...nestedQuestion.options,
                                                                        { text: '', isLinked: false, nestedQuestions: [] },
                                                                    ]
                                                                )
                                                            }
                                                        >
                                                            Add Nested Option
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddNestedQuestion(optionIndex)}>
                                        Add Nested Question
                                    </button>
                                </div>
                            )}

                            <button type="button" onClick={() => handleRemoveOption(optionIndex)}>
                                Remove Option
                            </button>
                        </div>
                    ))}

                    <button type="button" className="add-button" onClick={handleAddOption}>
                        Add Option
                    </button>
                </div>
            )}

            <button type="submit" className="submit-button add-button">
                Create Question
            </button>
        </form>
    );
}
export default AddQuestionForm;

