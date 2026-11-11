import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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

// Shared Auxiliary Pages
import ResourcesPage from './pages/ResourcesPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            {/* Student Pages */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/profile/edit" element={<EditStudentProfile />} />
            <Route path="/student/research-interests" element={<ResearchInterestsPage />} />
            <Route path="/students/section" element={<SearchStudentsSection />} />

            {/* Supervisor Pages */}
            <Route path="/supervisors" element={<FindSupervisorPage />} />
            <Route path="/supervisors/:id" element={<SupervisorProfile />} />
            <Route path="/supervisor/dashboard" element={<SupervisorProfile />} />
            <Route path="/supervisor/profile" element={<SupervisorProfile />} />
            <Route path="/supervisor/profile/edit" element={<EditSupervisorProfile />} />

            {/* Team Pages */}
            <Route path="/teams/search" element={<TeamSearchPage />} />
            <Route path="/teams/create" element={<CreateTeamPage />} />
            <Route path="/teams/:id" element={<TeamDetailsPage />} />
            <Route path="/teams/my-teams" element={<MyTeamsPage />} />

            {/* Admin Pages */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/supervisors" element={<ManageSupervisorsPage />} />
            <Route path="/admin/roles" element={<RoleManagementPage />} />

            {/* Auxiliary Routes */}
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

