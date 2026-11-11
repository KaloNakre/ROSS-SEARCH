import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, BookOpen, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import DiuLogo from '../components/DiuLogo';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'student' && !email) setEmail('student.candidate@s.diu.edu.bd');
    else if (role === 'supervisor' && !email) setEmail('supervisor.faculty@diu.edu.bd');
    else if (role === 'admin' && !email) setEmail('admin.office@diu.edu.bd');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your university email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    login(email, password, selectedRole);
    if (selectedRole === 'admin') navigate('/admin/dashboard');
    else if (selectedRole === 'supervisor') navigate('/supervisor/dashboard');
    else navigate('/student/dashboard');
  };

  const handleOAuthLogin = (provider) => {
    login(`${provider.toLowerCase()}@s.diu.edu.bd`, 'oauth-pass', selectedRole);
    navigate(selectedRole === 'admin' ? '/admin/dashboard' : selectedRole === 'supervisor' ? '/supervisor/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Branding Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-50 via-white to-emerald-50/50 p-8 sm:p-10 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-100 overflow-hidden">
          
          {/* Top Logo */}
          <div>
            <DiuLogo variant="light" />
          </div>

          {/* Center Graphic & Tagline */}
          <div className="my-8 text-center space-y-4">
            <h1 className="text-2xl font-black text-diu-darkBlue tracking-tight">
              ROSS-SEARCH
            </h1>
            <p className="text-sm italic font-serif text-slate-600">
              "Knowledge is Power"
            </p>

            {/* Custom Clean Vector Illustration (Globe + Open Book) */}
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
              Smart search and FYP collaboration platform for Daffodil International University students and faculty.
            </p>
          </div>

          {/* Decorative Waves */}
          <div className="relative z-10 pt-4 flex items-center justify-between text-xs text-slate-400">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-diu-blue font-medium">
              <ArrowLeft size={13} /> Back to Home
            </Link>
            <span>v1.0 Module 1</span>
          </div>

          {/* Background curved waves */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-200/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            <div className="text-left mb-6">
              <h2 className="text-2xl font-extrabold text-diu-darkBlue">Welcome Back!</h2>
              <p className="text-xs text-slate-500 mt-1">Login to your account</p>
            </div>

            {/* Role Selection Tabs */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['student', 'supervisor', 'admin'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                      selectedRole === role
                        ? 'bg-diu-blue text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-diu-blue focus:ring-diu-blue h-3.5 w-3.5 border-slate-300"
                  />
                  <span>Remember Me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact DIU IT support or use university student portal for password reset.'); }} className="text-diu-blue hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.99]"
                >
                  Login as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
                  OR
                </span>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('Google')}
                  className="w-full py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Login with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('Microsoft')}
                  className="w-full py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Login with Microsoft</span>
                </button>
              </div>

              {/* Register link */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-diu-blue font-semibold hover:underline">
                    Register here
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

