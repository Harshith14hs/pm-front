import React from 'react';
import './App.css';

function AppWrapper() {
    const [messages, setMessages] = React.useState(() => {
        const saved = localStorage.getItem('messages');
        return saved ? JSON.parse(saved) : [];
    });
    const [toast, setToast] = React.useState(null);
    React.useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };
    return <>
        {toast && (
            <div style={{
                position: 'fixed',
                top: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #7b61ff 60%, #1976d2 100%)',
                color: '#fff',
                padding: '12px 32px',
                borderRadius: 24,
                fontWeight: 600,
                fontSize: '1.1rem',
                zIndex: 9999,
                boxShadow: '0 2px 12px rgba(123,97,255,0.13)'
            }}>{toast}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Welcome to Project Manage App</h1>
            <p>This is a static landing page. All navigation is handled by the backend.</p>
        </div>
    </>;
}

export default AppWrapper; 