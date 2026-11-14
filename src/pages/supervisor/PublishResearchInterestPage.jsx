import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  User, 
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { RESEARCH_DOMAINS } from '../../data/mockData';
import module1Service from '../../services/module1Service';

export const PublishResearchInterestPage = () => {
  const [interests, setInterests] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create' | 'preview'
  const [previewData, setPreviewData] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [form, setForm] = useState({
    title: '',
    domain: 'Machine Learning',
    description: '',
    keywords: '',
    requiredSkills: '',
    studentType: 'Both', // 'Individual' | 'Team' | 'Both'
    capacity: 4,
  });

  useEffect(() => {
    setInterests(module1Service.getPublishedInterests());
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      showFeedback('error', 'Please fill in both title and description before previewing.');
      return;
    }
    setPreviewData({
      ...form,
      keywordsList: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
    });
    setActiveTab('preview');
  };

  const handlePublish = (e) => {
    if (e) e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      showFeedback('error', 'Title and Description are required.');
      return;
    }

    module1Service.publishResearchInterest({
      title: form.title.trim(),
      domain: form.domain,
      description: form.description.trim(),
      keywords: form.keywords,
      requiredSkills: form.requiredSkills.trim(),
      studentType: form.studentType,
      capacity: Number(form.capacity) || 3,
    });

    setInterests(module1Service.getPublishedInterests());
    showFeedback('success', 'Research interest published successfully!');
    setActiveTab('list');
    setForm({
      title: '',
      domain: 'Machine Learning',
      description: '',
      keywords: '',
      requiredSkills: '',
      studentType: 'Both',
      capacity: 4,
    });
  };

  const handleDelete = (id, title) => {
    if (confirm(`Remove published interest "${title}"?`)) {
      module1Service.deletePublishedInterest(id);
      setInterests(module1Service.getPublishedInterests());
      showFeedback('success', 'Published interest removed.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/supervisor/dashboard" className="hover:text-diu-blue">Supervisor Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Research Interests</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="text-diu-blue stroke-[2.2]" size={26} />
            Research Interest Publishing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish research topics and thesis directions to attract qualified undergraduate student candidates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'list' ? (
            <button
              onClick={() => setActiveTab('create')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus size={16} /> Publish New Topic
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('list')}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
            >
              Back to Published List
            </button>
          )}
        </div>
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

      {/* Tab Navigation when creating/previewing */}
      {activeTab !== 'list' && (
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'create' 
                ? 'border-diu-blue text-diu-blue' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Form Editor
          </button>
          <button
            onClick={handlePreview}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'preview' 
                ? 'border-diu-blue text-diu-blue' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Live Candidate Preview
          </button>
        </div>
      )}

      {/* TAB 1: LIST VIEW */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interests.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-diu-blue border border-blue-200/60">
                    {item.domain}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Users size={13} className="text-diu-green" />
                    Capacity: {item.capacity} students ({item.studentType})
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>

                {item.requiredSkills && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 mb-3 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">Required Skills: </span>
                    {item.requiredSkills}
                  </div>
                )}

                {item.keywords && item.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-medium">Published: {item.date}</span>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Topic"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {interests.length === 0 && (
            <div className="md:col-span-2 bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
              <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
              <h3 className="text-base font-bold text-slate-800">No Published Research Interests Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Share your research ideas and project topics with prospective undergraduate students seeking thesis supervision.
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-diu-blue text-white text-xs font-bold rounded-full shadow-sm"
              >
                <Plus size={15} /> Publish Your First Topic
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE / EDIT FORM */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-7 sm:p-9">
          <form onSubmit={handlePreview} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Research Topic / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Robust Natural Language Processing for Low-Resource Dialects"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option key={d.id} value={d.name}>{d.name} ({d.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Eligible Student Candidate Type
                </label>
                <select
                  value={form.studentType}
                  onChange={(e) => setForm({ ...form, studentType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                >
                  <option value="Both">Individual Student or Team (Both)</option>
                  <option value="Individual">Individual Student Only</option>
                  <option value="Team">Pre-formed Team Only (3–5 Members)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Comprehensive Research Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe the research background, methodologies, target outcomes, and experimental datasets..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Technical Skills & Prerequisites
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, Linux, Git, Linear Algebra"
                  value={form.requiredSkills}
                  onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Maximum Student Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Research Keywords (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Transformers, Deep Learning, Evaluation Metrics"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Eye size={15} /> Preview Candidate View
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} /> Publish Directly
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: LIVE PREVIEW MODE */}
      {activeTab === 'preview' && previewData && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-800 font-medium">
            <span className="flex items-center gap-2">
              <Eye size={16} className="text-amber-600" />
              <strong>Candidate View Simulation:</strong> This is how undergraduate students will view your published topic.
            </span>
            <button
              onClick={() => setActiveTab('create')}
              className="text-amber-900 underline font-bold"
            >
              Edit Details
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-diu-blue border border-blue-200">
                {previewData.domain}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Accepting Candidates ({previewData.studentType})
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-snug">
                {previewData.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Faculty Supervisor: Dr. Syed Tareq • Department of CSE
              </p>
            </div>

            <div className="prose prose-sm text-slate-600 text-xs leading-relaxed border-t border-b border-slate-100 py-4">
              <p className="whitespace-pre-line">{previewData.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="block font-bold text-slate-700 mb-1">Prerequisite Skills:</span>
                <p className="text-slate-600">{previewData.requiredSkills || 'Standard undergraduate computer science background'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="block font-bold text-slate-700 mb-1">Capacity & Format:</span>
                <p className="text-slate-600">Up to {previewData.capacity} students • {previewData.studentType} format</p>
              </div>
            </div>

            {previewData.keywordsList && previewData.keywordsList.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Research Focus Keywords:</span>
                <div className="flex flex-wrap gap-2">
                  {previewData.keywordsList.map((k, i) => (
                    <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-diu-blue border border-blue-200/50">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl"
              >
                Modify Content
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-2.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
              >
                <CheckCircle2 size={16} /> Confirm & Publish Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishResearchInterestPage;
