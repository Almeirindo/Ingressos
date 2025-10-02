import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: 'USER' | 'ADMIN';
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const raw = localStorage.getItem('token');
    return raw && raw !== 'undefined' ? raw : null;
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      // Corrupted value; clean up and start fresh
      localStorage.removeItem('user');
      return null;
    }
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    login: (t, u) => {
      setToken(t);
      setUser(u);
    },
    logout: () => {
      setToken(null);
      setUser(null);
    }
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

