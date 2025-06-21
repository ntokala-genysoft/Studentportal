import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Chapters.css';

function Chapters() {
  const { subjectName } = useParams();
  const [chapters, setChapters] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/subjects/');
        const subjectData = response.data.find(
          (subject) => subject.subject_name.toLowerCase() === subjectName.toLowerCase()
        );
        if (subjectData) {
          setChapters(subjectData.chapters);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [subjectName]);

  const toggleDropdown = (chapterIndex) => {
    setOpenDropdown(openDropdown === chapterIndex ? null : chapterIndex);
  };

  return (
    <div className="chapters-page">
      <Link to="/subjects" className="back-link">← Back to Subjects</Link>
      <h1 className="page-title">Chapters for {subjectName}</h1>
      <div className="chapters-list">
        {chapters.map((chapter, index) => (
          <div key={`${chapter.chapter_number}-${chapter.chapter_name}`} className="chapter-container">
            <div className="chapter-header" onClick={() => toggleDropdown(index)}>
              <span>Chapter {chapter.chapter_number}: {chapter.chapter_name}</span>
              <span className={`dropdown-arrow ${openDropdown === index ? 'open' : ''}`}>▼</span>
            </div>
            {openDropdown === index && (
              <div className="topics-list">
                {chapter.topics.length > 0 ? (
                  <ul>
                    {chapter.topics.map((topic) => (
                      <li key={topic.topic_number}>
                        <Link
                          to={`/subjects/${subjectName}/${chapter.chapter_number}/${topic.topic_number}`}
                          className="topic-link"
                        >
                          Topic {topic.topic_number}: {topic.topic_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No topics available</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chapters;