import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, ArrowRight } from 'lucide-react';
import DiuLogo from './DiuLogo';
import { useAuth } from '../context/AuthContext';

export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUserRole } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/#about' },
    { label: 'Features', path: '/#features' },
    { label: 'Contact', path: '/#contact' },
  ];

  const dashboardRoute = currentUserRole === 'admin' 
    ? '/admin/dashboard' 
    : currentUserRole === 'supervisor' 
      ? '/supervisor/dashboard' 
      : '/student/dashboard';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <DiuLogo variant="light" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-diu-blue ${
                    isActive ? 'text-diu-blue font-semibold' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={dashboardRoute}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-sm font-medium shadow-sm transition-all"
              >
                Go to Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:text-diu-blue hover:border-diu-blue text-sm font-medium transition-all"
                >
                  <User size={15} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-sm font-medium shadow-sm hover:shadow transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-diu-blue"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-diu-blue text-white text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full border border-diu-blue text-diu-blue text-sm font-medium hover:bg-blue-50"
            >
              Get Started / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;

