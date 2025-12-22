

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Verify token and get user data
      verifyAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAuth = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/auth/verify`);
      setUser(data.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Auth verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
