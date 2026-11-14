import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Public & Auth Pages
import HomePage from './pages/HomePage';
import AccountTypeSelectionPage from './pages/AccountTypeSelectionPage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import SupervisorRegistrationPage from './pages/SupervisorRegistrationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import LoginPage from './pages/LoginPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import EditStudentProfile from './pages/EditStudentProfile';
import ResearchInterestsPage from './pages/ResearchInterestsPage';
import SearchStudentsSection from './pages/SearchStudentsSection';
import ResearchMatchingPage from './pages/student/ResearchMatchingPage';

// Supervisor Pages & Robayet Islam's Modules
import FindSupervisorPage from './pages/FindSupervisorPage';
import SupervisorProfile from './pages/SupervisorProfile';
import EditSupervisorProfile from './pages/EditSupervisorProfile';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import ResearchExpertisePage from './pages/supervisor/ResearchExpertisePage';
import PublishResearchInterestPage from './pages/supervisor/PublishResearchInterestPage';
import ResearchOpportunitiesPage from './pages/supervisor/ResearchOpportunitiesPage';
import SupervisorRequestsPage from './pages/supervisor/SupervisorRequestsPage';
import IndividualStudentAssignmentPage from './pages/supervisor/IndividualStudentAssignmentPage';
import TeamAssignmentPage from './pages/supervisor/TeamAssignmentPage';
import AssignedStudentsTeamsPage from './pages/supervisor/AssignedStudentsTeamsPage';

// Team Pages (Tamim Hasan Sami integration)
import TeamSearchPage from './pages/TeamSearchPage';
import CreateTeamPage from './pages/CreateTeamPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import MyTeamsPage from './pages/MyTeamsPage';

// Admin Pages (Riya Saha / System Admin)
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
          {/* ── Public & Registration Routes (Phase 1–4) ────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<AccountTypeSelectionPage />} />
          <Route path="/register/student" element={<StudentRegistrationPage />} />
          <Route path="/register/supervisor" element={<SupervisorRegistrationPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ── Authenticated Dashboard Wrapper ─────────────────────────── */}
          <Route element={<DashboardLayout />}>

            {/* ── STUDENT ROUTES ────────────────────────────────────────── */}
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
            <Route path="/student/matching" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <ResearchMatchingPage />
              </ProtectedRoute>
            } />
            <Route path="/students/section" element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <SearchStudentsSection />
              </ProtectedRoute>
            } />

            {/* ── SUPERVISOR DISCOVERY (Student & Supervisor View) ──────── */}
            <Route path="/supervisors" element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'admin']}>
                <FindSupervisorPage />
              </ProtectedRoute>
            } />
            <Route path="/supervisors/:id" element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'admin']}>
                <SupervisorProfile />
              </ProtectedRoute>
            } />

            {/* ── ROBAYET ISLAM'S 10 MODULE 1 SUPERVISOR AREAS ─────────── */}
            <Route path="/supervisor/dashboard" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <SupervisorDashboard />
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
            <Route path="/supervisor/expertise" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <ResearchExpertisePage />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/interests/publish" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <PublishResearchInterestPage />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/opportunities" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <ResearchOpportunitiesPage />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/requests" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <SupervisorRequestsPage />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/assign-student" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <IndividualStudentAssignmentPage />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/assign-team" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <TeamAssignmentPage />
              </ProtectedRoute>
            } />
            <Route path="/supervisor/assignments" element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <AssignedStudentsTeamsPage />
              </ProtectedRoute>
            } />

            {/* ── TEAM ROUTES (Tamim Hasan Sami Integration) ─────────────── */}
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
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'admin']}>
                <MyTeamsPage />
              </ProtectedRoute>
            } />

            {/* ── ADMIN ROUTES (Riya Saha Integration) ───────────────────── */}
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

            {/* ── SHARED UTILITIES ───────────────────────────────────────── */}
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

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
