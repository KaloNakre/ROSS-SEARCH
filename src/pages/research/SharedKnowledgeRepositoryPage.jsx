/**
 * ROSS-SEARCH: Module 2 — Shared Paper Knowledge Repository
 * Contributor: Tamim Hasan Sami (ID: 232-35-313)
 * Description: Centralized shared database where research queries, paper details,
 * AI-generated 9-point summaries, research gaps, and findings are stored for future students.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Search, 
  BookOpen, 
  Layers, 
  Sparkles, 
  User, 
  Calendar, 
  FileText, 
  HelpCircle, 
  TrendingUp, 
  Cpu, 
  ArrowRight, 
  Loader2, 
  Bookmark,
  Share2
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';

const DOMAIN_OPTIONS = [
  "All",
  "Natural Language Processing",
  "Computer Vision",
  "Cyber Security",
  "Machine Learning",
  "Healthcare AI"
];

export const SharedKnowledgeRepositoryPage = () => {
  const navigate = useNavigate();

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaperModal, setSelectedPaperModal] = useState(null);

  const loadSharedPapers = async () => {
    setLoading(true);
    try {
      const data = await module2Service.getSharedPaperKnowledge({
        domain: selectedDomain,
        q: searchQuery
      });
      setPapers(data);
    } catch (err) {
      console.error("Failed to load shared paper repository:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSharedPapers();
  }, [selectedDomain]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadSharedPapers();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-800 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
            <Database className="w-3.5 h-3.5 text-amber-300" />
            <span>Shared Paper Knowledge Repository (Persistent Archive)</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            Collective Departmental Research Knowledge
          </h1>
          <p className="text-amber-100 text-sm leading-relaxed mb-6">
            All research papers analyzed by students, complete with AI-generated 9-point summaries, 
            identified research gaps, and benchmark findings are cataloged here for current and future DIU cohorts.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search across research gaps, models, findings, or titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-800 rounded-xl font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-3 focus:ring-amber-300 shadow-sm text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 text-sm"
            >
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Domain Filters & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Domain Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {DOMAIN_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDomain === d
                  ? "bg-amber-700 text-white shadow-xs"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Upload Paper Shortcut */}
        <button
          onClick={() => navigate('/research/summarizer')}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Upload New Paper to Repository</span>
        </button>
      </div>

      {/* Shared Papers List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-500">Loading collective paper knowledge...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Shared Papers Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            No papers match your search. Analyze a new PDF with the AI Paper Summarizer to save it here!
          </p>
          <button
            onClick={() => navigate('/research/summarizer')}
            className="px-4 py-2 bg-amber-700 text-white text-xs font-semibold rounded-lg hover:bg-amber-800 transition-all"
          >
            Open AI Paper Summarizer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {paper.domain}
                  </span>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{paper.year || 2026}</span>
                  </div>
                </div>

                {/* Title & Authors */}
                <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">
                  {paper.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                  {paper.authors} {paper.journal_or_conference ? `• ${paper.journal_or_conference}` : ''}
                </p>

                {/* Contributor Pill */}
                <div className="text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5 mb-4">
                  <User className="w-3.5 h-3.5 text-diu-blue" />
                  <span>Contributed by: <strong>{paper.uploaded_by_name || 'DIU Student'}</strong></span>
                </div>

                {/* Highlighted Research Gap Box */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Identified Research Gap:</span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {paper.research_gap}
                  </p>
                </div>

                {/* Key Findings Box */}
                <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-900 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    <span>Findings & Results:</span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {paper.findings}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPaperModal(paper)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                >
                  <span>View 9-Point AI Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    navigate(`/research/similarity?topic=${encodeURIComponent(paper.title)}`);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                >
                  Compare Topic
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full 9-Point Summary Modal */}
      {selectedPaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedPaperModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              ✕
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2 inline-block">
                {selectedPaperModal.domain}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedPaperModal.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Authors: {selectedPaperModal.authors} • Contributed by {selectedPaperModal.uploaded_by_name}
              </p>
            </div>

            {/* 9 Structured Sections inside Modal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">1. Problem Statement:</strong>
                <p className="text-slate-600">{selectedPaperModal.problem_statement}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">2. Objectives:</strong>
                <p className="text-slate-600 whitespace-pre-line">{selectedPaperModal.objectives}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">3. Methodology:</strong>
                <p className="text-slate-600">{selectedPaperModal.methodology}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">4. Dataset:</strong>
                <p className="text-slate-600">{selectedPaperModal.dataset}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">5. Model / Technology:</strong>
                <p className="text-slate-600">{selectedPaperModal.model_technology}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">6. Findings & Results:</strong>
                <p className="text-slate-600">{selectedPaperModal.findings}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">7. Limitations:</strong>
                <p className="text-slate-600">{selectedPaperModal.limitations}</p>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-300">
                <strong className="block text-amber-900 font-bold mb-1">8. Research Gap:</strong>
                <p className="text-slate-800 font-medium">{selectedPaperModal.research_gap}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <strong className="block text-slate-800 font-bold mb-1">9. Future Work:</strong>
              <p className="text-slate-600">{selectedPaperModal.future_work}</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedPaperModal(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
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

export default SharedKnowledgeRepositoryPage;
