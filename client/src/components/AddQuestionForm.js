import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddQuestionForm() {
    const navigate = useNavigate();
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('text');
    const [options, setOptions] = useState([{ text: '', isLinked: false, nestedQuestions: [] }]);
    const handleAddOption = () => {
        setOptions([...options, { text: '', isLinked: false, nestedQuestions: [] }]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index].text = event.target.value;
        setOptions(newOptions);
    };

    const handleIsLinkedChange = (index) => {
        const newOptions = [...options];
        newOptions[index].isLinked = !newOptions[index].isLinked;
        setOptions(newOptions);
    };

    const handleAddNestedQuestion = (parentIndex, nestedQuestion) => {
        const newOptions = [...options];
        newOptions[parentIndex].nestedQuestions.push(nestedQuestion);
        setOptions(newOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newQuestion = {
            questionText,
            questionType,
            options: (questionType === 'radio' || questionType === 'dropdown') ? options : [],
        };

        try {
            await fetch('http://localhost:5000/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuestion),
            });
            navigate('/');
        } catch (error) {
            console.error('Error creating question:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Question Text:</label>
                <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Question Type:</label>
                <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="radio">Radio</option>
                    <option value="dropdown">Dropdown</option>
                </select>
            </div>

            {(questionType === 'radio' || questionType === 'dropdown') && (
                <div>
                    <label>Options:</label>
                    {options.map((option, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e)}
                                placeholder="Option text"
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    checked={option.isLinked}
                                    onChange={() => handleIsLinkedChange(index)}
                                />
                                Is Linked
                            </label>
                            <button type="button" onClick={() => handleRemoveOption(index)}>Remove Option</button>

                            {option.isLinked && (
                                <NestedQuestionForm
                                    parentIndex={index}
                                    nestedQuestions={option.nestedQuestions}
                                    addNestedQuestion={handleAddNestedQuestion}
                                />
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddOption}>Add Option</button>
                </div>
            )}

            <button type="submit">Create Question</button>
        </form>
    );
}

const NestedQuestionForm = ({ parentIndex, addNestedQuestion }) => {
    const [nestedQuestionText, setNestedQuestionText] = useState('');
    const [nestedQuestionType, setNestedQuestionType] = useState('text');
    const [nestedOptions, setNestedOptions] = useState([{ text: '', isLinked: false, nestedQuestions: [] }]);

    const handleAddNestedOption = () => {
        setNestedOptions([...nestedOptions, { text: '', isLinked: false, nestedQuestions: [] }]);
    };

    const handleRemoveNestedOption = (index) => {
        const newNestedOptions = [...nestedOptions];
        newNestedOptions.splice(index, 1);
        setNestedOptions(newNestedOptions);
    };

    const handleNestedOptionChange = (index, event) => {
        const newNestedOptions = [...nestedOptions];
        newNestedOptions[index].text = event.target.value;
        setNestedOptions(newNestedOptions);
    };

    const handleNestedIsLinkedChange = (index) => {
        const newNestedOptions = [...nestedOptions];
        newNestedOptions[index].isLinked = !newNestedOptions[index].isLinked;
        setNestedOptions(newNestedOptions);
    };

    const handleAddNestedQuestion = () => {
        const nestedQuestion = {
            questionText: nestedQuestionText,
            questionType: nestedQuestionType,
            options: (nestedQuestionType === 'radio' || nestedQuestionType === 'dropdown') ? nestedOptions : [],
        };

        addNestedQuestion(parentIndex, nestedQuestion);
        setNestedQuestionText('');
        setNestedOptions([{ text: '', isLinked: false, nestedQuestions: [] }]);
    };

    return (
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            <h4>Nested Question</h4>
            <input
                type="text"
                value={nestedQuestionText}
                onChange={(e) => setNestedQuestionText(e.target.value)}
                placeholder="Nested Question Text"
            />
            <select value={nestedQuestionType} onChange={(e) => setNestedQuestionType(e.target.value)}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="radio">Radio</option>
                <option value="dropdown">Dropdown</option>
            </select>

            {(nestedQuestionType === 'radio' || nestedQuestionType === 'dropdown') && (
                <div>
                    <label>Nested Options:</label>
                    {nestedOptions.map((nestedOption, index) => (
                        <div key={index} style={{ marginBottom: '5px' }}>
                            <input
                                type="text"
                                value={nestedOption.text}
                                onChange={(e) => handleNestedOptionChange(index, e)}
                                placeholder="Nested Option Text"
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    checked={nestedOption.isLinked}
                                    onChange={() => handleNestedIsLinkedChange(index)}
                                />
                                Is Linked
                            </label>
                            <button type="button" onClick={() => handleRemoveNestedOption(index)}>Remove Nested Option</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddNestedOption}>Add Nested Option</button>
                </div>
            )}
            <button type="button" onClick={handleAddNestedQuestion}>Add Nested Question</button>
        </div>
    );
};

export default AddQuestionForm;
