import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import Login from './pages/Login';
import Signin from './pages/Signin';
import AddProject from './pages/AddProject';
import AddMessage from './pages/AddMessage';
import Home from './pages/Home';
import './App.css';
import { useAuth } from './context/AuthContext';

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
        <App messages={messages} setMessages={setMessages} showToast={showToast} />
    </>;
}

function App({ messages, setMessages, showToast }) {
    const { loading, user } = useAuth();
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="global-spinner">Loading...</div>
            </div>
        );
    }
    const AddMessageWrapper = () => <AddMessage messages={messages} setMessages={setMessages} />;
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardLayout messages={messages} setMessages={setMessages} showToast={showToast} />} />
                <Route path="/add-message" element={<AddMessageWrapper />} />
                <Route path="/add-project" element={<AddProject />} />
                <Route path="/login" element={<Login showToast={showToast} />} />
                <Route path="/signin" element={<Signin showToast={showToast} />} />
                <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
                {/* Catch all route */}
                <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default AppWrapper; 