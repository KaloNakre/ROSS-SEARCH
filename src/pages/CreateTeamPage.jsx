import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, SECTIONS, RESEARCH_DOMAINS } from '../data/mockData';

export const CreateTeamPage = () => {
  const navigate = useNavigate();
  const { createTeam, studentProfile, supervisors } = useAuth();

  const [formData, setFormData] = useState({
    teamName: '',
    projectTitle: '',
    domain: 'Machine Learning',
    department: studentProfile.department || DEPARTMENTS[0],
    section: studentProfile.section || '60_A',
    supervisorId: supervisors[0]?.id || '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.teamName.trim()) errs.teamName = 'Team name is required';
    if (!formData.projectTitle.trim()) errs.projectTitle = 'Proposed Project/Thesis title is required';
    if (!formData.description.trim()) errs.description = 'Please provide a brief research abstract';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedSupervisor = supervisors.find(s => s.id === formData.supervisorId);

    const newTeam = createTeam({
      teamName: formData.teamName,
      projectTitle: formData.projectTitle,
      domain: formData.domain,
      department: formData.department,
      section: formData.section,
      supervisorId: formData.supervisorId,
      supervisorName: selectedSupervisor ? selectedSupervisor.name : 'Pending Assignment',
      description: formData.description,
      leaderId: 'stu-current',
      leaderName: studentProfile.name
    });

    setSuccess(true);
    setTimeout(() => {
      navigate(`/teams/${newTeam.id}`);
    }, 1200);
  };

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
          <span>Team created successfully! Opening team workspace...</span>
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
            <span className="text-slate-600">{studentProfile.name} ({studentProfile.studentId}, Section {studentProfile.section})</span>
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
                errors.teamName ? 'border-rose-400' : 'border-slate-200'
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
              placeholder="e.g. Automated Diagnostic Pipeline Using Multimodal Deep Learning"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white ${
                errors.projectTitle ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.projectTitle && <p className="text-[11px] text-rose-500 mt-1">{errors.projectTitle}</p>}
          </div>

          {/* Research Domain */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Research Domain <span className="text-rose-500">*</span>
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

          {/* Academic Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Academic Section <span className="text-rose-500">*</span>
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

          {/* Preferred Supervisor */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred Supervisor (Optional initial selection)
            </label>
            <select
              value={formData.supervisorId}
              onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            >
              <option value="">-- Assign Later --</option>
              {supervisors.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name} - {sup.designation} ({sup.department})
                </option>
              ))}
            </select>
          </div>

          {/* Abstract / Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Research Abstract / Problem Statement <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Summarize the core problem, target methodology, and expected outcomes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white ${
                errors.description ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>}
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/teams/my-teams"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Users size={15} /> Create Team Workspace
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateTeamPage;

