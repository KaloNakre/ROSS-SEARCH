import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Building, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  GraduationCap
} from 'lucide-react';
import DiuLogo from '../components/DiuLogo';
import { DEPARTMENTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

// Standard RFC-compliant email regular expression accepting legitimate domains (.com, .edu, .ac.bd, etc.)
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// Top-level reusable form input component — declared outside to prevent component remounting on typing
const TextInputField = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  maxLength,
  icon: Icon,
  error,
  autoComplete,
  extraRight
}) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label htmlFor={id} className="block text-xs font-bold text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </label>
      {maxLength && (
        <span className="text-[10px] text-slate-400 font-mono">
          {value?.length || 0}/{maxLength}
        </span>
      )}
    </div>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Icon size={16} />
      </span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`w-full pl-10 ${extraRight ? 'pr-11' : 'pr-4'} py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${
          error ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
        }`}
      />
      {extraRight}
    </div>
    {error && (
      <p className="text-[11px] text-rose-500 mt-1 pl-1 flex items-center gap-1">
        <AlertCircle size={12} className="shrink-0" />
        <span>{error}</span>
      </p>
    )}
  </div>
);

export const StudentRegistrationPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  // ── ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURN ──────────────
  // Declaring hooks after a conditional return violates React's Rules of Hooks.
  // This was the root cause of focus loss: React detected hook-order mismatch
  // on every render, remounted the component, and the browser lost input focus
  // after every single keystroke. Fixed by hoisting all useState calls here.
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

  // Early redirect AFTER all hooks — this is the correct placement
  if (isAuthenticated) {
    navigate('/student/dashboard', { replace: true });
    return null;
  }

  // Smooth, non-blocking input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the specific field error when the user edits that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Comprehensive Form Validation as specified in Phase 2
  const validateForm = () => {
    const newErrors = {};

    // 1. Full Name: required, max 32 chars, min 2 chars
    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = 'Full Name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters.';
    } else if (trimmedName.length > 32) {
      newErrors.fullName = 'Full Name cannot exceed 32 characters.';
    }

    // 2. Student ID: required, max 15 chars, alphanumeric with hyphens
    const trimmedId = formData.studentId.trim();
    if (!trimmedId) {
      newErrors.studentId = 'Student ID is required.';
    } else if (trimmedId.length < 3) {
      newErrors.studentId = 'Student ID must be at least 3 characters.';
    } else if (trimmedId.length > 15) {
      newErrors.studentId = 'Student ID cannot exceed 15 characters.';
    } else if (!/^[a-zA-Z0-9-]+$/.test(trimmedId)) {
      newErrors.studentId = 'Student ID contains invalid characters. Use alphanumeric and hyphens (e.g. 201-15-809).';
    }

    // 3. Department: required, max 30 chars
    const trimmedDept = formData.department.trim();
    if (!trimmedDept) {
      newErrors.department = 'Department is required.';
    } else if (trimmedDept.length > 30) {
      // In case user selected custom text exceeding 30 characters
      newErrors.department = 'Department name cannot exceed 30 characters.';
    }

    // 4. Email: required, valid syntax, max 254 chars, legitimate domains (.com, .edu, .ac.bd)
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email Address is required.';
    } else if (trimmedEmail.length > 254) {
      newErrors.email = 'Email Address cannot exceed 254 characters.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Please provide a valid email address (e.g. student@diu.edu.bd).';
    }

    // 5. Password: required, min 8 chars, max 15 chars
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (formData.password.length > 15) {
      newErrors.password = 'Password cannot exceed 15 characters.';
    }

    // 6. Confirm Password: required, must match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department.slice(0, 30),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/student/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('email already')) {
        setErrors((prev) => ({
          ...prev,
          email: 'This email is already registered. Please log in instead.',
        }));
      } else if (msg.toLowerCase().includes('student id already')) {
        setErrors((prev) => ({
          ...prev,
          studentId: 'This Student ID is already registered.',
        }));
      } else {
        setServerError(msg || 'Registration could not be completed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50/40 py-10 px-4 sm:px-6 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <div className="w-full max-w-lg mb-4 flex justify-between items-center z-10">
        <Link 
          to="/register" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-diu-blue transition-colors"
        >
          <ArrowLeft size={14} /> Back to Role Selection
        </Link>
        <span className="text-xs text-slate-400 font-medium">ROSS-SEARCH DIU</span>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 relative z-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <DiuLogo variant="light" className="mb-3" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-diu-blue text-xs font-bold mb-2">
            <GraduationCap size={15} /> Student Academic Portal
          </div>
          <h1 className="text-2xl font-extrabold text-diu-darkBlue">Student Registration</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create your undergraduate research account to join teams and connect with faculty supervisors.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-medium">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Account Created Successfully!</p>
              <p className="text-emerald-700 mt-0.5">Redirecting you to your student research dashboard...</p>
            </div>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* 1. Full Name (Max 32 chars) */}
            <TextInputField
              id="student-full-name"
              name="fullName"
              label="Full Name"
              placeholder="e.g. Robayet Islam"
              value={formData.fullName}
              onChange={handleChange}
              maxLength={32}
              icon={User}
              error={errors.fullName}
              autoComplete="name"
            />

            {/* 2. Student ID (Max 15 chars) */}
            <TextInputField
              id="student-id-field"
              name="studentId"
              label="Student ID"
              placeholder="e.g. 201-15-809"
              value={formData.studentId}
              onChange={handleChange}
              maxLength={15}
              icon={CreditCard}
              error={errors.studentId}
              autoComplete="off"
            />

            {/* 3. Department (Max 30 chars in state) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="student-dept-field" className="block text-xs font-bold text-slate-700">
                  Department <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formData.department.length}/30 max
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building size={16} />
                </span>
                <select
                  id="student-dept-field"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all appearance-none ${
                    errors.department ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                >
                  <option value="Department of CSE">Department of CSE</option>
                  <option value="Department of Software Eng.">Department of Software Eng.</option>
                  <option value="Department of ITM">Department of ITM</option>
                  <option value="Department of Data Science">Department of Data Science</option>
                  <option value="Department of EEE">Department of EEE</option>
                </select>
              </div>
              {errors.department && (
                <p className="text-[11px] text-rose-500 mt-1 pl-1 flex items-center gap-1">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.department}</span>
                </p>
              )}
            </div>

            {/* 4. Email Address (Max 254 chars) */}
            <TextInputField
              id="student-email-field"
              name="email"
              type="email"
              label="Email Address"
              placeholder="e.g. robayet.cse@diu.edu.bd"
              value={formData.email}
              onChange={handleChange}
              maxLength={254}
              icon={Mail}
              error={errors.email}
              autoComplete="email"
            />

            {/* 5. Password (Min 8, Max 15 chars) */}
            <TextInputField
              id="student-password-field"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password (8–15 characters)"
              placeholder="Enter secure password"
              value={formData.password}
              onChange={handleChange}
              maxLength={15}
              icon={Lock}
              error={errors.password}
              autoComplete="new-password"
              extraRight={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* 6. Confirm Password */}
            <TextInputField
              id="student-confirm-password-field"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              maxLength={15}
              icon={Lock}
              error={errors.confirmPassword}
              autoComplete="new-password"
              extraRight={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Creating Student Account...</span>
                  </>
                ) : (
                  'Create Student Account'
                )}
              </button>
            </div>

            {/* Sign in Footer */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="text-diu-blue font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentRegistrationPage;
