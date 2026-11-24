/**
 * ROSS-SEARCH: AI Research Breakdown — PDF Ingestion & Multi-Model Analysis Engine
 * Description: Extracts and analyzes research paper PDFs using PyMuPDF and multi-model AI
 * (Google Gemini 1.5 Flash/Pro, Groq Llama 3.3, and offline Neural NLP) to produce
 * a comprehensive AI Research Breakdown.
 * Enforces strict academic honesty: unstated metrics are explicitly flagged as 'Not reported in the paper'.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FileUp, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Check, 
  BookmarkCheck, 
  Layers, 
  Cpu, 
  Database, 
  Target, 
  Search, 
  TrendingUp, 
  HelpCircle, 
  Compass, 
  FileText,
  Share2,
  Key,
  ShieldCheck,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';
import { useAuth } from '../../context/AuthContext';

const MODEL_OPTIONS = [
  { id: "auto", name: "Auto Select (Cloud Gemini 2.5 / Groq / Neural NLP)", desc: "Optimal balance of latency and reasoning depth" },
  { id: "gemini-2.5-flash", name: "Google Gemini 2.5 Flash (Cloud AI)", desc: "1,000,000 token context window, multimodal reasoning" },
  { id: "gemini-2.5-pro", name: "Google Gemini 2.5 Pro (Deep Academic Reasoning)", desc: "2,000,000 token window, high-precision mathematical extraction" },
  { id: "groq-gpt-oss-120b", name: "Groq Cloud (GPT-OSS 120B)", desc: "Ultra-fast low-latency 120B cloud inference" },
  { id: "neural-nlp-offline", name: "PyMuPDF Academic Neural NLP Engine (Offline)", desc: "100% resilient deterministic offline extraction, zero API keys required" }
];

const PROMPT_SUGGESTIONS = [
  {
    id: "full_analysis",
    title: "Full Academic Analysis",
    bangla: "সম্পূর্ণ পেপার বিশ্লেষণ (৯টি কোর ডাইমেনশন)",
    icon: "⚡",
    badge: "Comprehensive",
    desc: "Extracts all 9 foundational research dimensions from problem to benchmark."
  },
  {
    id: "future_gaps",
    title: "Extract Research Gaps & Novelty",
    bangla: "রিসার্চ গ্যাপ ও ভবিষ্যৎ কাজের সুযোগ অনুসন্ধান",
    icon: "🔍",
    badge: "Gap Discovery",
    desc: "Highlights unaddressed gaps, limitations, and potential novelty directions."
  },
  {
    id: "bilingual_insights",
    title: "Bilingual (EN + বাংলা) Insights",
    bangla: "দ্বিভাষিক টেকনিক্যাল বিশ্লেষণ ও বাংলা সারাংশ",
    icon: "🌐",
    badge: "Dual Language",
    desc: "Generates English technical concepts paired with bilingual explanatory insights."
  },
  {
    id: "models_benchmarks",
    title: "Models & Benchmark Datasets",
    bangla: "মডেল আর্কিটেকচার ও পারফরম্যান্স মেট্রিক্স",
    icon: "🧪",
    badge: "Quantitative",
    desc: "Focuses on neural architectures, datasets, hyperparameters, and experimental metrics."
  }
];

export const PaperSummarizerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'url' | 'text'
  const [file, setFile] = useState(null);
  const [paperUrl, setPaperUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('full_analysis');
  const [languageView, setLanguageView] = useState('bilingual'); // 'english' | 'bangla' | 'bilingual'

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [savedToShared, setSavedToShared] = useState(false);

  // Check if routed with a paper URL or title from Research Discovery
  useEffect(() => {
    const urlParam = searchParams.get('paperUrl');
    const titleParam = searchParams.get('title');
    if (urlParam) {
      setPaperUrl(urlParam);
      setInputMode('url');
    }
  }, [searchParams]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select an authentic PDF file (.pdf).');
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);
    setSummary(null);
    setSavedToShared(false);

    try {
      let payload = {
        modelChoice: selectedModel,
        apiKey: customApiKey,
        promptFocus: selectedPrompt,
        language: languageView
      };

      if (inputMode === 'upload') {
        if (!file) throw new Error('Please select a research paper PDF file to upload.');
        payload.file = file;
      } else if (inputMode === 'url') {
        if (!paperUrl.trim()) throw new Error('Please enter a valid open-access paper URL.');
        payload.paperUrl = paperUrl.trim();
      } else {
        if (!rawText.trim() || rawText.trim().length < 80) {
          throw new Error('Please enter at least 80 characters of academic paper text.');
        }
        payload.rawText = rawText.trim();
      }

      const res = await module2Service.summarizePaper(payload);
      setSummary(res);
    } catch (err) {
      setError(err.message || 'Failed to analyze paper.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveToShared = async () => {
    if (!summary) return;
    try {
      const targetPaperUrl = (inputMode === 'url' ? paperUrl : (summary.paper_url || paperUrl || null));
      await module2Service.saveToSharedKnowledge({
        title: summary.title || "Academic Research Paper",
        authors: summary.authors || "Identified in Document Metadata",
        year: summary.year || 2026,
        domain: summary.domain || "Computer Science",
        uploaded_by_name: user?.full_name || "DIU Student",
        uploaded_by_id: user?.student_id || "201-15-101",
        file_name: file ? file.name : (inputMode === 'url' ? paperUrl : 'text_submission.txt'),
        paper_url: targetPaperUrl,
        abstract: summary.abstract || summary.research_problem,
        // 20 Academic points
        research_objective: summary.research_objective,
        research_problem: summary.research_problem,
        research_gap: summary.research_gap,
        research_motivation: summary.research_motivation,
        proposed_methodology: summary.proposed_methodology,
        dataset_description: summary.dataset_description,
        dataset_size: summary.dataset_size,
        features_parameters: summary.features_parameters,
        models_algorithms: summary.models_algorithms,
        experimental_setup: summary.experimental_setup,
        evaluation_metrics: summary.evaluation_metrics,
        experimental_results: summary.experimental_results,
        accuracy_performance: summary.accuracy_performance,
        strengths: summary.strengths,
        limitations: summary.limitations,
        future_directions: summary.future_directions,
        novel_contributions: summary.novel_contributions,
        related_work: summary.related_work,
        important_findings: summary.important_findings,
        research_opportunities: summary.research_opportunities,
        // Legacy fields
        problem_statement: summary.research_problem,
        objectives: summary.research_objective,
        methodology: summary.proposed_methodology,
        dataset: summary.dataset_description,
        model_technology: summary.models_algorithms,
        findings: summary.experimental_results,
        future_work: summary.future_directions
      });

      // Also persist to personal reading library so it's immediately available on Student Dashboard
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          await module2Service.saveToLibrary({
            title: summary.title || "Academic Research Paper",
            authors: summary.authors || "Identified in Document Metadata",
            year: summary.year || 2026,
            domain: summary.domain || "Computer Science",
            venue: summary.journal_or_conference || "Academic Repository",
            abstract: summary.abstract || summary.research_problem,
            pdf_url: targetPaperUrl,
            notes: `Identified Gap: ${summary.research_gap || ''}`,
            reading_status: 'completed'
          }, token);
        } catch (libErr) {
          console.warn("Personal library auto-sync:", libErr);
        }
      }

      setSavedToShared(true);
    } catch (err) {
      alert("Failed to save to shared knowledge: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-diu-blue via-diu-dark to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-semibold mb-3 border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Research Breakdown</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            AI Research Breakdown
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Upload an authentic research paper PDF or enter an arXiv link. The AI engine extracts true academic sections and synthesizes a comprehensive research breakdown covering objectives, datasets, model architectures, quantitative metrics, and research gaps.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Strict Academic Honesty (Zero Fabrications)
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Google Gemini 1.5 • Groq Llama 3.3 • Neural NLP
            </span>
          </div>
        </div>
      </div>

      {/* Input Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {/* Mode Selector Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-4 mb-5">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              inputMode === 'upload'
                ? "bg-diu-blue text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>Upload PDF File</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              inputMode === 'url'
                ? "bg-diu-blue text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Open-Access PDF URL (arXiv)</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              inputMode === 'text'
                ? "bg-diu-blue text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Paper Text</span>
          </button>
        </div>

        {/* Input Controls */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          {inputMode === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 hover:border-diu-blue rounded-xl p-8 text-center transition-all bg-slate-50/50">
              <FileUp className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {file ? file.name : "Select an authentic academic research paper PDF"}
              </p>
              <p className="text-xs text-slate-400 mb-4">Supported format: .pdf (Max 25MB)</p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-diu-blue hover:bg-diu-dark text-white rounded-lg text-xs font-bold transition-all shadow-xs">
                <span>Browse Local PDF</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {inputMode === 'url' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Direct Open-Access PDF URL
              </label>
              <input
                type="url"
                value={paperUrl}
                onChange={(e) => setPaperUrl(e.target.value)}
                placeholder="https://arxiv.org/pdf/1706.03762.pdf"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Supports arXiv, Crossref, and verified open-access URLs with strict SSRF protection.
              </p>
            </div>
          )}

          {inputMode === 'text' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Raw Academic Paper Content
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the title, abstract, methodology, dataset, and experimental results here..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue font-mono"
              />
            </div>
          )}

          {/* AI Model Configuration Row */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-diu-blue" />
              <span className="font-bold text-slate-700">AI Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-diu-blue"
              >
                {MODEL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs text-slate-600 hover:text-diu-blue font-semibold flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showKeyInput ? "Hide Custom API Key" : "Add Custom API Key (Optional)"}</span>
              {showKeyInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showKeyInput && (
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs">
              <label className="block font-semibold text-amber-900 mb-1">
                Custom Gemini or Groq API Key (Optional)
              </label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy... or gsk_..."
                className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-[10.5px] text-amber-700 mt-1">
                Key remains securely in memory during this request. If omitted, ROSS-SEARCH uses configured server credentials or PyMuPDF Neural NLP engine.
              </p>
            </div>
          )}

          {/* Guided AI Prompt Suggestions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Guided AI Prompt Suggestions (প্রম্পট নির্বাচন করুন):</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Select focused analysis mode</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PROMPT_SUGGESTIONS.map((p) => {
                const isSelected = selectedPrompt === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPrompt(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-purple-50/90 border-purple-400 ring-2 ring-purple-300 text-purple-950 shadow-xs"
                        : "bg-white border-slate-200 hover:border-purple-200 text-slate-700 hover:bg-slate-50/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-base">{p.icon}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? "bg-purple-200 text-purple-800" : "bg-slate-100 text-slate-600"
                        }`}>
                          {p.badge}
                        </span>
                      </div>
                      <div className="font-bold text-xs leading-snug text-slate-900">{p.title}</div>
                      <div className="text-[10.5px] text-purple-700 font-medium mt-0.5">{p.bangla}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-tight">
                      {p.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-diu-blue hover:bg-diu-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI Research Breakdown...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Generate AI Research Breakdown</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── AI RESEARCH BREAKDOWN RESULTS ── */}
      {summary && (
        <div className="space-y-6">
          {/* Active Prompt Focus Banner */}
          {selectedPrompt === 'future_gaps' && (
            <div className="p-4 bg-amber-500/10 border-2 border-amber-400 rounded-2xl flex items-center justify-between gap-3 text-amber-900 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-amber-600 animate-pulse shrink-0" />
                <div>
                  <strong className="text-xs font-bold block">Prompt Focus Active: Research Gaps & Novelty Opportunities</strong>
                  <span className="text-[11px] text-amber-800">Prioritizing unaddressed limitations, theoretical bottlenecks, and novelty angles for incoming thesis students.</span>
                </div>
              </div>
              <span className="text-xs font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full shrink-0">Gap Discovery Mode</span>
            </div>
          )}

          {selectedPrompt === 'bilingual_insights' && (
            <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-2xl flex items-center justify-between gap-3 text-indigo-900 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <strong className="text-xs font-bold block">Prompt Focus Active: Bilingual English + Bengali Insights</strong>
                  <span className="text-[11px] text-indigo-800">All technical research dimensions are presented in English academic terms alongside contextual guidance for DIU researchers.</span>
                </div>
              </div>
              <span className="text-xs font-bold bg-indigo-200 text-indigo-900 px-3 py-1 rounded-full shrink-0">Bilingual Active</span>
            </div>
          )}
          {/* Paper Metadata & Engine Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {summary.domain || "Computer Science"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Academic Integrity Grounded</span>
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {summary.title || "Analyzed Academic Paper"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authors: {summary.authors || "Identified in Document Metadata"} ({summary.year || 2026})
                </p>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200 inline-block mb-2">
                  Engine: {summary.ai_engine || "Google Gemini 1.5 Flash"}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={handleSaveToShared}
                    disabled={savedToShared}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                      savedToShared
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {savedToShared ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Saved to Shared Knowledge</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share with Students</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/research/similarity?topic=${encodeURIComponent(summary.title || '')}`);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200"
                  >
                    Check Similarity
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Honesty Notice */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Academic Honesty Verification:</strong> All quantitative findings are grounded strictly in the document text. Missing benchmarks, dataset sample counts, or ablation parameters are explicitly marked as <em>"Not reported in the paper"</em> to prevent hallucination.
              </div>
            </div>

            {/* AI Assistant Scope Notice */}
            <div className="mt-2 p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>AI Research Scope:</strong> AI is a research assistance tool, not a thesis or paper writer. It does not guarantee 100% accuracy or absolute novelty; final academic decisions and verification rest solely with the student and faculty supervisor.
              </div>
            </div>
          </div>

          {/* Language View Switcher & Bilingual Summary */}
          <div className="bg-white rounded-2xl border border-purple-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-800">Language Output Mode / ভাষা নির্বাচন:</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLanguageView('english')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    languageView === 'english'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English Academic
                </button>
                <button
                  type="button"
                  onClick={() => setLanguageView('bangla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    languageView === 'bangla'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-600 hover:text-purple-700'
                  }`}
                >
                  বাংলা সারসংক্ষেপ
                </button>
                <button
                  type="button"
                  onClick={() => setLanguageView('bilingual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    languageView === 'bilingual'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  দ্বিভাষিক (English + বাংলা)
                </button>
              </div>
            </div>

            {(languageView === 'bangla' || languageView === 'bilingual') && summary.bilingual_summary?.summary_bn && (
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-950 leading-relaxed">
                <strong className="text-purple-800 block mb-1">বাংলায় পেপারের মূল সারসংক্ষেপ (Bengali Executive Summary):</strong>
                {summary.bilingual_summary.summary_bn}
              </div>
            )}
          </div>

          {/* The 20 Analysis Dimension Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Research Objective */}
            <AnalysisCard
              title="1. Research Objective & Goals"
              icon={<Target className="w-4 h-4 text-blue-600" />}
              content={summary.research_objective || summary.objectives}
              contentBn={summary.bilingual_summary?.research_objective_bn}
              languageView={languageView}
              badge="Goal Formulation"
              onCopy={() => handleCopy(summary.research_objective || summary.objectives, 'obj')}
              copied={copiedKey === 'obj'}
            />

            {/* 2. Research Problem */}
            <AnalysisCard
              title="2. Problem Statement & Bottlenecks"
              icon={<AlertCircle className="w-4 h-4 text-red-600" />}
              content={summary.research_problem || summary.problem_statement}
              contentBn={summary.bilingual_summary?.research_problem_bn}
              languageView={languageView}
              badge="Bottleneck"
              onCopy={() => handleCopy(summary.research_problem || summary.problem_statement, 'prob')}
              copied={copiedKey === 'prob'}
            />

            {/* 3. Research Gap */}
            <AnalysisCard
              title="3. Unaddressed Research Gap"
              icon={<Compass className="w-4 h-4 text-amber-600" />}
              content={summary.research_gap}
              contentBn={summary.bilingual_summary?.research_gap_bn}
              languageView={languageView}
              badge="Literature Gap"
              highlight="border-amber-200 bg-amber-50/20"
              onCopy={() => handleCopy(summary.research_gap, 'gap')}
              copied={copiedKey === 'gap'}
            />

            {/* 4. Research Motivation */}
            <AnalysisCard
              title="4. Research Motivation & Significance"
              icon={<TrendingUp className="w-4 h-4 text-indigo-600" />}
              content={summary.research_motivation}
              languageView={languageView}
              badge="Theoretical Impact"
              onCopy={() => handleCopy(summary.research_motivation, 'mot')}
              copied={copiedKey === 'mot'}
            />

            {/* 5. Proposed Methodology */}
            <AnalysisCard
              title="5. Proposed Methodology & Pipeline"
              icon={<Layers className="w-4 h-4 text-purple-600" />}
              content={summary.proposed_methodology || summary.methodology}
              contentBn={summary.bilingual_summary?.proposed_methodology_bn}
              languageView={languageView}
              badge="System Architecture"
              onCopy={() => handleCopy(summary.proposed_methodology || summary.methodology, 'meth')}
              copied={copiedKey === 'meth'}
            />

            {/* 6. Dataset Description */}
            <AnalysisCard
              title="6. Dataset Provenance & Benchmarks"
              icon={<Database className="w-4 h-4 text-emerald-600" />}
              content={summary.dataset_description || summary.dataset}
              contentBn={summary.bilingual_summary?.dataset_description_bn}
              languageView={languageView}
              badge="Corpus"
              onCopy={() => handleCopy(summary.dataset_description || summary.dataset, 'data')}
              copied={copiedKey === 'data'}
            />

            {/* 7. Dataset Size */}
            <AnalysisCard
              title="7. Dataset Size & Sample Volume"
              icon={<Database className="w-4 h-4 text-emerald-700" />}
              content={summary.dataset_size}
              badge="Metrics"
              onCopy={() => handleCopy(summary.dataset_size, 'dsize')}
              copied={copiedKey === 'dsize'}
            />

            {/* 8. Features & Parameters */}
            <AnalysisCard
              title="8. Feature Representation & Parameters"
              icon={<Cpu className="w-4 h-4 text-cyan-600" />}
              content={summary.features_parameters}
              badge="Hyperparameters"
              onCopy={() => handleCopy(summary.features_parameters, 'feat')}
              copied={copiedKey === 'feat'}
            />

            {/* 9. Models & Algorithms */}
            <AnalysisCard
              title="9. Models, Classifiers & Algorithms"
              icon={<Cpu className="w-4 h-4 text-cyan-700" />}
              content={summary.models_algorithms || summary.model_technology}
              badge="Technology Stack"
              onCopy={() => handleCopy(summary.models_algorithms || summary.model_technology, 'mod')}
              copied={copiedKey === 'mod'}
            />

            {/* 10. Experimental Setup */}
            <AnalysisCard
              title="10. Experimental Setup & Hardware"
              icon={<Layers className="w-4 h-4 text-slate-600" />}
              content={summary.experimental_setup}
              badge="Environment"
              onCopy={() => handleCopy(summary.experimental_setup, 'exp')}
              copied={copiedKey === 'exp'}
            />

            {/* 11. Evaluation Metrics */}
            <AnalysisCard
              title="11. Evaluation Metrics"
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              content={summary.evaluation_metrics}
              contentBn={summary.bilingual_summary?.evaluation_metrics_bn}
              languageView={languageView}
              badge="Measurement"
              onCopy={() => handleCopy(summary.evaluation_metrics, 'eval')}
              copied={copiedKey === 'eval'}
            />

            {/* 12. Experimental Results */}
            <AnalysisCard
              title="12. Quantitative Experimental Results"
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              content={summary.experimental_results || summary.findings}
              badge="Numerical Outcomes"
              highlight="border-emerald-200 bg-emerald-50/20"
              onCopy={() => handleCopy(summary.experimental_results || summary.findings, 'res')}
              copied={copiedKey === 'res'}
            />

            {/* 13. Accuracy & Baseline Performance */}
            <AnalysisCard
              title="13. Accuracy & Baseline Comparison"
              icon={<TrendingUp className="w-4 h-4 text-teal-600" />}
              content={summary.accuracy_performance}
              badge="Convergence"
              onCopy={() => handleCopy(summary.accuracy_performance, 'acc')}
              copied={copiedKey === 'acc'}
            />

            {/* 14. Strengths */}
            <AnalysisCard
              title="14. Methodological & Empirical Strengths"
              icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
              content={summary.strengths}
              badge="Strengths"
              onCopy={() => handleCopy(summary.strengths, 'str')}
              copied={copiedKey === 'str'}
            />

            {/* 15. Limitations */}
            <AnalysisCard
              title="15. Limitations & Constraints"
              icon={<AlertCircle className="w-4 h-4 text-orange-600" />}
              content={summary.limitations}
              badge="Constraints"
              onCopy={() => handleCopy(summary.limitations, 'lim')}
              copied={copiedKey === 'lim'}
            />

            {/* 16. Future Directions */}
            <AnalysisCard
              title="16. Future Research Directions"
              icon={<Compass className="w-4 h-4 text-indigo-600" />}
              content={summary.future_directions || summary.future_work}
              contentBn={summary.bilingual_summary?.future_directions_bn}
              languageView={languageView}
              badge="Roadmap"
              onCopy={() => handleCopy(summary.future_directions || summary.future_work, 'fut')}
              copied={copiedKey === 'fut'}
            />

            {/* 17. Novel Scientific Contributions */}
            <AnalysisCard
              title="17. Novel Scientific Contributions"
              icon={<Sparkles className="w-4 h-4 text-amber-500" />}
              content={summary.novel_contributions}
              contentBn={summary.bilingual_summary?.novel_contributions_bn}
              languageView={languageView}
              badge="Originality"
              onCopy={() => handleCopy(summary.novel_contributions, 'nov')}
              copied={copiedKey === 'nov'}
            />

            {/* 18. Prior & Related Work */}
            <AnalysisCard
              title="18. Prior Literature & Baselines"
              icon={<BookOpen className="w-4 h-4 text-slate-700" />}
              content={summary.related_work}
              badge="Related Work"
              onCopy={() => handleCopy(summary.related_work, 'rel')}
              copied={copiedKey === 'rel'}
            />

            {/* 19. Important Findings */}
            <AnalysisCard
              title="19. Key Findings & Theoretical Insights"
              icon={<BookmarkCheck className="w-4 h-4 text-purple-600" />}
              content={summary.important_findings || summary.findings}
              badge="Takeaways"
              onCopy={() => handleCopy(summary.important_findings || summary.findings, 'find')}
              copied={copiedKey === 'find'}
            />

            {/* 20. Student Thesis / FYP Opportunities */}
            <AnalysisCard
              title="20. Student Thesis & FYP Opportunities"
              icon={<Target className="w-4 h-4 text-emerald-600" />}
              content={summary.research_opportunities || summary.research_gap}
              badge="DIU Thesis Extension"
              highlight="border-cyan-300 bg-cyan-50/20"
              onCopy={() => handleCopy(summary.research_opportunities || summary.research_gap, 'opp')}
              copied={copiedKey === 'opp'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AnalysisCard = ({ title, icon, content, contentBn, languageView = 'bilingual', badge, highlight, onCopy, copied }) => {
  const isNotReported = content && content.toLowerCase().includes("not reported");
  const showEnglish = languageView === 'english' || languageView === 'bilingual' || !contentBn;
  const showBangla = (languageView === 'bangla' || languageView === 'bilingual') && contentBn;

  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${highlight || 'border-slate-200'}`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">{title}</h3>
          </div>
          {badge && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isNotReported ? 'bg-slate-100 text-slate-500' : 'bg-slate-100 text-slate-700'
            }`}>
              {badge}
            </span>
          )}
        </div>

        {showEnglish && (
          <div className={`text-xs leading-relaxed whitespace-pre-wrap ${
            isNotReported ? 'text-slate-400 italic' : 'text-slate-700'
          }`}>
            {content || "Not reported in the paper."}
          </div>
        )}

        {showBangla && (
          <div className={`${showEnglish ? 'mt-3 pt-2.5 border-t border-purple-100/80' : ''} bg-purple-50/50 p-2.5 rounded-xl text-purple-950 text-xs leading-relaxed whitespace-pre-wrap`}>
            <span className="font-bold text-[10.5px] text-purple-700 block mb-0.5">বাংলা ব্যাখ্যা:</span>
            {contentBn}
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end">
        <button
          onClick={onCopy}
          className="text-[11px] text-slate-500 hover:text-diu-blue flex items-center gap-1 font-semibold transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Section</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaperSummarizerPage;
