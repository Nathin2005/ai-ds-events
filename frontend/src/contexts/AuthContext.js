import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await authAPI.verifyToken();
          if (response.data.success) {
            setAdmin(response.data.admin);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('adminToken');
            setToken(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Remove invalid token
          localStorage.removeItem('adminToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        const { token: newToken, admin: adminData } = response.data;
        localStorage.setItem('adminToken', newToken);
        setToken(newToken);
        setAdmin(adminData);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      // Call logout API if token exists
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state
      localStorage.removeItem('adminToken');
      setToken(null);
      setAdmin(null);
    }
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!admin && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};