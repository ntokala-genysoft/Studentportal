import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PiGraduationCap } from "react-icons/pi";
import './ForgetPassword.css'

function ForgetPassword() {
  const [username, setUsername] = useState('')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [warning, setWarning] = useState('')
  const navigate = useNavigate()

  const handleReset = () => {
    if (!username || !emailOrPhone || !otp) {
      setWarning('Please fill out all fields before proceeding.')
    } else {
      setWarning('')
      console.log('Reset attempted with:', { username, emailOrPhone, otp })
      navigate('/reset')
    }
  }

  return (
    <div className="forget-password-container">
      <div className="logo">
        <PiGraduationCap className="logo-icon" /> EduNexa
      </div>
      <h1 className="page-title">FORGET PASSWORD</h1>
      <div className="forget-password-card">
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
          <label className="input-label" htmlFor="emailOrPhone">
            Email/Ph.No:
          </label>
          <input
            id="emailOrPhone"
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="input-field"
            placeholder="Enter email or phone number"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="otp">
            OTP:
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-field"
            placeholder="Enter OTP"
          />
        </div>
        <button
          onClick={handleReset}
          className="login-button" 
        >
          Reset
        </button>
      </div>
      {warning && (
        <p className="warning-message">{warning}</p>
      )}
    </div>
  )
}

export default ForgetPassword