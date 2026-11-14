import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// API base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API client helper
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

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('ross_token') || null);
  const [currentUser, setCurrentUser] = useState(null); // { id, email, role, is_active, profile }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Derived role shortcut
  const currentUserRole = currentUser?.role || 'student';

  // Persist token
  useEffect(() => {
    if (token) {
      localStorage.setItem('ross_token', token);
    } else {
      localStorage.removeItem('ross_token');
    }
  }, [token]);

  // Hydrate user from /api/auth/me on mount
  const hydrateUser = useCallback(async () => {
    const stored = localStorage.getItem('ross_token');
    if (!stored) { setLoading(false); return; }
    try {
      const user = await apiCall('/api/auth/me');
      setCurrentUser(user);
      setIsAuthenticated(true);
      setToken(stored);
    } catch {
      localStorage.removeItem('ross_token');
      setToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { hydrateUser(); }, [hydrateUser]);

  // Student Registration
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
    const user = await apiCall('/api/auth/me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  // Supervisor Registration
  const registerSupervisor = async ({ fullName, department, designation, email, password }) => {
    const data = await apiCall('/api/auth/register/supervisor', {
      method: 'POST',
      body: JSON.stringify({
        full_name: fullName,
        department,
        designation: designation || 'Assistant Professor',
        email,
        password,
      }),
    });
    setToken(data.access_token);
    const user = await apiCall('/api/auth/me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  // Standard Login
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

  // Admin Login (Secure Portal)
  const adminLogin = async ({ fullId, adminId, gmailAddress, password }) => {
    const data = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: gmailAddress.trim().toLowerCase(), password }),
    });
    setToken(data.access_token);
    const user = await apiCall('/api/auth/me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    if (user.role !== 'admin') {
      localStorage.removeItem('ross_token');
      setToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      throw new Error('Access denied. This account does not possess System Administrator privileges.');
    }
    setCurrentUser(user);
    setIsAuthenticated(true);
    return user;
  };

  // Logout
  const logout = async () => {
    try { await apiCall('/api/auth/logout', { method: 'POST' }); } catch {}
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ross_token');
  };

  // Profile refresh
  const refreshUser = async () => {
    try {
      const user = await apiCall('/api/auth/me');
      setCurrentUser(user);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{
      token,
      currentUser,
      currentUserRole,
      isAuthenticated,
      loading,
      register,
      registerSupervisor,
      login,
      adminLogin,
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
