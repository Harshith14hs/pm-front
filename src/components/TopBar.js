import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './TopBar.css';

const TopBar = ({ onSearch, showToast, setCurrentPage }) => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  console.log('TopBar user:', user);
  if (!user) {
    console.warn('TopBar: No user found in context.');
  } else if (!user.username) {
    console.warn('TopBar: User object missing username:', user);
  }
  const logout = auth ? auth.logout : () => {};
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    if (typeof showToast === 'function') showToast('Successfully logged out!');
    if (setCurrentPage) setCurrentPage('landing');
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="topbar">
      <div className="topbar-title">Portfolio</div>
      <input
        className="topbar-search"
        placeholder="Search"
        value={search}
        onChange={handleSearchChange}
      />
      <div className="topbar-actions">
        <span className="topbar-bell">🔔</span>
        {user ? (
          <>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                className="topbar-avatar"
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=1976d2&color=fff&size=128&rounded=true`}
                alt={user.username || 'User'}
              />
              <span className="topbar-username">{user.username || 'User'}</span>
            </span>
            <button className="topbar-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="topbar-login" onClick={() => setCurrentPage && setCurrentPage('login')}>Login</button>
            <button className="topbar-signup" onClick={() => setCurrentPage && setCurrentPage('signin')}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar; 