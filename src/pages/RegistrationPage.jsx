import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CreditCard, Building, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import DiuLogo from '../components/DiuLogo';
import { DEPARTMENTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  // If already logged in, bounce to dashboard
  if (isAuthenticated) {
    navigate('/student/dashboard', { replace: true });
    return null;
  }

  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    department: 'Department of Computer Science and Engineering',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2)
      errs.fullName = 'Full name must be at least 2 characters.';
    if (!formData.studentId.trim() || formData.studentId.trim().length < 3)
      errs.studentId = 'Student ID must be at least 3 characters.';
    if (!formData.email.trim())
      errs.email = 'Email address is required.';
    else if (!EMAIL_REGEX.test(formData.email.trim()))
      errs.email = 'Please enter a valid email address (e.g. john@example.com).';
    if (!formData.password)
      errs.password = 'Password is required.';
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/student/dashboard', { replace: true }), 1500);
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('email already')) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered. Please log in instead.' }));
      } else if (msg.toLowerCase().includes('student id already')) {
        setErrors(prev => ({ ...prev, studentId: 'This Student ID is already registered.' }));
      } else {
        setServerError(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, icon: Icon, extra }) => (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Icon size={16} />
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={formData[name]}
          onChange={set(name)}
          className={`w-full pl-10 ${extra ? 'pr-10' : 'pr-4'} py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${errors[name] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}
        />
        {extra}
      </div>
      {errors[name] && <p className="text-[11px] text-rose-500 mt-1 pl-1 flex items-center gap-1"><AlertCircle size={11} />{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50/40 py-10 px-4 sm:px-6 flex flex-col justify-center items-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg mb-4 flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-diu-blue transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs text-slate-400 font-medium">ROSS-SEARCH</span>
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <DiuLogo variant="light" className="mb-3" />
          <h2 className="text-2xl font-extrabold text-diu-darkBlue">Student Registration</h2>
          <p className="text-xs text-slate-500 mt-1">Create your ROSS-SEARCH account</p>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-medium">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Registration Successful!</p>
              <p className="text-emerald-700">Redirecting to your student dashboard...</p>
            </div>
          </div>
        )}

        {/* Server Error */}
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field name="fullName" label="Full Name" placeholder="Your full name" icon={User} />
            <Field name="studentId" label="Student ID" placeholder="e.g. 221-15-809" icon={CreditCard} />

            {/* Department dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building size={16} />
                </span>
                <select
                  value={formData.department}
                  onChange={set('department')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all appearance-none"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="yourname@example.com"
                  value={formData.email}
                  onChange={set('email')}
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1 pl-1 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
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
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 mt-1 pl-1 flex items-center gap-1"><AlertCircle size={11} />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={set('confirmPassword')}
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${errors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-500 mt-1 pl-1 flex items-center gap-1"><AlertCircle size={11} />{errors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-sm font-semibold shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Creating account...</>
                ) : 'Create Account'}
              </button>
            </div>

            <div className="text-center pt-1">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-diu-blue font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
