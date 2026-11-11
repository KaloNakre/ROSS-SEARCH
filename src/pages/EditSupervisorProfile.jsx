import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ImageUploadWidget from '../components/ImageUploadWidget';
import { DEPARTMENTS, RESEARCH_DOMAINS } from '../data/mockData';

export const EditSupervisorProfile = () => {
  const navigate = useNavigate();
  const { supervisorProfile, updateSupervisorProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: supervisorProfile.name || '',
    designation: supervisorProfile.designation || 'Professor',
    department: supervisorProfile.department || 'Department of CSE',
    room: supervisorProfile.room || 'Room 602, Academic Building 4',
    email: supervisorProfile.email || '',
    phone: supervisorProfile.phone || '',
    education: supervisorProfile.education || 'Ph.D. in Computer Science & Engineering',
    expertise: supervisorProfile.expertise || ["Machine Learning", "Data Science"],
    about: supervisorProfile.about || '',
    availableSlots: supervisorProfile.availableSlots || 2,
    maxSlots: supervisorProfile.maxSlots || 5,
    profileImage: supervisorProfile.profileImage || null
  });

  const [newTag, setNewTag] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleImageChange = (newImage) => {
    setFormData(prev => ({ ...prev, profileImage: newImage }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    if (!formData.expertise.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newTag.trim()]
      }));
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatusMessage({ type: 'error', text: 'Supervisor name cannot be empty.' });
      return;
    }

    updateSupervisorProfile(formData);
    setStatusMessage({ type: 'success', text: 'Supervisor profile updated successfully!' });

    setTimeout(() => {
      navigate('/supervisor/profile');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/supervisor/profile"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Supervisor Profile
            </h1>
            <p className="text-xs text-slate-500">
              Update faculty academic credentials, research tags, and supervision slots
            </p>
          </div>
        </div>

        <Link
          to="/supervisor/profile"
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
        >
          Cancel
        </Link>
      </div>

      {/* Alert */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Optional Image Upload Widget */}
        <ImageUploadWidget
          currentImage={formData.profileImage}
          onImageChange={handleImageChange}
          label="Supervisor Profile Picture (Optional)"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name & Title</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. Dr. Full Name"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation</label>
            <select
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            >
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Senior Lecturer">Senior Lecturer</option>
              <option value="Lecturer">Lecturer</option>
            </select>
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

          {/* Office Room */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Faculty Office / Room</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. Room 602, Academic Building 4"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Highest Degree</label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. Ph.D. in Computer Science & Engineering"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Official University Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="supervisor.faculty@diu.edu.bd"
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

          {/* Available Slots & Max Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Available Slots</label>
            <input
              type="number"
              min="0"
              max="10"
              value={formData.availableSlots}
              onChange={(e) => setFormData({ ...formData, availableSlots: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Slots Capacity</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.maxSlots}
              onChange={(e) => setFormData({ ...formData, maxSlots: parseInt(e.target.value) || 1 })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>

          {/* Research Expertise Tags */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Research Expertise Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.expertise.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-diu-blue text-xs font-semibold border border-blue-100"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600 font-bold ml-1"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add expertise (e.g. Natural Language Processing)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* About / Bio */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">About Faculty Research</label>
            <textarea
              rows={4}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="Summarize research domain, active grants, and student expectations..."
            />
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/supervisor/profile"
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

export default EditSupervisorProfile;

