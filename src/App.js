import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signin from './pages/Signin';
import DashboardLayout from './DashboardLayout';
import AddProject from './pages/AddProject';
import AddMessage from './pages/AddMessage';
import { useAuth } from './context/AuthContext';
import './App.css';

function AppWrapper() {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('messages');
        return saved ? JSON.parse(saved) : [];
    });
    const [toast, setToast] = useState(null);
    const { user, loading } = useAuth();
    const [currentPage, setCurrentPage] = useState('landing');

    useEffect(() => {
        if (!loading) {
            if (user) setCurrentPage('dashboard');
            else setCurrentPage('landing');
        }
    }, [user, loading]);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    let page = null;
    if (currentPage === 'login') {
        page = <Login showToast={showToast} setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'signin') {
        page = <Signin showToast={showToast} setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'dashboard') {
        page = <DashboardLayout messages={messages} setMessages={setMessages} showToast={showToast} setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'add-project') {
        page = <AddProject setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'add-message') {
        page = <AddMessage messages={messages} setMessages={setMessages} setCurrentPage={setCurrentPage} />;
    } else {
        page = (
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
                    <button onClick={() => setCurrentPage('login')} style={{
                        padding: '0.7em 2.2em',
                        fontSize: '1.1rem',
                        borderRadius: '2em',
                        border: 'none',
                        background: 'linear-gradient(90deg, #7b61ff 60%, #1976d2 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(123,97,255,0.08)',
                        transition: 'background 0.2s',
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}>Login</button>
                    <button onClick={() => setCurrentPage('signin')} style={{
                        padding: '0.7em 2.2em',
                        fontSize: '1.1rem',
                        borderRadius: '2em',
                        border: 'none',
                        background: 'linear-gradient(90deg, #1976d2 60%, #7b61ff 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
                        transition: 'background 0.2s',
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}>Sign Up</button>
                </div>
            </div>
        );
    }

    return (
        <>
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
            {page}
        </>
    );
}

export default AppWrapper; 