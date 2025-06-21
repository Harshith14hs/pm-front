import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ClientMessage.css';

const ClientMessages = ({ messages = [], setMessages }) => {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  const handleDelete = idx => {
    setMessages(prev => prev.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const filteredMessages = search
    ? messages.filter(msg =>
        (msg.name && msg.name.toLowerCase().includes(search.toLowerCase())) ||
        (msg.text && msg.text.toLowerCase().includes(search.toLowerCase()))
      )
    : messages;

  return (
    <aside className="client-messages">
      <div className="client-messages-header">
        <span className='client'>Client Messages</span>
        <span className="client-messages-search" onClick={() => setSearchOpen(v => !v)}>🔍</span>
        <input
          ref={inputRef}
          className={`client-messages-searchbar${searchOpen ? ' open' : ''}`}
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="client-messages-list">
        {filteredMessages.length === 0 ? (
          <div className="no-client-messages">No messages found.</div>
        ) : (
          filteredMessages.map((msg, idx) => {
            const isOwner = user && msg.name === user.username;
            return (
              <div className="client-message" key={idx}>
                <img src={msg.avatar} alt={msg.name} className="client-message-avatar" />
                <div className="client-message-content">
                  <div className="client-message-name">{msg.name}</div>
                  <div className="client-message-text">{msg.text}</div>
                </div>
                <div className="client-message-meta">
                  <span className="client-message-date">{msg.date}</span>
                  {isOwner && (
                    <button className="client-message-delete" title="Delete Message" onClick={() => handleDelete(idx)}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M7.5 7.5V14.5M10 7.5V14.5M12.5 7.5V14.5M4.5 5.5H15.5M8.5 3.5H11.5C12.0523 3.5 12.5 3.94772 12.5 4.5V5.5H7.5V4.5C7.5 3.94772 7.94772 3.5 8.5 3.5Z" stroke="#d12a2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ClientMessages; 