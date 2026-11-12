import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from './NeutralAvatar';

export const Topbar = ({ onToggleSidebar }) => {
  const {
    currentUser,
    currentUserRole,
    logout
  } = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = currentUser?.full_name || currentUser?.email || 'User';
  const roleLabel = currentUserRole ? currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1) : 'Student';
  const profilePath = currentUserRole === 'supervisor' ? '/supervisor/profile' : '/student/profile';

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-diu-blue font-bold">ROSS-SEARCH</span>
          <span>/</span>
          <span className="text-slate-600 capitalize">{currentUserRole} Portal</span>
        </div>
      </div>

      {/* Middle: Brand Status Badge */}
      <div className="hidden md:flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
        <span className="text-xs font-semibold text-slate-600">
          Authenticated Session ({roleLabel})
        </span>
      </div>

      {/* Right: User Profile & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
        >
          <NeutralAvatar
            src={null}
            size="sm"
            className="rounded-lg shadow-xs"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              {displayName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {roleLabel}
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-800 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-400 capitalize">{currentUserRole} Account</p>
            </div>

            {/* Links */}
            <div className="py-1">
              {currentUserRole !== 'admin' && (
                <Link
                  to={profilePath}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-diu-blue"
                >
                  <User size={14} /> My Profile
                </Link>
              )}
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-diu-blue"
              >
                <Settings size={14} /> Account Settings
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
