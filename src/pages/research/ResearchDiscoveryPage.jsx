/**
 * ROSS-SEARCH: Module 2 — Research Discovery & Previous Projects Archive
 * Contributor: Riya Saha (ID: 232-35-715)
 * Description: Allows students to select research domains, submit research queries,
 * explore relevant papers, and search previous departmental FYP/Thesis projects.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Filter, 
  GraduationCap, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Calendar, 
  UserCheck, 
  Tag, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  ArrowRight,
  BookmarkPlus
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';
import { useAuth } from '../../context/AuthContext';

const DOMAIN_OPTIONS = [
  "All",
  "Natural Language Processing",
  "Cyber Security",
  "Computer Vision",
  "Machine Learning",
  "Blockchain",
  "Internet of Things",
  "Cloud Computing",
  "Healthcare AI"
];

const BATCH_OPTIONS = ["All", "Batch 40", "Batch 41", "Batch 42", "Batch 43", "Batch 44", "Batch 45"];

export const ResearchDiscoveryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("archive"); // 'archive' | 'scholarly'
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);

  // Fetch projects from backend
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await module2Service.getPreviousProjects({
        domain: selectedDomain,
        batch: selectedBatch,
        q: searchQuery
      });
      setProjects(data);
    } catch (err) {
      console.error("Failed to load previous projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [selectedDomain, selectedBatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProjects();
    if (searchQuery.trim()) {
      module2Service.logResearchQuery({
        query_text: searchQuery,
        domain: selectedDomain !== "All" ? selectedDomain : "General",
        student_id: user?.student_id || "232-35-715",
        student_name: user?.full_name || "Riya Saha"
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-diu-blue to-diu-dark rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Module 2: Research Discovery & Shared Paper Knowledge</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            Explore Previous Projects & Academic Papers
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed mb-6">
            Search Daffodil International University's official Departmental FYP/Thesis repository.
            Discover verified methodologies, previous findings, and open research gaps to formulate your novel thesis.
          </p>

          {/* Search Query Input */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, keywords (e.g. BERT, SCADA, Attention, YOLO, Blockchain)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-800 rounded-xl font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-3 focus:ring-emerald-400 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Domain Quick Select Chips */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-diu-blue" />
          <span>Filter by Research Domain:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DOMAIN_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDomain === d
                  ? "bg-diu-blue text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Batch & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("archive")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "archive"
                ? "bg-white text-diu-blue shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>DIU Previous Theses ({projects.length})</span>
          </button>
          <button
            onClick={() => navigate('/research/summarizer')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-diu-blue transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Paper Summarizer</span>
          </button>
          <button
            onClick={() => navigate('/research/similarity')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-emerald-600 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Topic Similarity Check</span>
          </button>
          <button
            onClick={() => navigate('/research/shared-knowledge')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-amber-600 transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Shared Knowledge DB</span>
          </button>
        </div>

        {/* Batch Filter Dropdown */}
        <div className="flex items-center gap-2 self-end">
          <span className="text-xs font-medium text-slate-500">Batch:</span>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-diu-blue"
          >
            {BATCH_OPTIONS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-diu-blue animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-500">Loading departmental research records...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Previous Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            No projects matched your selected domain or search keyword. Try clearing filters or searching for general topics.
          </p>
          <button
            onClick={() => { setSelectedDomain("All"); setSelectedBatch("All"); setSearchQuery(""); }}
            className="px-4 py-2 bg-diu-blue text-white text-xs font-semibold rounded-lg hover:bg-diu-dark transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-diu-blue/50 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-diu-blue border border-blue-200">
                    {proj.domain}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {proj.batch}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {proj.year}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-diu-blue transition-colors mb-2">
                  {proj.title}
                </h3>

                {/* Abstract Preview */}
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {proj.abstract}
                </p>

                {/* Supervisor & Members */}
                <div className="text-xs text-slate-500 space-y-1 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Supervisor: <strong className="text-slate-900">{proj.supervisor_name}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-5">
                    Team: {proj.team_members}
                  </div>
                </div>

                {/* Keywords Chips */}
                {proj.keywords && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.keywords.split(',').map((kw, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        #{kw.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProjectModal(proj)}
                  className="text-xs font-semibold text-diu-blue hover:text-diu-dark flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigate(`/research/similarity?topic=${encodeURIComponent(proj.title)}`);
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                  >
                    Check Similarity
                  </button>
                  {proj.github_or_paper_url && (
                    <a
                      href={proj.github_or_paper_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Open Archive Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProjectModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-diu-blue">
                {selectedProjectModal.domain}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {selectedProjectModal.batch} ({selectedProjectModal.year})
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {selectedProjectModal.title}
            </h2>

            <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100 space-y-2 text-xs">
              <div>
                <strong className="text-slate-700">Faculty Supervisor:</strong> {selectedProjectModal.supervisor_name}
              </div>
              <div>
                <strong className="text-slate-700">Graduating Team:</strong> {selectedProjectModal.team_members}
              </div>
              {selectedProjectModal.grade && (
                <div>
                  <strong className="text-slate-700">Evaluation Grade:</strong> <span className="font-bold text-emerald-600">{selectedProjectModal.grade}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Project Abstract
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {selectedProjectModal.abstract}
              </p>
            </div>

            {selectedProjectModal.keywords && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Indexed Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProjectModal.keywords.split(',').map((k, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                      #{k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const topic = selectedProjectModal.title;
                  setSelectedProjectModal(null);
                  navigate(`/research/similarity?topic=${encodeURIComponent(topic)}`);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Compare Similarity Against This
              </button>
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
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

export default ResearchDiscoveryPage;
