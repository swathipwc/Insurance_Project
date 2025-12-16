import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('insurance_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setToken(parsed.token);
        setAuthToken(parsed.token);
      } catch (err) {
        console.error('Failed to parse auth from storage', err);
      }
    }
    setLoading(false);
  }, []);

  const login = (authResponse) => {
    const payload = {
      user: {
        username: authResponse.username,
        role: authResponse.role,
        userId: authResponse.userId
      },
      token: authResponse.token
    };
    setUser(payload.user);
    setToken(payload.token);
    setAuthToken(payload.token);
    localStorage.setItem('insurance_auth', JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('insurance_auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
