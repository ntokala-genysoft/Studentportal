import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiGraduationCap } from "react-icons/pi";  
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Login attempted with:', { username, password });
    localStorage.setItem('isAuthenticated', 'true'); 
    navigate('/dashboard'); 
  };

  return (
    <div className="login-container">
      <div className="logo">
        <PiGraduationCap className="logo-icon" /> EduNexa
      </div>
      <h1 className="page-title">LOGIN PAGE</h1>
      <div className="login-card">
        <div className="input-group">
          <label className="input-label" htmlFor="username">
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            placeholder="Enter username"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Enter password"
          />
        </div>
        <div className="text-right">
          <Link to="/forget-password" className="forget-password">
            Forget Password
          </Link>
        </div>
        <button
          onClick={handleLogin}
          className="login-button"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;