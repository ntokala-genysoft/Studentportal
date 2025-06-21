import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import './Dashboard.css';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Dashboard() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [allAttendanceData, setAllAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showGraph, setShowGraph] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/students/')
      .then(response => {
        console.log('API Response (Students):', response.data);
        setStudents(response.data);
        const initialStudent = response.data.find(student => student.student_id === 1);
        setSelectedStudent(initialStudent);
      })
      .catch(error => {
        console.error('Error fetching student data:', error.response || error.message);
        setError(`Failed to fetch student data: ${error.response?.statusText || error.message}`);
      });
    axios.get('http://127.0.0.1:8000/dashboard/api/attendance/')
      .then(response => {
        console.log('API Response (Attendance):', response.data);
        setAllAttendanceData(response.data);
        const filteredData = response.data.filter(data => data.student_id === 1);
        setAttendanceData(filteredData);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching attendance data:', error.response || error.message);
        setError(`Failed to fetch attendance data: ${error.response?.statusText || error.message}`);
      });
  }, []);

  const toggleGraph = () => {
    setShowGraph(!showGraph);
    console.log('Show Graph:', !showGraph);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleStudentDropdown = () => {
    setShowStudentDropdown(!showStudentDropdown);
  };

  const selectChartType = (type) => {
    setChartType(type);
    setShowDropdown(false);
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentDropdown(false);
    const filteredData = allAttendanceData.filter(data => data.student_id === student.student_id);
    setAttendanceData(filteredData);
  };

  const getAvatarUrl = (student) => {
    if (!student) return 'https://api.dicebear.com/9.x/avataaars/svg?seed=default';
    if (student.image) {
      return student.image;
    }
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${student.name}`;
  };

  const labels = attendanceData.map(data => data.period);
  const percentages = attendanceData.map(data => parseFloat(data.percentage));

  const backgroundColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)',
  ].slice(0, labels.length);

  const borderColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
  ].slice(0, labels.length);

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Attendance Percentage',
        data: percentages,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Attendance Percentage',
        data: percentages,
        backgroundColor: borderColors,
        hoverOffset: 4,
      },
    ],
  };

  const lineChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Attendance Percentage',
        data: percentages,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value) => `${value}%`,
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        title: {
          display: true,
          text: 'Percentage',
          color: '#ffffff',
        },
      },
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Period',
          color: '#ffffff',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value) => `${value}%`,
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        title: {
          display: true,
          text: 'Percentage',
          color: '#ffffff',
        },
      },
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Period',
          color: '#ffffff',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="profile-container">
        <img
          src={getAvatarUrl(selectedStudent)}
          alt="Profile"
          className="profile-avatar"
          onClick={toggleStudentDropdown}
        />
        {showStudentDropdown && (
          <div className="student-dropdown">
            {students.map(student => (
              <button
                key={student.student_id}
                onClick={() => selectStudent(student)}
              >
                {student.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-heading">Dashboard</h1>
          <p className="welcome-text">Welcome, Good Morning</p>
        </div>
      </div>

      <div className="attendance-section">
        <div className="header-container">
          <h2
            className="attendance-title"
            onClick={toggleGraph}
            style={{ cursor: 'pointer' }}
          >
            Attendance for {selectedStudent ? selectedStudent.name : 'Loading...'}
          </h2>
          <div className="chart-toggle">
            <button className="chart-button" onClick={toggleDropdown}>
              Chart
              <svg
                className="arrow-icon"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {showDropdown && (
              <div className="chart-dropdown">
                <button onClick={() => selectChartType('bar')}>
                  Bar Chart
                </button>
                <button onClick={() => selectChartType('pie')}>
                  Pie Chart
                </button>
                <button onClick={() => selectChartType('line')}>
                  Line Chart
                </button>
              </div>
            )}
          </div>
        </div>
        {showGraph && (
          <div className="graph-card">
            {error ? (
              <p className="error-message">{error}</p>
            ) : attendanceData.length === 0 ? (
              <p>No attendance data available for {selectedStudent ? selectedStudent.name : 'this student'}.</p>
            ) : (
              <div className="chart-container">
                {chartType === 'bar' && (
                  <Bar data={barChartData} options={barChartOptions} />
                )}
                {chartType === 'pie' && (
                  <Pie data={pieChartData} options={pieChartOptions} />
                )}
                {chartType === 'line' && (
                  <Line data={lineChartData} options={lineChartOptions} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;