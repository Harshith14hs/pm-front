import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f7f7fa 100%)',
      padding: '0 16px'
    }}>
      <h1 style={{ fontSize: '2.8rem', color: '#7b61ff', marginBottom: '0.5em', fontWeight: 700, letterSpacing: 1 }}>Welcome to INFUSION</h1>
      <p style={{ fontSize: '1.3rem', color: '#555', marginBottom: '2em', textAlign: 'center', maxWidth: 480 }}>
        Manage your projects here with ease. Sign in or create an account to get started!
      </p>
      <div style={{ display: 'flex', gap: '1.5em' }}>
        <button
          style={{
            padding: '0.7em 2.2em',
            fontSize: '1.1rem',
            borderRadius: '2em',
            border: 'none',
            background: 'linear-gradient(90deg, #7b61ff 60%, #1976d2 100%)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(123,97,255,0.08)',
            transition: 'background 0.2s'
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          style={{
            padding: '0.7em 2.2em',
            fontSize: '1.1rem',
            borderRadius: '2em',
            border: 'none',
            background: 'linear-gradient(90deg, #1976d2 60%, #7b61ff 100%)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
            transition: 'background 0.2s'
          }}
          onClick={() => navigate('/signin')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home; 