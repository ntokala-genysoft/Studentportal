import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Subjects.css';

function Subjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/subjects/');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="subjects-page">
      <h1 className="page-title">Subjects</h1>
      <div className="subjects-list">
        {subjects.map((subject) => (
          <Link
            to={`/subjects/${subject.subject_name}`}
            key={subject.subject_name}
            className="subject-container"
          >
            <span className="subject-name">{subject.subject_name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Subjects;