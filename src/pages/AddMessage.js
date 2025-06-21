import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddMessage = ({ messages, setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessages(prev => [
      ...prev,
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
    setTimeout(() => navigate('/dashboard'), 0);
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
        <h2 style={{ color: '#1976d2', marginBottom: '1.2em', fontWeight: 700, fontSize: '2rem', letterSpacing: 0.5 }}>Add Message</h2>
        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.1em' }} onSubmit={handleAddMessage}>
          <textarea
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type your message..."
            required
            rows={4}
            style={{ resize: 'none', borderRadius: 10, padding: 12, border: '1.5px solid #d0d7de', fontSize: '1.08rem', background: '#f8fafc', outline: 'none' }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #1976d2 80%, #2196f3 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: '1.08rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.07)',
              marginTop: '0.2em',
              transition: 'background 0.2s',
              letterSpacing: 0.5,
            }}
          >
            Add Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMessage; 