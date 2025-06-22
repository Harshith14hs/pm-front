import React, { useState } from 'react';

const API_BASE_URL = 'https://pm-back.onrender.com';
const API_URL = `${API_BASE_URL}/api/projects`;

const AddProject = ({ setCurrentPage }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      if (setCurrentPage) setCurrentPage('dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project-container">
      <form className="add-project-form" onSubmit={handleCreate}>
        <h2>Add Project</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Project'}</button>
      </form>
    </div>
  );
};

export default AddProject; 