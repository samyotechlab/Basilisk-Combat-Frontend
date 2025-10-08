import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('basilisk_token');
    const storedUser = localStorage.getItem('basilisk_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('basilisk_token');
        localStorage.removeItem('basilisk_user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await api.login(credentials);
      
      const authToken = data.access_token || data.token;
      const userData = data.user || { username: credentials.username, role: 'commander' };
      
      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('basilisk_token', authToken);
      localStorage.setItem('basilisk_user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      
      const authToken = data.access_token || data.token;
      const userInfo = data.user || { 
        username: userData.username, 
        email: userData.email,
        role: userData.role || 'commander' 
      };
      
      setToken(authToken);
      setUser(userInfo);
      
      localStorage.setItem('basilisk_token', authToken);
      localStorage.setItem('basilisk_user', JSON.stringify(userInfo));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('basilisk_token');
    localStorage.removeItem('basilisk_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('basilisk_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;