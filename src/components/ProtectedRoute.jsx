import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps a route and enforces:
 *   1. Authentication (must be logged in)
 *   2. Role restriction (optional: allowedRoles array)
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
 *   <ProtectedRoute allowedRoles={['student', 'admin']}><StudentPage /></ProtectedRoute>
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, currentUserRole, loading } = useAuth();

  // While hydrating from localStorage, show nothing (avoid flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role check: if allowedRoles specified and current role not in it
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUserRole)) {
    // Redirect to the user's correct dashboard instead of an error page
    if (currentUserRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUserRole === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

