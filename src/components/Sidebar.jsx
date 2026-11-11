import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Search,
  Users,
  BookOpen,
  Settings,
  LogOut,
  FolderKanban,
  UserCheck,
  Shield,
  Layers,
  FileCheck2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DiuLogo from './DiuLogo';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUserRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-specific navigation links
  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'Find Supervisor', path: '/supervisors', icon: Search },
    { label: 'Search Students', path: '/students/section', icon: Users },
    { label: 'My Teams', path: '/teams/my-teams', icon: FolderKanban },
    { label: 'Research Resources', path: '/resources', icon: BookOpen },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const supervisorLinks = [
    { label: 'Dashboard', path: '/supervisor/dashboard', icon: LayoutDashboard },
    { label: 'Supervisor Profile', path: '/supervisor/profile', icon: User },
    { label: 'Assigned Teams', path: '/teams/my-teams', icon: FolderKanban },
    { label: 'All Supervisors', path: '/supervisors', icon: Search },
    { label: 'Search Students', path: '/students/section', icon: Users },
    { label: 'Research Resources', path: '/resources', icon: BookOpen },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminLinks = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Supervisors', path: '/admin/supervisors', icon: UserCheck },
    { label: 'Role Management', path: '/admin/roles', icon: Shield },
    { label: 'Team Directory', path: '/teams/my-teams', icon: FolderKanban },
    { label: 'Research Resources', path: '/resources', icon: BookOpen },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const links = currentUserRole === 'admin'
    ? adminLinks
    : currentUserRole === 'supervisor'
      ? supervisorLinks
      : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-diu-sidebar text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
          <DiuLogo variant="dark" />
          <button
            onClick={onClose}
            className="lg:hidden text-slate-300 hover:text-white p-1 rounded-lg"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-5 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
            Portal View
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
            {currentUserRole}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-diu-primary text-white shadow-md shadow-blue-900/40 font-semibold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom / Logout Action */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-rose-500/20 hover:text-rose-200 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

