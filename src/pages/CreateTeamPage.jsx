import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, SECTIONS, RESEARCH_DOMAINS } from '../data/mockData';

export const CreateTeamPage = () => {
  const navigate = useNavigate();
  const { apiCall, currentUser } = useAuth();

  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    teamName: '',
    projectTitle: '',
    domain: 'Machine Learning',
    department: 'Department of CSE',
    section: '60_A',
    supervisorId: '',
    description: ''
  });

  useEffect(() => {
    let mounted = true;
    const fetchSupervisorsAndProfile = async () => {
      try {
        const [supsRes, profileRes] = await Promise.allSettled([
          apiCall('/api/supervisors/?limit=100'),
          apiCall('/api/students/me')
        ]);

        if (mounted) {
          if (supsRes.status === 'fulfilled') {
            const list = Array.isArray(supsRes.value) ? supsRes.value : (supsRes.value?.items || []);
            setSupervisors(list);
            if (list.length > 0) {
              setFormData(prev => ({ ...prev, supervisorId: list[0].id }));
            }
          }
          if (profileRes.status === 'fulfilled' && profileRes.value) {
            const profile = profileRes.value;
            // section may come as "60_A" or "Section 60_A" — normalize it
            let sec = profile.section || '';
            if (sec.startsWith('Section ')) sec = sec.replace('Section ', '');
            setFormData(prev => ({
              ...prev,
              department: profile.department || 'Department of Computer Science and Engineering',
              section: sec || '60_A'
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load initial data for team creation:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSupervisorsAndProfile();
    return () => { mounted = false; };
  }, [apiCall]);

  const validate = () => {
    const errs = {};
    if (!formData.teamName.trim()) errs.teamName = 'Team name is required';
    if (!formData.projectTitle.trim()) errs.projectTitle = 'Proposed Project/Thesis title is required';
    if (!formData.description.trim()) errs.description = 'Please provide a brief research abstract';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError('');

    try {
      // Backend TeamCreate schema uses 'name' (not 'team_name')
      const payload = {
        name: formData.teamName,
        project_title: formData.projectTitle,
        domain: formData.domain,
        department: formData.department,
        section: formData.section,
        description: formData.description,
        supervisor_id: formData.supervisorId ? parseInt(formData.supervisorId, 10) : null
      };

      const result = await apiCall('/api/teams/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/teams/${result.id}`);
      }, 1200);
    } catch (err) {
      // Translate common backend errors to user-friendly Bengali-aware messages
      const raw = err.message || '';
      if (raw.toLowerCase().includes('already') && raw.toLowerCase().includes('team')) {
        setApiError('আপনি ইতিমধ্যে একটি সক্রিয় দলের Team Leader। একই সময়ে দুটো দল তৈরি করা যাবে না।');
      } else if (raw.toLowerCase().includes('only students')) {
        setApiError('শুধুমাত্র Student অ্যাকাউন্ট থেকে টিম তৈরি করা যাবে।');
      } else if (raw.includes('name:') || raw.includes('field')) {
        setApiError(`ফর্ম ডেটা সমস্যা: ${raw}`);
      } else {
        setApiError(raw || 'টিম তৈরি করা যায়নি। সার্ভার সংযোগ পরীক্ষা করুন।');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading team creation workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/teams/search"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create FYP / Thesis Team
            </h1>
            <p className="text-xs text-slate-500">
              Register a new project group and invite classmates from your section
            </p>
          </div>
        </div>

        <Link
          to="/teams/my-teams"
          className="text-xs text-diu-blue hover:underline font-semibold"
        >
          View My Teams
        </Link>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Team created successfully on live server! Opening team workspace...</span>
        </div>
      )}

      {/* Error Notification */}
      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-800 text-xs font-bold animate-fadeIn">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Creator Notice */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-diu-blue flex items-center justify-center shrink-0">
            <Users size={16} />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800">Team Leader: </span>
            <span className="text-slate-600">{currentUser?.full_name || currentUser?.email} (Section {formData.section})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Team Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Team / Group Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Cognitive Systems Research Group"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white ${
                errors.teamName ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
            {errors.teamName && <p className="text-[11px] text-rose-500 mt-1">{errors.teamName}</p>}
          </div>

          {/* Project Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Proposed Project / Thesis Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Real-Time Distributed Anomaly Detection Framework"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white ${
                errors.projectTitle ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
            {errors.projectTitle && <p className="text-[11px] text-rose-500 mt-1">{errors.projectTitle}</p>}
          </div>

          {/* Research Domain */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Primary Research Domain
            </label>
            <select
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            >
              {RESEARCH_DOMAINS.map((domain) => (
                <option key={domain.id} value={domain.name}>{domain.name}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Department
            </label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Academic Section
            </label>
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

          {/* Supervisor Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nominated Faculty Supervisor
            </label>
            <select
              value={formData.supervisorId}
              onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            >
              <option value="">-- Assign Later --</option>
              {supervisors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name || s.name} ({s.department})
                </option>
              ))}
            </select>
          </div>

          {/* Abstract / Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Brief Research Abstract / Overview <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe your research objectives, expected methodology, and deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white ${
                errors.description ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/teams/search"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Users size={15} />}
            <span>Register Team</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateTeamPage;
