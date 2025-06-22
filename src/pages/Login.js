import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = (props) => {
  const { onLogin, showToast, setCurrentPage } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await auth.login(email, password);
      if (onLogin) onLogin(auth.user);
      if (typeof showToast === 'function') showToast('Successfully logged in!');
      if (setCurrentPage) setCurrentPage('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-ui-container">
      <form className="login-ui-card" onSubmit={handleSubmit}>
        <h2 className="login-ui-title">Sign In</h2>
        {error && <div className="login-ui-error">{error}</div>}
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
        <button className="login-ui-button" type="submit">Login</button>
        <div className="login-ui-switch">
          <span>Don't have an account?</span>
          <button
            type="button"
            className="login-ui-button"
            style={{ marginTop: 0, marginLeft: '0.5rem', background: '#e0e7ff', color: '#4f8cff' }}
            onClick={() => setCurrentPage && setCurrentPage('signin')}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login; 