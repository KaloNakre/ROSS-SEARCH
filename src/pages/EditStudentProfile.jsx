import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ImageUploadWidget from '../components/ImageUploadWidget';
import { DEPARTMENTS, SECTIONS } from '../data/mockData';

export const EditStudentProfile = () => {
  const navigate = useNavigate();
  const { studentProfile, updateStudentProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: studentProfile.name || '',
    studentId: studentProfile.studentId || '',
    department: studentProfile.department || DEPARTMENTS[0],
    section: studentProfile.section || '60_A',
    batch: studentProfile.batch || '60th Batch',
    email: studentProfile.email || '',
    phone: studentProfile.phone || '',
    projectTitle: studentProfile.projectTitle || '',
    bio: studentProfile.bio || '',
    profileImage: studentProfile.profileImage || null
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleImageChange = (newImage) => {
    setFormData(prev => ({ ...prev, profileImage: newImage }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatusMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    updateStudentProfile(formData);
    setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });

    setTimeout(() => {
      navigate('/student/profile');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/student/profile"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Student Profile
            </h1>
            <p className="text-xs text-slate-500">
              Update personal details and manage optional profile picture
            </p>
          </div>
        </div>

        <Link
          to="/student/profile"
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
        >
          Cancel
        </Link>
      </div>

      {/* Status Alert */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Optional Image Upload Widget */}
        <ImageUploadWidget
          currentImage={formData.profileImage}
          onImageChange={handleImageChange}
          label="Profile Picture (Optional)"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. Student Candidate"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Student ID</label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. 211-15-XXXX"
            />
          </div>

          {/* Department */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Academic Section</label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            >
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Batch</label>
            <input
              type="text"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. 60th Batch"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">University Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="student.candidate@s.diu.edu.bd"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="+880 1XXXXXXXXX"
            />
          </div>

          {/* Registered Project Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Thesis / Project Title</label>
            <input
              type="text"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. Predictive Analytics Framework for Academic Performance"
            />
          </div>

          {/* Research Bio */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">About / Research Bio</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="Describe your research interests, methodology, and academic goals..."
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/student/profile"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditStudentProfile;

