import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL =  ['http://localhost:5005'||'https://pm-back.onrender.com'];

const API_URL = `${API_BASE_URL}/api/projects`;

const AddProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to create a project.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name, description })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      setName('');
      setDescription('');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 32px 0 rgba(25, 118, 210, 0.10)',
        maxWidth: 420,
        width: '100%',
        padding: '2.5em 2em 2em 2em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        {/* Back Arrow */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.7rem',
            color: '#1976d2',
            padding: 0,
            zIndex: 2,
          }}
          aria-label="Back to dashboard"
        >
          &#8592;
        </button>
        <h2 style={{ color: '#1976d2', marginBottom: '1.2em', fontWeight: 700, fontSize: '2rem', letterSpacing: 0.5 }}>Add New Project</h2>
        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.1em' }} onSubmit={handleCreate}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Project name"
            required
            disabled={loading}
            style={{
              padding: '12px 14px',
              border: '1.5px solid #d0d7de',
              borderRadius: 10,
              fontSize: '1.08rem',
              outline: 'none',
              background: '#f8fafc',
              transition: 'border 0.2s',
            }}
          />
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            disabled={loading}
            style={{
              padding: '12px 14px',
              border: '1.5px solid #d0d7de',
              borderRadius: 10,
              fontSize: '1.08rem',
              outline: 'none',
              background: '#f8fafc',
              transition: 'border 0.2s',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#b0bec5' : 'linear-gradient(90deg, #1976d2 80%, #2196f3 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: '1.08rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.07)',
              marginTop: '0.2em',
              transition: 'background 0.2s',
              letterSpacing: 0.5,
            }}
          >
            {loading ? 'Adding...' : 'Add Project'}
          </button>
        </form>
        {error && <div style={{ color: '#d12a2a', fontSize: '1.05em', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      </div>
    </div>
  );
};

export default AddProject; 