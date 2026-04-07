/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../api/client.js';
import { login as apiLogin, register as apiRegister } from '../api/auth.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'rently_token';
const USER_KEY  = 'rently_user';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // When no backend is configured, auto-sign-in as a demo user
  const isDemoMode = !API_URL;

  useEffect(() => {
    if (isDemoMode && !user) {
      const demoUser = { id: 'demo', email: 'demo@rently.com', fullName: 'Demo Manager', role: 'manager' };
      setUser(demoUser);
    }
  }, [isDemoMode, user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token: tok, user: u } = await apiLogin(email, password);
      localStorage.setItem(TOKEN_KEY, tok);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setToken(tok);
      setUser(u);
      return u;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    setLoading(true);
    setError(null);
    try {
      const { token: tok, user: u } = await apiRegister(email, password, fullName);
      localStorage.setItem(TOKEN_KEY, tok);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setToken(tok);
      setUser(u);
      return u;
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = isDemoMode || (!!token && !!user);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, isAuthenticated, isDemoMode, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
