import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiGraduationCap } from "react-icons/pi";
import './Reset.css';

function Reset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!password || !confirmPassword) {
      setWarning('Please fill out all fields before proceeding.');
    } else if (password !== confirmPassword) {
      setWarning('Passwords do not match.');
    } else {
      setWarning('');
      console.log('Password reset with:', { password, confirmPassword });
      localStorage.setItem('isAuthenticated', 'true'); 
      navigate('/dashboard'); 
    }
  };

  return (
    <div className="reset-container">
      <div className="logo">
        <PiGraduationCap className="logo-icon" /> EduNexa
      </div>
      <h1 className="page-title">RESET PASSWORD</h1>
      <div className="reset-card">
        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Enter Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Enter new password"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="Confirm new password"
          />
        </div>
        <button
          onClick={handleLogin}
          className="login-button"
        >
          Login
        </button>
      </div>
      {warning && (
        <p className="warning-message">{warning}</p>
      )}
    </div>
  );
}

export default Reset;