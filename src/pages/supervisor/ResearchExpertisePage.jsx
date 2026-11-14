import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles,
  BookOpen,
  Layers,
  Code2,
  X
} from 'lucide-react';
import { RESEARCH_DOMAINS } from '../../data/mockData';
import module1Service from '../../services/module1Service';

export const ResearchExpertisePage = () => {
  const [expertiseList, setExpertiseList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [form, setForm] = useState({
    name: '',
    domain: 'Machine Learning',
    level: 'Advanced',
    keywords: '',
  });

  useEffect(() => {
    setExpertiseList(module1Service.getExpertise());
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showFeedback('error', 'Expertise title is required.');
      return;
    }

    if (editingId) {
      module1Service.updateExpertise(editingId, {
        name: form.name.trim(),
        domain: form.domain,
        level: form.level,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      });
      showFeedback('success', 'Research expertise updated successfully.');
      setEditingId(null);
    } else {
      module1Service.addExpertise({
        name: form.name.trim(),
        domain: form.domain,
        level: form.level,
        keywords: form.keywords,
      });
      showFeedback('success', 'New research expertise tag added.');
      setIsAdding(false);
    }

    setExpertiseList(module1Service.getExpertise());
    setForm({ name: '', domain: 'Machine Learning', level: 'Advanced', keywords: '' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setIsAdding(true);
    setForm({
      name: item.name,
      domain: item.domain || 'Machine Learning',
      level: item.level || 'Advanced',
      keywords: Array.isArray(item.keywords) ? item.keywords.join(', ') : '',
    });
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to remove expertise "${name}"?`)) {
      module1Service.removeExpertise(id);
      setExpertiseList(module1Service.getExpertise());
      showFeedback('success', `Expertise "${name}" removed.`);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/supervisor/dashboard" className="hover:text-diu-blue transition-colors">Supervisor Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Research Expertise</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Tag className="text-diu-blue stroke-[2.2]" size={26} />
            Research Expertise Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Declare your active research disciplines, core technical competencies, and publication keywords.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setForm({ name: '', domain: 'Machine Learning', level: 'Advanced', keywords: '' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus size={16} /> Add Expertise Tag
          </button>
        )}
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

      {/* Add / Edit Form Drawer */}
      {isAdding && (
        <div className="bg-white rounded-2xl border border-diu-blue/30 shadow-md p-6 relative">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={16} className="text-diu-blue" />
              {editingId ? 'Edit Research Expertise Tag' : 'Add New Research Expertise Tag'}
            </h3>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expertise Name / Sub-discipline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Deep Reinforcement Learning"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Research Domain <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              >
                {RESEARCH_DOMAINS.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.category})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Proficiency Level
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              >
                <option value="Expert">Expert (Active Research & Publications)</option>
                <option value="Advanced">Advanced (Practical Implementation)</option>
                <option value="Intermediate">Intermediate (Mentoring Foundations)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. PyTorch, Q-Learning, Gym, Robotics"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {editingId ? 'Update Expertise' : 'Save Expertise Tag'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expertise Grid & Tag Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expertiseList.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-diu-blue border border-blue-200/60">
                  {item.domain}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  item.level === 'Expert' 
                    ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {item.level}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-diu-blue transition-colors">
                {item.name}
              </h4>

              {/* Keywords Tag Cloud */}
              {item.keywords && item.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.keywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleEdit(item)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-diu-blue hover:bg-blue-50 transition-colors"
                title="Edit Expertise"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove Expertise"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {expertiseList.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Tag className="mx-auto text-slate-300 mb-3" size={36} />
          <h3 className="text-sm font-bold text-slate-700">No Research Expertise Tags Declared</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Add tags to help student algorithms and candidates discover you based on matching thesis domains.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResearchExpertisePage;
