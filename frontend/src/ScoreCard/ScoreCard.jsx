import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './ScoreCard.css';

const CircularProgress = ({ percentage }) => {
  const formattedPercentage = parseFloat(percentage.toString()).toString();

  return (
    <div className="circular-progress-wrapper">
      <CircularProgressbar
        value={percentage}
        text={`${formattedPercentage}%`}
        initialAnimation={true}
        styles={buildStyles({
          pathColor: '#a855f7',
          textColor: '#fff',
          trailColor: 'rgba(255, 255, 255, 0.2)',
          pathTransitionDuration: 10.5,
        })}
      />
    </div>
  );
};

function ScoreCard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/students/')
      .then(response => {
        console.log('Fetched student data:', response.data);
        const sortedStudents = [...response.data].sort((a, b) => b.percentage - a.percentage);
        setStudents(sortedStudents);
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
      });
  }, []);

  if (students.length === 0) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  const topStudents = students.slice(0, 3);
  const otherStudents = students.slice(3);

  const getAvatarUrl = (student) => {
    if (student.image) {
      return student.image;
    }
    const seed = student.student_id === '003' ? `${student.name}2` : student.name;
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
  };

  const formatPercentage = (percentage) => {
    return `${parseFloat(percentage.toString()).toString()}%`;
  };

  return (
    <div className="score-card-container">
      <h1 className="page-title">Score Card</h1>
      <div className="score-card-content">
        <div className="podium-wrapper">
          <div className="podium">
            {topStudents.length > 1 && (
              <div className="podium-item silver">
                <span className="podium-rank">2 🥈</span>
                <div className="bar silver-bar">
                  <img
                    src={getAvatarUrl(topStudents[1])}
                    alt={`${topStudents[1].name}'s profile`}
                    className="student-image"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${topStudents[1].name}`;
                    }}
                  />
                </div>
                <span className="percentage">{formatPercentage(topStudents[1].percentage)}</span>
                <span className="name">{topStudents[1].name} ({topStudents[1].student_id})</span>
              </div>
            )}
            {topStudents.length > 0 && (
              <div className="podium-item gold">
                <span className="podium-rank">1 🥇</span>
                <div className="bar gold-bar">
                  <img
                    src={getAvatarUrl(topStudents[0])}
                    alt={`${topStudents[0].name}'s profile`}
                    className="student-image"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${topStudents[0].name}`;
                    }}
                  />
                </div>
                <span className="percentage">{formatPercentage(topStudents[0].percentage)}</span>
                <span className="name">{topStudents[0].name} ({topStudents[0].student_id})</span>
              </div>
            )}
            {topStudents.length > 2 && (
              <div className="podium-item bronze">
                <span className="podium-rank">3 🥉</span>
                <div className="bar bronze-bar">
                  <img
                    src={getAvatarUrl(topStudents[2])}
                    alt={`${topStudents[2].name}'s profile`}
                    className="student-image"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${topStudents[2].name}`;
                    }}
                  />
                </div>
                <span className="percentage">{formatPercentage(topStudents[2].percentage)}</span>
                <span className="name">{topStudents[2].name} ({topStudents[2].student_id})</span>
              </div>
            )}
          </div>
        </div>
        <div className="rank-list-wrapper">
          <div className="rank-list">
            {otherStudents.map(student => {
              const rank = students.findIndex(s => s.student_id === student.student_id) + 1;
              return (
                <div className="rank-item" key={student.student_id}>
                  <span className="rank">{rank}</span>
                  <img
                    src={getAvatarUrl(student)}
                    alt={`${student.name}'s profile`}
                    className="rank-student-image"
                    onError={(e) => {
                      const seed = student.student_id === '003' ? `${student.name}2` : student.name;
                      e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
                    }}
                  />
                  <span className="rank-name">{student.name} ({student.student_id})</span>
                  <CircularProgress percentage={student.percentage} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;