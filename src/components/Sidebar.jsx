import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Search, 
  Users, 
  FolderKanban, 
  BookOpen, 
  Settings, 
  LogOut, 
  Shield, 
  UserCheck,
  Tag,
  Briefcase,
  Inbox,
  UserPlus,
  Sparkles,
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
    { label: 'Topic Matching', path: '/student/matching', icon: Sparkles },
    { label: 'Search Students', path: '/students/section', icon: Users },
    { label: 'My Teams', path: '/teams/my-teams', icon: FolderKanban },
    { label: 'Research Resources', path: '/resources', icon: BookOpen },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const supervisorLinks = [
    { label: 'Supervisor Hub', path: '/supervisor/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/supervisor/profile', icon: User },
    { label: 'Research Expertise', path: '/supervisor/expertise', icon: Tag },
    { label: 'Publish Topics', path: '/supervisor/interests/publish', icon: BookOpen },
    { label: 'Opportunities', path: '/supervisor/opportunities', icon: Briefcase },
    { label: 'Student Requests', path: '/supervisor/requests', icon: Inbox },
    { label: 'Assign Student', path: '/supervisor/assign-student', icon: UserPlus },
    { label: 'Assign Team', path: '/supervisor/assign-team', icon: FolderKanban },
    { label: 'Active Assignments', path: '/supervisor/assignments', icon: Users },
    { label: 'All Faculty Directory', path: '/supervisors', icon: Search },
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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-diu-sidebar text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <DiuLogo variant="dark" />
          <button
            onClick={onClose}
            className="lg:hidden text-slate-300 hover:text-white p-1 rounded-lg"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Role Tag */}
        <div className="px-5 py-3 border-b border-white/5 bg-black/10 shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase block">
            Portal Access Role
          </span>
          <span className="text-xs font-bold text-diu-green capitalize flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-diu-green animate-pulse" />
            {currentUserRole === 'admin' ? 'Institutional Administrator' : currentUserRole === 'supervisor' ? 'Research Supervisor' : 'Undergraduate Student'}
          </span>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-diu-blue text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={16} className="shrink-0 stroke-[2.2]" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Bottom Footer */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-black/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
