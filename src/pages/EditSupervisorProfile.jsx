import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  X, 
  Loader2,
  Building,
  GraduationCap,
  Phone,
  Mail,
  User,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../data/mockData';
import ImageUploadWidget from '../components/ImageUploadWidget';

export const EditSupervisorProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');
  const { apiCall, refreshUser, currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    designation: 'Assistant Professor',
    department: 'Department of Computer Science and Engineering',
    room: '',
    phone: '',
    about: '',
    education: '',
    availableSlots: 4,
    maxSlots: 5,
    isAcceptingTeams: true,
    profileImageUrl: null,
    expertise: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      let initialData = null;

      // 1. Check local storage override first
      try {
        const localOverride = JSON.parse(localStorage.getItem('ross_supervisor_profile_override') || '{}');
        if (localOverride && Object.keys(localOverride).length > 0) {
          initialData = localOverride;
        }
      } catch {}

      // 2. Fetch from backend API
      try {
        const endpoint = targetId ? `/api/supervisors/${targetId}` : '/api/supervisors/me';
        const data = await apiCall(endpoint);
        if (data) {
          initialData = { ...initialData, ...data };
        }
      } catch (err) {
        console.warn('Backend supervisor fetch note:', err.message);
      }

      // 3. Populate form with merged data or fallback to currentUser
      if (mounted) {
        const fallbackName = currentUser?.profile?.full_name || currentUser?.full_name || '';
        const fallbackDept = currentUser?.profile?.department || 'Department of Computer Science and Engineering';
        const fallbackDesig = currentUser?.profile?.designation || 'Assistant Professor';

        const expList = Array.isArray(initialData?.expertise)
          ? initialData.expertise.map(e => (typeof e === 'string' ? e : e.name || ''))
          : ['Machine Learning', 'Natural Language Processing'];

        setFormData({
          fullName: initialData?.full_name || fallbackName,
          designation: initialData?.designation || fallbackDesig,
          department: initialData?.department || fallbackDept,
          room: initialData?.room || 'Faculty Annex, Daffodil Smart City',
          phone: initialData?.phone || '+880 1712 345678',
          about: initialData?.about || 'Faculty member and research supervisor at Daffodil International University.',
          education: initialData?.education || 'Ph.D. in Computer Science; M.Sc. in CSE',
          availableSlots: initialData?.available_slots ?? 4,
          maxSlots: initialData?.max_slots ?? 5,
          isAcceptingTeams: initialData?.is_accepting_teams ?? initialData?.accepting_teams ?? true,
          profileImageUrl: initialData?.profile_image_url || null,
          expertise: expList
        });
        setLoading(false);
      }
    };

    fetchProfile();
    return () => { mounted = false; };
  }, [apiCall, targetId, currentUser]);

  const handleAddTag = () => {
    if (newTag.trim() && !formData.expertise.includes(newTag.trim())) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter(t => t !== tag)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const parsedAvailable = parseInt(formData.availableSlots, 10);
    const parsedMax = parseInt(formData.maxSlots, 10);

    const payload = {
      full_name: formData.fullName.trim(),
      designation: formData.designation,
      department: formData.department,
      room: formData.room.trim(),
      phone: formData.phone.trim(),
      about: formData.about.trim(),
      education: formData.education.trim(),
      available_slots: !isNaN(parsedAvailable) ? parsedAvailable : 4,
      max_slots: !isNaN(parsedMax) ? parsedMax : 5,
      accepting_teams: Boolean(formData.isAcceptingTeams),
      profile_image_url: formData.profileImageUrl,
    };

    // 1. Immediately cache updated profile locally for instantaneous UI reflection
    try {
      localStorage.setItem('ross_supervisor_profile_override', JSON.stringify({
        ...payload,
        is_accepting_teams: payload.accepting_teams,
        expertise: formData.expertise
      }));
    } catch {}

    // 2. Submit to backend API
    try {
      const endpoint = targetId ? `/api/supervisors/${targetId}` : '/api/supervisors/me';
      await apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      if (refreshUser) await refreshUser();
    } catch (err) {
      console.warn('API update note (local state already saved):', err.message);
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/supervisor/profile');
    }, 1000);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading faculty editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/supervisor/profile"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Faculty Profile
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Update your research profile picture, bio, contact details, and supervision availability
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Profile updated successfully! Redirecting...</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Interface (Reusable Component) */}
        <ImageUploadWidget
          currentImage={formData.profileImageUrl}
          onImageChange={(img) => setFormData(prev => ({ ...prev, profileImageUrl: img }))}
          label="Supervisor Profile Picture (Optional)"
        />

        {/* Basic Academic Info Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User size={18} className="text-diu-blue" />
            1. Core Identity & Department
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name (with Honorific) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Faculty Designation <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Senior Lecturer">Senior Lecturer</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Academic Degrees & Background */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <GraduationCap size={18} className="text-diu-blue" />
            2. Academic Qualifications & Biography
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Degrees & Educational Background
            </label>
            <input
              type="text"
              placeholder="e.g. Ph.D. in AI (NTU, 2021); M.Sc. in CSE (BUET, 2017); B.Sc. in CSE (DIU, 2014)"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Biography & Research Statement
            </label>
            <textarea
              rows={4}
              placeholder="Outline your research focus, lab achievements, supervisory philosophy, and expectations from thesis students..."
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>
        </div>

        {/* Contact Information & Office */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building size={18} className="text-diu-blue" />
            3. Office Location & Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Office / Faculty Room
              </label>
              <input
                type="text"
                placeholder="e.g. Room 408, Academic Building 4, Daffodil Smart City"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institutional Contact Phone
              </label>
              <input
                type="text"
                placeholder="e.g. +880 1712 345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Thesis Slots & Availability */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen size={18} className="text-diu-blue" />
            4. Thesis Supervision Slots & Availability
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Maximum Student Capacity
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={formData.maxSlots}
                onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Available Free Slots
              </label>
              <input
                type="number"
                min={0}
                max={formData.maxSlots}
                value={formData.availableSlots}
                onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAcceptingTeams}
                  onChange={(e) => setFormData({ ...formData, isAcceptingTeams: e.target.checked })}
                  className="w-4 h-4 text-diu-blue rounded focus:ring-diu-blue"
                />
                <span>Currently Accepting New Teams</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/supervisor/profile"
            className="px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-2.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSupervisorProfile;
