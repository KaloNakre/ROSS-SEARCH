import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, SECTIONS } from '../data/mockData';

export const EditStudentProfile = () => {
  const navigate = useNavigate();
  const { apiCall, refreshUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    department: 'Department of CSE',
    section: '60_A',
    batch: '',
    phone: '',
    projectTitle: '',
    bio: ''
  });

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const data = await apiCall('/api/students/me');
        if (mounted && data) {
          setFormData({
            fullName: data.full_name || '',
            department: data.department || 'Department of CSE',
            section: data.section || '60_A',
            batch: data.batch || '',
            phone: data.phone || '',
            projectTitle: data.project_title || '',
            bio: data.bio || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile for edit:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [apiCall]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      await apiCall('/api/students/me', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: formData.fullName,
          department: formData.department,
          section: formData.section,
          batch: formData.batch,
          phone: formData.phone,
          project_title: formData.projectTitle,
          bio: formData.bio
        })
      });

      await refreshUser();
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/profile');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
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
              Update your registered academic profile details on the live server
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

      {/* Success Notification */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully! Redirecting...</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-800 text-xs font-bold animate-fadeIn">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Legal Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>

          {/* Department */}
          <div>
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
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>Save Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditStudentProfile;
