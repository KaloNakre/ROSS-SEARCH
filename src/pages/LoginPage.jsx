import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, BookOpen, Globe, ArrowLeft, AlertCircle } from 'lucide-react';
import DiuLogo from '../components/DiuLogo';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUserRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect immediately
  if (isAuthenticated) {
    if (currentUserRole === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (currentUserRole === 'supervisor') navigate('/supervisor/dashboard', { replace: true });
    else navigate('/student/dashboard', { replace: true });
    return null;
  }

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address (e.g. yourname@example.com).'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    try {
      const user = await login(email.trim().toLowerCase(), password);
      // Role-based redirect from actual server response
      if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (user.role === 'supervisor') navigate('/supervisor/dashboard', { replace: true });
      else navigate('/student/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('incorrect') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (msg.toLowerCase().includes('deactivated') || msg.toLowerCase().includes('inactive')) {
        setError('Your account has been deactivated. Contact the administrator.');
      } else if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no user')) {
        setError('No account found with this email address.');
      } else {
        setError(msg || 'Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">

        {/* Left Branding Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-50 via-white to-emerald-50/50 p-8 sm:p-10 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-100 overflow-hidden">
          <div>
            <DiuLogo variant="light" />
          </div>
          <div className="my-8 text-center space-y-4">
            <h1 className="text-2xl font-black text-diu-darkBlue tracking-tight">ROSS-SEARCH</h1>
            <p className="text-sm italic font-serif text-slate-600">"Knowledge is Power"</p>
            <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-blue-100/60 flex items-center justify-center border-2 border-blue-200 shadow-inner">
                <Globe className="w-20 h-20 text-diu-blue/70 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 bg-white px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 text-xs font-bold text-diu-green">
                <BookOpen size={16} />
                <span>Shared Knowledge</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Smart search and FYP collaboration platform for Daffodil International University.
            </p>
          </div>
          <div className="relative z-10 pt-4 flex items-center justify-between text-xs text-slate-400">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-diu-blue font-medium">
              <ArrowLeft size={13} /> Back to Home
            </Link>
            <span>v1.0 Module 1</span>
          </div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-200/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-left mb-6">
              <h2 className="text-2xl font-extrabold text-diu-darkBlue">Welcome Back!</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in with your registered email and password.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex justify-end text-xs">
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Please contact your administrator to reset your password.'); }}
                  className="text-diu-blue hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Register link */}
            <div className="text-center pt-5">
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-diu-blue font-semibold hover:underline">
                  Register as Student
                </Link>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supervisors and admins are added by the system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
