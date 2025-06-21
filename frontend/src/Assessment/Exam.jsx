
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Exam.css';

function Exam() {
  const { exam_name } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ score: 0, totalMarks: 0, correct: [], incorrect: [] }); // Added totalMarks
  const [timeoutMessage, setTimeoutMessage] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/assessments/');
        const filteredQuestions = response.data.filter(
          (assessment) => assessment.exam_name === exam_name
        );
        setQuestions(filteredQuestions);
        setError(null);
        if (filteredQuestions.length > 0 && filteredQuestions[0].duration) {
          setTimeLeft(filteredQuestions[0].duration * 60);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to fetch questions. Please try again.');
      }
    };
    fetchQuestions();
  }, [exam_name]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeoutMessage('Time Out! Your exam has ended.');
          calculateResults();
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleReview = () => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      const currentQuestionId = questions[currentQuestionIndex].id;
      if (newSet.has(currentQuestionId)) {
        newSet.delete(currentQuestionId);
      } else {
        newSet.add(currentQuestionId);
      }
      console.log('Questions marked for review:', Array.from(newSet));
      return newSet;
    });
  };

  const handleNext = () => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    if (selectedAnswers[currentQuestionId]) {
      setMarkedForReview((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentQuestionId);
        return newSet;
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const calculateResults = () => {
    let score = 0;
    let totalMarks = 0;
    const correct = [];
    const incorrect = [];

    questions.forEach((question, index) => {
      const marks = question.total_marks || 1; // Default to 1 if total_marks missing
      totalMarks += marks;
      const selected = selectedAnswers[question.id];
      if (selected) {
        const isCorrect = selected === question.correct_option;
        if (isCorrect) {
          score += marks; // Add question's marks to score
          correct.push({
            index: index + 1,
            question: question.question_text,
            selected: question[`option${selected}`],
            marks: marks,
          });
        } else {
          incorrect.push({
            index: index + 1,
            question: question.question_text,
            selected: question[`option${selected}`],
            correct: question[`option${question.correct_option}`],
            marks: marks,
          });
        }
      }
    });

    setResult({ score, totalMarks, correct, incorrect });
  };

  const handleSubmit = () => {
    setTimeoutMessage(null);
    calculateResults();
    setShowResult(true);
  };

  const handleResultSubmit = () => {
    setShowResult(false);
    setTimeoutMessage(null);
    navigate('/assessments');
  };

  return (
    <div className="exam-page">
      <h1 className="page-title">{exam_name} Questions</h1>
      <div className="exam-container">
        <div className="questions-list">
          {error && <div className="error-message">{error}</div>}
          {questions.length === 0 && !error && (
            <p className="no-questions">No questions available for this exam.</p>
          )}
          {questions.length > 0 && (
            <div className="question-container">
              <h2 className="question-text">
                {currentQuestionIndex + 1}. {questions[currentQuestionIndex].question_text} ({questions[currentQuestionIndex].total_marks || 1} marks)
              </h2>
              <div className="options-container">
                <label className="option">
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestionIndex].id}`}
                    value={1}
                    checked={selectedAnswers[questions[currentQuestionIndex].id] === 1}
                    onChange={() => handleAnswerSelect(questions[currentQuestionIndex].id, 1)}
                  />
                  {questions[currentQuestionIndex].option1}
                </label>
                <label className="option">
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestionIndex].id}`}
                    value={2}
                    checked={selectedAnswers[questions[currentQuestionIndex].id] === 2}
                    onChange={() => handleAnswerSelect(questions[currentQuestionIndex].id, 2)}
                  />
                  {questions[currentQuestionIndex].option2}
                </label>
                <label className="option">
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestionIndex].id}`}
                    value={3}
                    checked={selectedAnswers[questions[currentQuestionIndex].id] === 3}
                    onChange={() => handleAnswerSelect(questions[currentQuestionIndex].id, 3)}
                  />
                  {questions[currentQuestionIndex].option3}
                </label>
                <label className="option">
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestionIndex].id}`}
                    value={4}
                    checked={selectedAnswers[questions[currentQuestionIndex].id] === 4}
                    onChange={() => handleAnswerSelect(questions[currentQuestionIndex].id, 4)}
                  />
                  {questions[currentQuestionIndex].option4}
                </label>
              </div>
              <div className="question-buttons-container">
                <div className="left-buttons">
                  <button className="review-button" onClick={handleReview}>
                    {markedForReview.has(questions[currentQuestionIndex].id) ? 'Unmark Review' : 'Mark for Review'}
                  </button>
                  {currentQuestionIndex > 0 && (
                    <button className="previous-button" onClick={handlePrevious}>
                      Previous
                    </button>
                  )}
                </div>
                <button className="next-button" onClick={handleNext}>
                  {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="question-numbers-container">
          <div className="timer">
            Time Left: {timeLeft !== null ? formatTime(timeLeft) : 'Loading...'}
          </div>
          <div className="question-numbers">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`question-number ${
                  index === currentQuestionIndex ? 'current' : ''
                } ${markedForReview.has(questions[index].id) ? 'marked' : ''}`}
                onClick={() => handleQuestionSelect(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
      {showResult && (
        <div className="result-modal">
          <div className="result-modal-content">
            <h2>Exam Results</h2>
            {timeoutMessage && <p className="timeout-message">{timeoutMessage}</p>}
            <p>
              Score: {result.score} / {result.totalMarks} (
              {result.totalMarks > 0 ? ((result.score / result.totalMarks) * 100).toFixed(2) : 0}%)
            </p>
            {(result.correct.length > 0 || result.incorrect.length > 0) && (
              <div className="result-section">
                <h3>Answers</h3>
                {result.correct.map((item) => (
                  <div key={item.index} className="result-item">
                    <p>
                      <strong>Question {item.index}:</strong> {item.question} ({item.marks} marks)
                    </p>
                    <p>
                      <span className="correct">Your Answer: {item.selected}</span>
                    </p>
                  </div>
                ))}
                {result.incorrect.map((item) => (
                  <div key={item.index} className="result-item">
                    <p>
                      <strong>Question {item.index}:</strong> {item.question} ({item.marks} marks)
                    </p>
                    <p>
                      <span className="incorrect">Your Answer: {item.selected}</span>
                    </p>
                    <p>
                      <span className="correct">Correct Answer: {item.correct}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button className="result-submit-button" onClick={handleResultSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exam;