import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState('Parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // ✅ Signup password validation
    if (activeTab === 'signup') {
      if (!validatePassword(password)) {
        setPasswordError(
          'Password must be at least 8 characters, include uppercase, lowercase, and a special character.'
        );
        return;
      }
    }
  
    setPasswordError(''); // ✅ Clear error if password is valid
  
    if (activeTab === 'login') {
      alert(`Logging in as ${role} with email: ${email}`);
    } else {
      alert(`Signing up ${name} as ${role} with email: ${email}`);
    }
  };
  

  return (
    <div className="login-container">
      <div className={`login-card ${activeTab === 'signup' ? 'tall-card' : ''}`}>

        <div className="logo">logo</div>

        {/* Tabs */}
        <div className="tabs">
          <div
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            <i className="fa-solid fa-right-to-bracket"></i> Login
          </div>
          <div
            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            <i className="fa-solid fa-user-plus"></i> Sign Up
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <label className="role-label">I am a:</label>
          <div className="role-options">
            <label>
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={role === 'Admin'}
                onChange={() => setRole('Admin')}
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Teacher"
                checked={role === 'Teacher'}
                onChange={() => setRole('Teacher')}
              />
              Teacher
            </label>
          </div>

          {activeTab === 'signup' && (
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
  <div style={{ color: 'red', fontSize: '14px', marginTop: '-30px', marginBottom: '20px' }}>
    {passwordError}
  </div>
)}


          <button type="submit">{activeTab === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
