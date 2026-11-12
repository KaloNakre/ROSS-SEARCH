import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// ── API base URL — change to production URL when deploying backend ──────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Thin API client ─────────────────────────────────────────────────────────
async function apiCall(path, options = {}) {
  const token = localStorage.getItem('ross_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.detail || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('ross_token') || null);
  const [currentUser, setCurrentUser] = useState(null); // { id, email, role, is_active, profile }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // initial hydration

  // ── Derived role shortcut ───────────────────────────────────────────────
  const currentUserRole = currentUser?.role || 'student';

  // ── Persist token ───────────────────────────────────────────────────────
  useEffect(() => {
    if (token) {
      localStorage.setItem('ross_token', token);
    } else {
      localStorage.removeItem('ross_token');
    }
  }, [token]);

  // ── Hydrate user from /api/auth/me on mount ────────────────────────────
  const hydrateUser = useCallback(async () => {
    const stored = localStorage.getItem('ross_token');
    if (!stored) { setLoading(false); return; }
    try {
      const user = await apiCall('/api/auth/me');
      setCurrentUser(user);
      setIsAuthenticated(true);
      setToken(stored);
    } catch {
      // Token invalid or expired — clear everything
      localStorage.removeItem('ross_token');
      setToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { hydrateUser(); }, [hydrateUser]);

  // ── Register (student only) ─────────────────────────────────────────────
  const register = async ({ fullName, studentId, department, email, password }) => {
    const data = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        full_name: fullName,
        student_id: studentId,
        department,
        email,
        password,
      }),
    });
    setToken(data.access_token);
    // Fetch full profile after registration
    const user = await apiCall('/api/auth/me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  // ── Login ───────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    const user = await apiCall('/api/auth/me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = async () => {
    try { await apiCall('/api/auth/logout', { method: 'POST' }); } catch {}
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ross_token');
  };

  // ── Update student profile locally after PUT /api/students/me ──────────
  const refreshUser = async () => {
    try {
      const user = await apiCall('/api/auth/me');
      setCurrentUser(user);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{
      // State
      token,
      currentUser,
      currentUserRole,
      isAuthenticated,
      loading,
      // Actions
      register,
      login,
      logout,
      refreshUser,
      apiCall,
      API_BASE,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
