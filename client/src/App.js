import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import QuestionList from './components/QuestionList';
import AddQuestionForm from './components/AddQuestionForm';

function App() {
  return (
    <Router>
      <div>
        <h1 style={{ textAlign: 'center' }}>Questionnaire Management</h1>
        <Routes>
          <Route path="/" element={<QuestionList />} />
          <Route path="/add" element={<AddQuestionForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
