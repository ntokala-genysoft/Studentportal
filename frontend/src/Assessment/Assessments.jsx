import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Assessments.css';

function Assessments() {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/assessments/');
        const groupedExams = Object.values(
          response.data.reduce((acc, assessment) => {
            const key = assessment.exam_name;
            if (!acc[key]) {
              acc[key] = {
                subject_name: assessment.subject_name,
                exam_name: assessment.exam_name,
                date: assessment.date,
                duration: assessment.duration,
                total_marks: assessment.total_marks,
              };
            }
            return acc;
          }, {})
        );
        setExams(groupedExams);
        setError(null);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setError('Failed to fetch assessments. Please try again.');
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div className="assessments-page">
      <h1 className="page-title">Assessments</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="assessments-list">
        {exams.length === 0 && !error && (
          <p className="no-assessments">No assessments available.</p>
        )}
        {exams.map((exam, index) => (
          <Link
            to={`/assessments/${exam.exam_name}`}
            key={index}
            className="assessment-container"
          >
            <div className="assessment-left">
              <span className="subject-name">{exam.subject_name}</span>
            </div>
            <div className="assessment-right">
              <h2 className="exam-name">{exam.exam_name}</h2>
              <p className="exam-details">Date: {exam.date}</p>
              <p className="exam-details">Duration: {exam.duration} minutes</p>
              <p className="exam-details">Total Marks: {exam.total_marks}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Assessments;
