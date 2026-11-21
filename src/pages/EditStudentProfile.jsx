import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Check, 
  Tag, 
  Layers 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, SECTIONS, RESEARCH_DOMAINS } from '../data/mockData';

export const EditStudentProfile = () => {
  const navigate = useNavigate();
  const { apiCall, refreshUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    department: 'Department of Computer Science and Engineering',
    section: '60_A',
    batch: '',
    phone: '',
    projectTitle: '',
    bio: ''
  });

  const [availableInterests, setAvailableInterests] = useState([]);
  const [selectedInterestIds, setSelectedInterestIds] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchProfileAndInterests = async () => {
      try {
        const [profileRes, interestsRes] = await Promise.allSettled([
          apiCall('/api/students/me'),
          apiCall('/api/research/interests')
        ]);

        if (mounted) {
          // 1. Process Profile
          if (profileRes.status === 'fulfilled' && profileRes.value) {
            const data = profileRes.value;
            setFormData({
              fullName: data.full_name || '',
              department: data.department || 'Department of Computer Science and Engineering',
              section: data.section || '60_A',
              batch: data.batch || '',
              phone: data.phone || '',
              projectTitle: data.project_title || '',
              bio: data.bio || ''
            });

            // Set current selected interest IDs
            const current = data.interests || [];
            const curIds = current.map(item => (typeof item === 'object' ? item.id : item));
            setSelectedInterestIds(curIds);
          }

          // 2. Process Available Interests
          let list = [];
          if (interestsRes.status === 'fulfilled' && Array.isArray(interestsRes.value) && interestsRes.value.length > 0) {
            list = interestsRes.value;
          } else {
            list = RESEARCH_DOMAINS.map((d, idx) => ({
              id: idx + 1,
              name: d.name,
              category: d.category
            }));
          }
          setAvailableInterests(list);
        }
      } catch (err) {
        console.error('Failed to load profile for edit:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfileAndInterests();
    return () => { mounted = false; };
  }, [apiCall]);

  const toggleInterest = (id) => {
    setSelectedInterestIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      // 1. Update basic profile info
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

      // 2. Update research interests/domains in backend
      const numericIds = selectedInterestIds.map(id => Number(id)).filter(id => !isNaN(id));
      await apiCall('/api/students/me/interests', {
        method: 'PUT',
        body: JSON.stringify({ interest_ids: numericIds })
      });

      await refreshUser();
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/profile');
      }, 1000);
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
        <p className="text-xs text-slate-500 font-medium">Loading profile and domain catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
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
              Edit Student Profile & Research Domains
            </h1>
            <p className="text-xs text-slate-500">
              Configure your academic profile, preferred research domains (NLP, Cyber Security, etc.), and thesis scope
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
          <span>Profile & research domains saved successfully! Redirecting...</span>
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
        
        {/* Academic Details Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-diu-blue" />
            <span>Academic & Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Legal Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-diu-blue focus:bg-white"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-diu-blue focus:bg-white"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-diu-blue focus:bg-white"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-diu-blue focus:bg-white"
                placeholder="+880 1XXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* ── RESEARCH DOMAINS & INTERESTS SELECTOR (CRITICAL REQUIREMENT) ── */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Select Research Domains & Topics *</span>
            </h3>
            <span className="text-[11px] font-semibold text-diu-blue bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              {selectedInterestIds.length} Selected
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select the research fields you want to pursue for your FYP/Thesis (e.g. Natural Language Processing, Cyber Security, Machine Learning). These will be saved directly to your profile.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {availableInterests.map((interest) => {
              const isSelected = selectedInterestIds.includes(interest.id);
              return (
                <button
                  type="button"
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50 border-diu-blue text-diu-blue shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">{interest.name}</span>
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-diu-blue text-white' : 'border border-slate-300'
                  }`}>
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Thesis Scope & Bio */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Thesis Project & Bio
          </h3>

          {/* Registered Project Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Thesis / Project Title</label>
            <input
              type="text"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM-BERT Models"
            />
          </div>

          {/* Research Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">About / Research Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-diu-blue focus:bg-white"
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
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-dark text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>Save Profile & Domains</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditStudentProfile;
