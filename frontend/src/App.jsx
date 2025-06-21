import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Login from './components/Login.jsx';
import ForgetPassword from './components/ForgetPassword.jsx';
import Reset from './components/Reset.jsx';
import './index.css';
import Assessments from './Assessment/Assessments.jsx';
import Exam from './Assessment/Exam.jsx';
import Subjects from './Subjects/Subjects.jsx';
import Chapters from './Subjects/Chapters.jsx';
import ScoreCard from './ScoreCard/ScoreCard.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import PDF from './Subjects/PDF.jsx';
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset" element={<Reset />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="min-h-screen flex">
              <div className="w-[15%]">
                <Sidebar />
              </div>
              <div className="w-[85%] bg-white">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/subjects/:subjectName" element={<Chapters />} />
                  <Route path="/subjects/:subjectName/:chapterNumber/:topicNumber" element={<PDF />} />
                  <Route path="/assessments" element={<Assessments />} />
                  <Route path="/score-card" element={<ScoreCard />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessments/:exam_name"
        element={
          <ProtectedRoute>
            <div className="min-h-screen">
              <Exam />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;