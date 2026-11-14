import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  Power, 
  Calendar,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { RESEARCH_DOMAINS } from '../../data/mockData';
import module1Service from '../../services/module1Service';

export const ResearchOpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalData, setViewModalData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [form, setForm] = useState({
    title: '',
    domain: 'Machine Learning',
    description: '',
    keywords: '',
    requiredSkills: '',
    studentType: 'Both',
    maxCapacity: 4,
    availablePositions: 4,
    applicationDeadline: '2026-12-31',
    status: 'Active',
    isPublished: true,
  });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    setOpportunities(module1Service.getOpportunities());
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      domain: 'Machine Learning',
      description: '',
      keywords: '',
      requiredSkills: '',
      studentType: 'Both',
      maxCapacity: 4,
      availablePositions: 4,
      applicationDeadline: '2026-12-31',
      status: 'Active',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (opp) => {
    setEditingId(opp.id);
    setForm({
      title: opp.title,
      domain: opp.domain,
      description: opp.description,
      keywords: Array.isArray(opp.keywords) ? opp.keywords.join(', ') : '',
      requiredSkills: opp.requiredSkills || '',
      studentType: opp.studentType || 'Both',
      maxCapacity: opp.maxCapacity,
      availablePositions: opp.availablePositions,
      applicationDeadline: opp.applicationDeadline,
      status: opp.status,
      isPublished: opp.isPublished,
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      showFeedback('error', 'Title and Description are required.');
      return;
    }

    if (editingId) {
      module1Service.updateOpportunity(editingId, {
        ...form,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      });
      showFeedback('success', 'Research opportunity updated.');
    } else {
      module1Service.createOpportunity(form);
      showFeedback('success', 'New research opportunity published!');
    }

    refreshList();
    setModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to permanently delete opportunity "${title}"?`)) {
      module1Service.deleteOpportunity(id);
      refreshList();
      showFeedback('success', 'Opportunity deleted.');
    }
  };

  const handleToggleStatus = (id) => {
    module1Service.toggleOpportunityStatus(id);
    refreshList();
    showFeedback('success', 'Status updated.');
  };

  const handleTogglePublish = (id) => {
    module1Service.toggleOpportunityPublish(id);
    refreshList();
    showFeedback('success', 'Publication visibility updated.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/supervisor/dashboard" className="hover:text-diu-blue">Supervisor Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Research Opportunities</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="text-diu-blue stroke-[2.2]" size={26} />
            Research Opportunity Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, manage deadlines, and allocate student quotas for undergraduate thesis projects.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus size={16} /> Create Opportunity
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Opportunities Table / Cards */}
      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-diu-blue border border-blue-200/60">
                  {opp.domain}
                </span>

                <button
                  onClick={() => handleToggleStatus(opp.id)}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1 transition-colors ${
                    opp.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Click to toggle Active/Inactive"
                >
                  <Power size={11} /> {opp.status}
                </button>

                <button
                  onClick={() => handleTogglePublish(opp.id)}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border transition-colors ${
                    opp.isPublished
                      ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                  title="Click to toggle public visibility"
                >
                  {opp.isPublished ? 'Publicly Published' : 'Draft / Unpublished'}
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 hover:text-diu-blue transition-colors cursor-pointer" onClick={() => setViewModalData(opp)}>
                {opp.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 max-w-3xl">
                {opp.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Users size={14} className="text-diu-green" />
                  Capacity: {opp.availablePositions}/{opp.maxCapacity} slots open ({opp.studentType})
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar size={14} className="text-amber-500" />
                  Deadline: {opp.applicationDeadline}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
              <button
                onClick={() => setViewModalData(opp)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Eye size={13} /> View
              </button>
              <button
                onClick={() => handleOpenEdit(opp)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-diu-blue text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Edit3 size={13} /> Edit
              </button>
              <button
                onClick={() => handleDelete(opp.id, opp.title)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Opportunity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {opportunities.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Briefcase className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-sm font-bold text-slate-700">No Research Opportunities Listed</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Open new thesis positions to begin accepting individual and team applications.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 bg-diu-blue text-white text-xs font-bold rounded-full"
            >
              Create First Opportunity
            </button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL DIALOG */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase size={18} className="text-diu-blue" />
                {editingId ? 'Edit Research Opportunity' : 'Create New Research Opportunity'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Opportunity Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deep Learning for Medical Diagnostic Imaging"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Research Domain <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                  >
                    {RESEARCH_DOMAINS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Type
                  </label>
                  <select
                    value={form.studentType}
                    onChange={(e) => setForm({ ...form, studentType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                  >
                    <option value="Both">Individual or Team</option>
                    <option value="Individual">Individual Student Only</option>
                    <option value="Team">Pre-formed Team Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="State the core research question, objectives, dataset expectations..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.maxCapacity}
                    onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Positions
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={form.maxCapacity}
                    value={form.availablePositions}
                    onChange={(e) => setForm({ ...form, availablePositions: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={form.applicationDeadline}
                    onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prerequisites / Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, OpenCV"
                  value={form.requiredSkills}
                  onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CNN, Medical Imaging, Deep Learning"
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-diu-blue border border-blue-200">
                  {viewModalData.domain}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {viewModalData.title}
                </h3>
              </div>
              <button onClick={() => setViewModalData(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {viewModalData.description}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <p><strong className="text-slate-800">Prerequisites:</strong> {viewModalData.requiredSkills || 'Standard background'}</p>
              <p><strong className="text-slate-800">Capacity:</strong> {viewModalData.availablePositions} remaining of {viewModalData.maxCapacity} slots</p>
              <p><strong className="text-slate-800">Deadline:</strong> {viewModalData.applicationDeadline}</p>
              <p><strong className="text-slate-800">Candidate Format:</strong> {viewModalData.studentType}</p>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setViewModalData(null)}
                className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchOpportunitiesPage;
