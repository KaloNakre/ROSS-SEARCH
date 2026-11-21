/**
 * ROSS-SEARCH: Module 2 — Research Discovery & Previous Projects Archive
 * Contributor: Riya Saha (ID: 232-35-715)
 * Description: Allows students to select research domains, submit research queries,
 * explore authentic open-access papers (arXiv, Crossref) with verified DOIs, save papers
 * to a personal reading library with BibTeX export, and search departmental FYP/Thesis projects.
 */

import React, { useState, useEffect } from 'react';
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
  Download,
  Share2,
  FileDown,
  Bookmark,
  BookmarkCheck,
  Check,
  Trash2,
  FileSpreadsheet,
  Cpu
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';
import { useAuth } from '../../context/AuthContext';

const DOMAIN_OPTIONS = [
  "All",
  "Cyber Security",
  "Natural Language Processing",
  "Computer Vision",
  "Machine Learning",
  "Blockchain",
  "Internet of Things",
  "Healthcare AI"
];

const BATCH_OPTIONS = ["All", "Batch 40", "Batch 41", "Batch 42", "Batch 43", "Batch 44", "Batch 45"];

export const ResearchDiscoveryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const [activeTab, setActiveTab] = useState("papers"); // 'papers' | 'archive' | 'library' | 'topics'

  const [academicPapers, setAcademicPapers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [libraryPapers, setLibraryPapers] = useState([]);
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState({});
  const [selectedModalItem, setSelectedModalItem] = useState(null);

  // Fetch academic papers, previous departmental projects, topic ideas, and personal library
  const loadData = async () => {
    setLoading(true);
    try {
      const [papersData, projectsData, topicsData] = await Promise.all([
        module2Service.getAcademicPapers({
          domain: selectedDomain,
          q: searchQuery,
          year_from: yearFrom ? Number(yearFrom) : undefined,
          year_to: yearTo ? Number(yearTo) : undefined,
          author: authorQuery || undefined
        }),
        module2Service.getPreviousProjects({
          domain: selectedDomain,
          batch: selectedBatch,
          q: searchQuery
        }),
        module2Service.getSuggestedTopics(selectedDomain)
      ]);
      setAcademicPapers(papersData);
      setProjects(projectsData);
      setSuggestedTopics(topicsData);

      if (token) {
        try {
          const lib = await module2Service.getLibrary(token);
          setLibraryPapers(lib);
        } catch (e) {
          console.log("Library load error:", e);
        }
      }
    } catch (err) {
      console.error("Failed to load discovery data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDomain, selectedBatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
    if (searchQuery.trim()) {
      module2Service.logResearchQuery({
        query_text: searchQuery,
        domain: selectedDomain !== "All" ? selectedDomain : "General",
        student_id: user?.student_id || "232-35-715",
        student_name: user?.full_name || "Riya Saha"
      });
    }
  };

  const handleSaveToLibrary = async (paper) => {
    if (!token) {
      alert("Please log in to save papers to your personal research library.");
      return;
    }
    try {
      await module2Service.saveToLibrary({
        title: paper.title,
        authors: paper.authors,
        year: paper.year,
        domain: paper.domain,
        venue: paper.venue,
        abstract: paper.abstract,
        doi: paper.doi,
        arxiv_id: paper.arxiv_id,
        pdf_url: paper.pdf_url,
        notes: `Key Findings: ${paper.key_findings || ''}`,
        reading_status: 'reading'
      }, token);

      setSavedFeedback(prev => ({ ...prev, [paper.title]: true }));
      // Refresh library list
      const updatedLib = await module2Service.getLibrary(token);
      setLibraryPapers(updatedLib);
      setTimeout(() => {
        setSavedFeedback(prev => ({ ...prev, [paper.title]: false }));
      }, 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFromLibrary = async (savedId) => {
    if (!token) return;
    try {
      await module2Service.deleteFromLibrary(savedId, token);
      setLibraryPapers(prev => prev.filter(p => p.id !== savedId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportBibTeX = async () => {
    if (!token) return;
    try {
      const res = await module2Service.exportLibrary('bibtex', token);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my_research_library.bib';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Failed to export BibTeX: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-diu-blue via-diu-dark to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Module 2: Research Discovery & Shared Paper Knowledge</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            Academic Research Discovery & Departmental Archive
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed mb-6">
            Explore authentic open-access papers (arXiv, Crossref) with verified DOIs and citations,
            stream publication PDFs directly, manage your personal reading list with BibTeX export,
            or explore previous DIU FYP/Thesis reports to identify research gaps.
          </p>

          {/* Search Query Input */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search real papers, previous projects, or topic keywords (e.g., 'SCADA', 'BanglaBERT', 'Transformer')..."
                className="w-full bg-white text-slate-900 placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-md font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Domain Quick-Pill Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-diu-blue" />
            <span>Filter by Research Domain</span>
          </div>
          {selectedDomain !== "All" && (
            <button
              onClick={() => setSelectedDomain("All")}
              className="text-xs text-diu-blue hover:underline font-semibold"
            >
              Reset Domain
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {DOMAIN_OPTIONS.map((dom) => {
            const active = selectedDomain === dom;
            return (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? "bg-diu-blue text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {dom}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters: Publication Year Range & Author */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <span>Year:</span>
            <input
              type="number"
              placeholder="From (2018)"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal"
            />
            <span>–</span>
            <input
              type="number"
              placeholder="To (2025)"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal"
            />
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <span>Author:</span>
            <input
              type="text"
              placeholder="e.g. Vaswani, LeCun"
              value={authorQuery}
              onChange={(e) => setAuthorQuery(e.target.value)}
              className="w-36 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal"
            />
          </div>

          <button
            onClick={() => loadData()}
            className="px-3 py-1 bg-diu-blue hover:bg-diu-dark text-white rounded-lg font-semibold text-xs transition-colors"
          >
            Apply Filters
          </button>

          {(yearFrom || yearTo || authorQuery) && (
            <button
              onClick={() => { setYearFrom(""); setYearTo(""); setAuthorQuery(""); }}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("papers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "papers"
                ? "bg-purple-700 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Verified Academic Papers ({academicPapers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("topics")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "topics"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Novel Thesis Ideas ({suggestedTopics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("archive")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "archive"
                ? "bg-diu-blue text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>DIU FYP Archive ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "library"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>My Research Library ({libraryPapers.length})</span>
          </button>
        </div>

        {activeTab === "archive" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Batch:</span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-diu-blue"
            >
              {BATCH_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {activeTab === "library" && libraryPapers.length > 0 && (
          <button
            onClick={handleExportBibTeX}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Library as BibTeX</span>
          </button>
        )}
      </div>

      {/* ── TAB 1: PUBLISHED ACADEMIC PAPERS (ARXIV / CROSSREF / LANDMARK) ── */}
      {activeTab === "papers" && (
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
              <p className="text-xs font-medium text-slate-500">Querying verified academic repositories (arXiv & Crossref)...</p>
            </div>
          ) : academicPapers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No Academic Papers Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Try selecting a different domain or resetting filters.
              </p>
              <button
                onClick={() => { setSelectedDomain("All"); setSearchQuery(""); }}
                className="px-4 py-2 bg-diu-blue text-white text-xs font-semibold rounded-lg"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {academicPapers.map((paper, idx) => {
                const isSaved = libraryPapers.some(p => p.title.toLowerCase() === paper.title.toLowerCase()) || savedFeedback[paper.title];
                return (
                  <div
                    key={paper.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Header Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {paper.domain}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Verified Open Access
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{paper.year}</span>
                          <span>•</span>
                          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                            {paper.citations.toLocaleString()} Citations
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 hover:text-purple-700 transition-colors">
                        {paper.title}
                      </h3>

                      {/* Authors & Venue */}
                      <p className="text-xs text-slate-500 mb-2">
                        {paper.authors} • <em className="text-slate-700">{paper.venue}</em>
                      </p>

                      {/* Identifiers: DOI / arXiv */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-3">
                        {paper.arxiv_id && (
                          <a
                            href={`https://arxiv.org/abs/${paper.arxiv_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-700 hover:underline font-medium inline-flex items-center gap-1"
                          >
                            <span>arXiv:{paper.arxiv_id}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-700 hover:underline font-medium inline-flex items-center gap-1"
                          >
                            <span>DOI:{paper.doi}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <span className="text-slate-400 font-mono text-[10px]">Source: {paper.source}</span>
                      </div>

                      {/* Abstract */}
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                        {paper.abstract}
                      </p>

                      {/* Key Findings Preview */}
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 mb-4 font-medium">
                        <strong>Key Finding:</strong> {paper.key_findings}
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(paper.keywords || []).map((kw, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Download PDF, Save to Library, AI Summarize, and Similarity */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Direct PDF Stream Download */}
                        <a
                          href={paper.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          title="Stream Authentic Open-Access PDF"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Direct PDF</span>
                        </a>

                        {/* Save to Library Button */}
                        <button
                          onClick={() => handleSaveToLibrary(paper)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            isSaved
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          }`}
                          title="Save to Personal Research Library"
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                              <span>Save</span>
                            </>
                          )}
                        </button>

                        {/* Send to AI Summarizer */}
                        <button
                          onClick={() => {
                            navigate(`/research/summarizer?paperUrl=${encodeURIComponent(paper.pdf_url)}&title=${encodeURIComponent(paper.title)}`);
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Generate 20-point AI analysis"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Analyze</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigate(`/research/similarity?topic=${encodeURIComponent(paper.title)}`);
                          }}
                          className="text-[11px] text-emerald-700 hover:underline font-semibold"
                        >
                          Check Similarity
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: DEPARTMENTAL FYP / THESIS ARCHIVE ── */}
      {activeTab === "archive" && (
        <div>
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
                No departmental projects matched your query.
              </p>
              <button
                onClick={() => { setSelectedDomain("All"); setSelectedBatch("All"); setSearchQuery(""); }}
                className="px-4 py-2 bg-diu-blue text-white text-xs font-semibold rounded-lg"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-diu-blue hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-diu-blue border border-blue-200">
                        {proj.domain}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{proj.batch}</span>
                        <span>•</span>
                        <span>{proj.year}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                      {proj.title}
                    </h3>

                    <div className="space-y-1 mb-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Supervisor: <strong className="text-slate-800">{proj.supervisor_name}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Authors: {proj.team_members}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                      {proj.abstract}
                    </p>

                    {proj.keywords && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.keywords.split(',').map((kw, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                            #{kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedModalItem(proj)}
                      className="text-xs text-diu-blue hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>View Full Project Overview</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/research/similarity?topic=${encodeURIComponent(proj.title)}`);
                      }}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Check Duplicate Risk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: PERSONAL RESEARCH LIBRARY & READING LIST ── */}
      {activeTab === "library" && (
        <div>
          {libraryPapers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">Your Research Library is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Explore verified academic papers in the "Verified Academic Papers" tab and click "Save" to build your thesis reading list.
              </p>
              <button
                onClick={() => setActiveTab("papers")}
                className="px-4 py-2 bg-purple-700 text-white text-xs font-bold rounded-lg"
              >
                Explore Papers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {libraryPapers.map((saved) => (
                <div
                  key={saved.id}
                  className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {saved.domain || 'Computer Science'}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                        Status: {saved.reading_status || 'Reading'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                      {saved.title}
                    </h3>

                    <p className="text-xs text-slate-500 mb-2">
                      {saved.authors} • <em>{saved.venue || 'Academic Repository'}</em> ({saved.year})
                    </p>

                    {saved.abstract && (
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {saved.abstract}
                      </p>
                    )}

                    {saved.notes && (
                      <div className="text-[11px] text-slate-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 mb-4 font-medium">
                        <strong>My Reading Notes:</strong> {saved.notes}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {saved.pdf_url && (
                        <a
                          href={saved.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      )}
                      <button
                        onClick={() => {
                          navigate(`/research/summarizer?paperUrl=${encodeURIComponent(saved.pdf_url || '')}&title=${encodeURIComponent(saved.title)}`);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Analysis</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteFromLibrary(saved.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Remove from reading list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: NOVEL THESIS & TOPIC SUGGESTIONS ── */}
      {activeTab === "topics" && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Departmental Research Topic Intelligence</span>
              </h3>
              <p className="text-xs text-amber-900 mt-1">
                Curated novel FYP topics formulated with specific methodology, public benchmark datasets, and innovation gaps.
              </p>
            </div>
            <button
              onClick={() => navigate('/research/similarity')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shrink-0 shadow-xs transition-colors"
            >
              Test Custom Topic Duplicate Risk &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {suggestedTopics.map((topic, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-diu-blue border border-blue-200">
                      {topic.domain}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {topic.difficulty_level || 'Moderate'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                    {topic.title}
                  </h3>

                  {topic.subdomain && (
                    <div className="text-[11px] font-semibold text-slate-500 mb-3">
                      Subdomain: <span className="text-slate-800">#{topic.subdomain}</span>
                    </div>
                  )}

                  <div className="space-y-2.5 text-xs text-slate-600 mb-4 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <strong className="text-slate-800">Novelty Angle:</strong> {topic.novelty_angle}
                    </div>
                    <div>
                      <strong className="text-slate-800">Recommended Datasets:</strong> {topic.recommended_datasets}
                    </div>
                    <div>
                      <strong className="text-slate-800">Suggested Methodology:</strong> {topic.suggested_methodology}
                    </div>
                    <div>
                      <strong className="text-slate-800">Expected Contributions:</strong> {topic.expected_contributions}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      navigate(`/research/chat`);
                    }}
                    className="text-xs text-diu-blue hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Discuss with AI Assistant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/research/similarity?topic=${encodeURIComponent(topic.title)}`);
                    }}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Check Duplicate Risk
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Full Project Detail */}
      {selectedModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-diu-blue px-2.5 py-0.5 bg-blue-50 rounded-full border border-blue-200">
                {selectedModalItem.domain} • {selectedModalItem.batch}
              </span>
              <button
                onClick={() => setSelectedModalItem(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              {selectedModalItem.title}
            </h2>
            <div className="text-xs text-slate-600 mb-4 space-y-1">
              <div>Supervisor: <strong className="text-slate-800">{selectedModalItem.supervisor_name}</strong></div>
              <div>Team Members: {selectedModalItem.team_members}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed mb-4">
              <strong>Abstract & Problem Scope:</strong>
              <p className="mt-1">{selectedModalItem.abstract}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedModalItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
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
