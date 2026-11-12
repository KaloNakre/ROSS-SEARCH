import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../data/mockData';

export const EditSupervisorProfile = () => {
  const navigate = useNavigate();
  const { apiCall, refreshUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    designation: 'Assistant Professor',
    department: 'Department of CSE',
    room: '',
    phone: '',
    about: '',
    availableSlots: 3,
    maxSlots: 5,
    isAcceptingTeams: true,
    expertise: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const data = await apiCall('/api/supervisors/me');
        if (mounted && data) {
          const expList = Array.isArray(data.expertise)
            ? data.expertise.map(e => (typeof e === 'string' ? e : e.name || ''))
            : [];

          setFormData({
            fullName: data.full_name || '',
            designation: data.designation || 'Assistant Professor',
            department: data.department || 'Department of CSE',
            room: data.room || '',
            phone: data.phone || '',
            about: data.about || '',
            availableSlots: data.available_slots ?? 3,
            maxSlots: data.max_slots ?? 5,
            isAcceptingTeams: data.is_accepting_teams ?? true,
            expertise: expList
          });
        }
      } catch (err) {
        console.error('Failed to load supervisor profile:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [apiCall]);

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
    try {
      await apiCall('/api/supervisors/me', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: formData.fullName,
          designation: formData.designation,
          department: formData.department,
          room: formData.room,
          phone: formData.phone,
          about: formData.about,
          available_slots: parseInt(formData.availableSlots, 10),
          max_slots: parseInt(formData.maxSlots, 10),
          is_accepting_teams: formData.isAcceptingTeams
        })
      });

      // Update expertise
      if (formData.expertise.length > 0) {
        await apiCall('/api/supervisors/me/expertise', {
          method: 'PUT',
          body: JSON.stringify({ expertise_names: formData.expertise })
        });
      }

      await refreshUser();
      setSuccess(true);
      setTimeout(() => {
        navigate('/supervisor/profile');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update supervisor profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading faculty settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
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
              Edit Faculty Profile
            </h1>
            <p className="text-xs text-slate-500">
              Manage research domains, quotas, and contact info on the live server
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

      {/* Success Notification */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Faculty profile updated successfully! Redirecting...</span>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name & Academic Title</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>

          {/* Academic Designation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="e.g. Associate Professor"
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

          {/* Office Room */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Office / Room Location</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              placeholder="Room 502, Academic Building 4"
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

export default EditSupervisorProfile;
