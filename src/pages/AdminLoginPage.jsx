import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  KeyRound, 
  Fingerprint,
  Building2
} from 'lucide-react';
import DiuLogo from '../components/DiuLogo';
import { useAuth } from '../context/AuthContext';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { adminLogin, isAuthenticated, currentUserRole } = useAuth();

  // ── ALL HOOKS BEFORE ANY CONDITIONAL RETURN (Rules of Hooks) ─────────────
  const [formData, setFormData] = useState({
    fullId: '',
    adminId: '',
    gmailAddress: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Early redirect AFTER all hooks — correct placement per React rules
  // If already authenticated as admin, go straight to admin dashboard
  if (isAuthenticated && currentUserRole === 'admin') {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.fullId.trim()) {
      setError('Please provide your Full ID.');
      return false;
    }
    if (!formData.adminId.trim()) {
      setError('Please enter your assigned Admin ID.');
      return false;
    }
    if (!formData.gmailAddress.trim()) {
      setError('Please enter your institutional Gmail Address.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmailAddress.trim())) {
      setError('Please enter a valid email address format.');
      return false;
    }
    if (!formData.password) {
      setError('Please enter your administrator security password.');
      return false;
    }
    return true;
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await adminLogin({
        fullId: formData.fullId.trim(),
        adminId: formData.adminId.trim(),
        gmailAddress: formData.gmailAddress.trim().toLowerCase(),
        password: formData.password,
      });

      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Access denied')) {
        setError(msg);
      } else if (msg.toLowerCase().includes('incorrect') || msg.toLowerCase().includes('password')) {
        setError('Invalid administrative credentials. Please verify your ID, Gmail address, and password.');
      } else {
        setError(msg || 'Administrative authentication failed. Please ensure the server is accessible.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Subtle Security Grid Pattern & Background Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Navigation */}
        <div className="mb-6 flex justify-between items-center text-xs">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Public Portal
          </Link>
          <span className="text-slate-500 font-mono tracking-wider">RESTRICTED ACCESS</span>
        </div>

        {/* Security Shield Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-purple-950/60 border border-purple-800/50 text-purple-400 mb-3 shadow-inner">
              <ShieldCheck size={32} className="stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal Login</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              System Administration & Faculty Management Access. Institutional authorization required.
            </p>
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-start gap-2.5 text-slate-300 text-[11px]">
            <KeyRound size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <span>
              Public registration is disabled. Administrator accounts are issued directly by the Department Head.
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4" noValidate>
            {/* 1. Full ID (as requested) */}
            <div>
              <label htmlFor="admin-full-id" className="block text-xs font-semibold text-slate-300 mb-1">
                Full ID <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Fingerprint size={16} />
                </span>
                <input
                  id="admin-full-id"
                  name="fullId"
                  type="text"
                  placeholder="e.g. DIU-CSE-ADM-01"
                  value={formData.fullId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 2. Admin ID */}
            <div>
              <label htmlFor="admin-id" className="block text-xs font-semibold text-slate-300 mb-1">
                Admin ID <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 size={16} />
                </span>
                <input
                  id="admin-id"
                  name="adminId"
                  type="text"
                  placeholder="e.g. ADM-809"
                  value={formData.adminId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 3. Gmail Address */}
            <div>
              <label htmlFor="admin-gmail" className="block text-xs font-semibold text-slate-300 mb-1">
                Gmail Address <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  id="admin-gmail"
                  name="gmailAddress"
                  type="email"
                  placeholder="administrator@gmail.com or admin@diu.edu.bd"
                  value={formData.gmailAddress}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 4. Password */}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 mb-1">
                Password <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter administrator password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  'Authorize Admin Session'
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
            <p className="text-xs text-slate-400">
              Are you a student or supervisor?{' '}
              <Link to="/login" className="text-purple-400 font-semibold hover:underline">
                Standard Portal Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
