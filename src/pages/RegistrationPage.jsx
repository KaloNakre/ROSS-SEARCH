import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CreditCard, Building, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import DiuLogo from '../components/DiuLogo';
import { DEPARTMENTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { login, updateStudentProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    department: 'Department of Computer Science and Engineering',
    email: '',
    password: '',
    confirmPassword: '',
    researchInterests: []
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const interestOptions = [
    "Machine Learning",
    "Cyber Security",
    "Data Science",
    "AI & Robotics",
    "Others"
  ];

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const exists = prev.researchInterests.includes(interest);
      return {
        ...prev,
        researchInterests: exists
          ? prev.researchInterests.filter(i => i !== interest)
          : [...prev.researchInterests, interest]
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.studentId.trim()) errs.studentId = 'Student ID is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (formData.researchInterests.length === 0) {
      errs.researchInterests = 'Please select at least one research interest';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Save profile into Auth context
    updateStudentProfile({
      name: formData.fullName,
      studentId: formData.studentId,
      department: formData.department,
      email: formData.email,
      interests: formData.researchInterests
    });

    setSuccess(true);
    setTimeout(() => {
      login(formData.email, formData.password, 'student');
      navigate('/student/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50/40 py-10 px-4 sm:px-6 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative Wave Graphics */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-lg mb-4 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-diu-blue transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs text-slate-400 font-medium">ROSS-SEARCH</span>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <DiuLogo variant="light" className="mb-3" />
          <h2 className="text-2xl font-extrabold text-diu-darkBlue">Student Registration</h2>
          <p className="text-xs text-slate-500 mt-1">
            Join ROSS-SEARCH and start your research journey
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-medium animate-fadeIn">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Registration Successful!</p>
              <p className="text-emerald-700">Redirecting to your student dashboard...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </span>
              <input
                type="text"
                placeholder="Full Name (e.g. Student Candidate)"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${
                  errors.fullName ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-[11px] text-rose-500 mt-1 pl-1">{errors.fullName}</p>}
          </div>

          {/* Student ID */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard size={16} />
              </span>
              <input
                type="text"
                placeholder="Student ID (e.g. 211-15-XXXX)"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${
                  errors.studentId ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.studentId && <p className="text-[11px] text-rose-500 mt-1 pl-1">{errors.studentId}</p>}
          </div>

          {/* Department Dropdown */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building size={16} />
              </span>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="Official Email Address (@s.diu.edu.bd)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${
                  errors.email ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1 pl-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${
                  errors.password ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1 pl-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white transition-all ${
                  errors.confirmPassword ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.confirmPassword && <p className="text-[11px] text-rose-500 mt-1 pl-1">{errors.confirmPassword}</p>}
          </div>

          {/* Research Interests (Select Multiple) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Research Interests (Select Multiple)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {interestOptions.map((interest) => {
                const checked = formData.researchInterests.includes(interest);
                return (
                  <label
                    key={interest}
                    className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer select-none transition-all ${
                      checked
                        ? 'border-diu-blue bg-blue-50/70 text-diu-blue font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleInterestToggle(interest)}
                      className="rounded text-diu-blue focus:ring-diu-blue h-3.5 w-3.5 border-slate-300"
                    />
                    <span>{interest}</span>
                  </label>
                );
              })}
            </div>
            {errors.researchInterests && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.researchInterests}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={success}
              className="w-full py-3 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-sm font-semibold shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {success ? 'Account Registered!' : 'Register'}
            </button>
          </div>

          {/* Bottom link to Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-diu-blue font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;

