import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API_BASE_URL =  'https://pm-back.onrender.com';


export const AuthProvider = ({ children, onSessionExpired }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthContext useEffect: token in localStorage:', token);
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      console.log('AuthContext checkAuth: using token:', token);
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      setUser(response.data);
      console.log('AuthContext checkAuth user:', response.data);
      if (!response.data || !response.data.username) {
        console.error('AuthContext: /api/auth/me did not return a valid user object:', response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      if (error.response) {
        console.error('AuthContext checkAuth error: status', error.response.status, 'data:', error.response.data);
        if (error.response.status === 404 && error.response.data && error.response.data.error === 'User not found') {
          alert('Session expired or user not found. Please log in again.');
          if (typeof onSessionExpired === 'function') onSessionExpired();
        }
      } else {
        console.error('AuthContext checkAuth error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password
    });
    console.log('Login API response:', response.data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    console.log('AuthContext login user:', user);
    if (!user || !user.username) {
      console.error('AuthContext: login did not return a valid user object:', user);
    }
    return user;
  };

  const register = async (username, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      username,
      email,
      password
    });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    console.log('AuthContext register user:', user);
    if (!user || !user.username) {
      console.error('AuthContext: register did not return a valid user object:', user);
    }
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 