import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials) => {
    const data = await api.login(credentials);
    localStorage.setItem('token', data.token);
    const userData = {
      username: data.username,
      fullName: data.fullName,
      role: data.role,
      phone: data.phone || (data.username === 'khach01' ? '0988776655' : ''),
      email: data.email || (data.username === 'khach01' ? 'khachhang@gmail.com' : '')
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  useEffect(() => {
    // If user is loaded from localStorage but missing phone/email, fetch current user info
    const token = localStorage.getItem('token');
    if (token && user && (!user.phone || !user.email)) {
      api.getCurrentUser().then(fullUser => {
        if (fullUser) {
          const updated = {
            ...user,
            phone: fullUser.phone || user.phone || '',
            email: fullUser.email || user.email || ''
          };
          localStorage.setItem('user', JSON.stringify(updated));
          setUser(updated);
        }
      }).catch(() => {});
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
