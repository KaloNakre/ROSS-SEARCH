/**
 * ROSS-SEARCH: Module 3 — Official Proposal & Thesis Templates Repository
 * Assigned to: [Robayet Islam – ID: 809]
 * 
 * Capabilities:
 * - Central repository for official DIU PPT, PPTX, DOCX, and PDF presentation/report templates
 * - Allows students and faculty to download verified master templates
 * - Administrators can upload, store, and manage official university templates
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  X,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';
import { module3Service } from '../../services/module3Service';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'proposal', label: 'Proposal Decks' },
  { id: 'defense', label: 'Defense Decks' },
  { id: 'thesis', label: 'Thesis Reports' },
  { id: 'guideline', label: 'Academic Guidelines' },
];

export const TemplatesRepositoryPage = () => {
  const { currentUser } = useAuth();
  const token = localStorage.getItem('ross_token') || localStorage.getItem('token') || sessionStorage.getItem('token');
  const isAdmin = currentUser?.role === 'admin';

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload modal state for Admin
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('proposal');
  const [uploadFileType, setUploadFileType] = useState('pptx');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await module3Service.getTemplates(selectedCategory);
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const handleDownload = async (tmpl) => {
    try {
      await module3Service.downloadTemplate(tmpl.id);
      // Trigger browser download simulation or direct link
      window.open(tmpl.file_path || `/templates/${tmpl.file_name}`, '_blank');
      // Update local download counter
      setTemplates(prev => prev.map(t => t.id === tmpl.id ? { ...t, download_count: t.download_count + 1 } : t));
    } catch (err) {
      console.warn('Download tracking notice:', err);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadFileName.trim()) {
      setModalError('Please enter template title and filename.');
      return;
    }
    setUploading(true);
    setModalError(null);

    try {
      await module3Service.createTemplate({
        title: uploadTitle.trim(),
        file_name: uploadFileName.trim(),
        category: uploadCategory,
        file_type: uploadFileType,
        description: uploadDesc.trim() || 'Official DIU Academic Template'
      }, token);

      setShowUploadModal(false);
      setUploadTitle('');
      setUploadFileName('');
      setUploadDesc('');
      fetchTemplates();
    } catch (err) {
      setModalError(err.message || 'Failed to upload template.');
    } finally {
      setUploading(false);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-diu-darkBlue to-indigo-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/20">
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
            <span>Official University Academic Templates</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Official Proposal & Thesis Presentation Master Decks
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Download verified presentation templates, IEEE dissertation layouts, and departmental slide masters designed specifically for Daffodil International University FYP & Thesis defenses.
          </p>

          {isAdmin && (
            <div className="pt-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Plus size={15} /> Upload New Official Template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-diu-blue text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-diu-blue animate-spin mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading official university templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Templates Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try switching the category filter or clearing the search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 hover:border-diu-blue hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-50 text-diu-blue border border-blue-200">
                    {tmpl.category}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                    .{tmpl.file_type} ({tmpl.file_size_kb} KB)
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {tmpl.description}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified by DIU Project Committee • {tmpl.download_count} Downloads</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-mono truncate">
                  {tmpl.file_name}
                </span>
                <button
                  onClick={() => handleDownload(tmpl)}
                  className="px-4 py-2 bg-diu-blue hover:bg-diu-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <Download size={14} />
                  <span>Download Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADMIN UPLOAD MODAL ── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-scaleUp">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X size={18} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Upload Official Academic Template</h2>
              <p className="text-xs text-slate-500">Publish a verified master deck or report template for all students.</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Template Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Master Proposal Presentation Deck 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-diu-blue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Name</label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="e.g. DIU_Proposal_Master.pptx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-diu-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-diu-blue"
                  >
                    <option value="proposal">Proposal Deck</option>
                    <option value="defense">Defense Deck</option>
                    <option value="thesis">Thesis Report</option>
                    <option value="guideline">Academic Guideline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Guidelines</label>
                <textarea
                  rows={3}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Provide instructions on required slide order and formatting standards..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-diu-blue"
                />
              </div>

              {modalError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  {modalError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus size={14} />}
                  <span>Publish Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesRepositoryPage;
