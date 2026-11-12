import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import EditStudentProfile from './pages/EditStudentProfile';
import ResearchInterestsPage from './pages/ResearchInterestsPage';
import SearchStudentsSection from './pages/SearchStudentsSection';

// Supervisor Pages
import FindSupervisorPage from './pages/FindSupervisorPage';
import SupervisorProfile from './pages/SupervisorProfile';
import EditSupervisorProfile from './pages/EditSupervisorProfile';

// Team Pages
import TeamSearchPage from './pages/TeamSearchPage';
import CreateTeamPage from './pages/CreateTeamPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import MyTeamsPage from './pages/MyTeamsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageSupervisorsPage from './pages/ManageSupervisorsPage';
import RoleManagementPage from './pages/RoleManagementPage';

// Shared
import ResourcesPage from './pages/ResourcesPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public Routes ─────────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ── Authenticated Dashboard Routes ─────────────────────────── */}
          <Route element={<DashboardLayout />}>

            {/* ── STUDENT routes — students and admins only ─────────────── */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/profile/edit" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <EditStudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/research-interests" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <ResearchInterestsPage />
              </ProtectedRoute>
            } />
            <Route path="/students/section" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <SearchStudentsSection />
              </ProtectedRoute>
            } />

            {/* ── SUPERVISOR discovery — students + supervisors + admin ─── */}
            <Route path="/supervisors" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <FindSupervisorPage />
              </ProtectedRoute>
            } />
            <Route path="/supervisors/:id" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <SupervisorProfile />
              </ProtectedRoute>
            } />

            {/* ── SUPERVISOR self-management — supervisors only ───────────── */}
            <Route path="/supervisor/dashboard" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <SupervisorProfile />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/profile" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <SupervisorProfile />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/profile/edit" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <EditSupervisorProfile />
              </ProtectedRoute>
            } />

            {/* ── TEAM routes — students + supervisors + admin ────────────── */}
            <Route path="/teams/search" element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'admin']}>
                <TeamSearchPage />
              </ProtectedRoute>
            } />
            <Route path="/teams/create" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <CreateTeamPage />
              </ProtectedRoute>
            } />
            <Route path="/teams/:id" element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'admin']}>
                <TeamDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/teams/my-teams" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <MyTeamsPage />
              </ProtectedRoute>
            } />

            {/* ── ADMIN routes — admin only ───────────────────────────────── */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/supervisors" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageSupervisorsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/roles" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RoleManagementPage />
              </ProtectedRoute>
            } />

            {/* ── Shared ─────────────────────────────────────────────────── */}
            <Route path="/resources" element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />

          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
