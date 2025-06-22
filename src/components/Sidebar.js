import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({
  onAddProject,
  loading = false,
  error = '',
  name = '',
  setName = () => {},
  description = '',
  setDescription = () => {},
  handleCreate = () => {},
  onMyProjects = () => {},
  onShowAllProjects = () => {},
  messages = [],
  setMessages = () => {},
  setCurrentPage
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const items = ['Dashboard', 'Add Project', 'My Projects', 'Messages'];
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessages([
      ...messages,
      {
        name: user?.username || 'User',
        avatar: user?.username
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1976d2&color=fff&size=64&rounded=true`
          : 'https://ui-avatars.com/api/?name=User&background=1976d2&color=fff&size=64&rounded=true',
        text: messageText,
        date: new Date().toLocaleDateString(),
      },
    ]);
    setMessageText('');
  };

  return (
    <>
      <button
        className="sidebar-toggle-btn mobile-only"
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setMobileOpen(v => !v)}
      >
        <span style={{fontSize: 28, lineHeight: 1}}>{mobileOpen ? '✕' : '☰'}</span>
      </button>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <aside
        className={`sidebar${mobileOpen ? ' open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="sidebar-header">
          <p className="sidebar-title">Infusion</p>
          <p className='p'>Manage your tasks...</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {items.map((item, idx) => (
              <li
                key={item}
                className={activeIdx === idx ? 'active' : ''}
                onClick={() => {
                  setActiveIdx(idx);
                  if (item === 'Add Project' && setCurrentPage) setCurrentPage('add-project');
                  if (item === 'Dashboard' && setCurrentPage) {
                    setCurrentPage('dashboard');
                    if (typeof onShowAllProjects === 'function') onShowAllProjects();
                  }
                  if (item === 'My Projects' && typeof onMyProjects === 'function') onMyProjects();
                  if (item === 'Messages' && setCurrentPage) setCurrentPage('add-message');
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
        {activeIdx === 1 && (
          <div className="sidebar-add-project-section">
            <h4 style={{margin: '0 0 0.5em 0', color: '#1976d2'}}>Add New Project</h4>
            <form className="sidebar-add-project-form" onSubmit={handleCreate}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Project name"
                required
                disabled={loading}
              />
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                disabled={loading}
              />
              <button type="submit" disabled={loading} className="sidebar-add-project-btn">
                {loading ? 'Adding...' : 'Add Project'}
              </button>
            </form>
            {error && <div className="sidebar-add-project-error">{error}</div>}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar; 