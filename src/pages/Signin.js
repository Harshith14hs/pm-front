import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://project-back-ujdy.onrender.com'
  : 'http://localhost:5005';
const API_URL = `${API_BASE_URL}/api/auth/register`;

const Signin = (props) => {
  const { onSignin, showToast } = props;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign up failed');
      localStorage.setItem('token', data.token);
      if (onSignin) onSignin(data.user);
      if (typeof showToast === 'function') showToast('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-ui-container">
      <form className="login-ui-card" onSubmit={handleSubmit}>
        <h2 className="login-ui-title">Sign Up</h2>
        {error && <div className="login-ui-error">{error}</div>}
        <input
          className="login-ui-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="login-ui-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="login-ui-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="login-ui-button" type="submit">Sign Up</button>
        <p className="login-ui-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signin; 