/**
 * ROSS-SEARCH: Module 3 — AI Proposal Structure & Grammar Checker
 * Assigned to: [Robayet Islam – ID: 809]
 * 
 * Capabilities:
 * - Checks proposal/thesis structure against official DIU academic templates
 * - Verifies mandatory sections (Abstract, Problem, Objectives, Lit Review, Methodology, Dataset, Timeline, References)
 * - Identifies missing sections with specific recommendations
 * - Audits academic grammar, tone, spelling, and citation formatting
 * - Outputs an objective Format Compliance Score (0-100)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Loader2, 
  Download, 
  BookOpen, 
  ShieldCheck, 
  FileText,
  RotateCcw
} from 'lucide-react';
import { module3Service } from '../../services/module3Service';

const SAMPLE_PROPOSAL_TEXT = `Title: Real-Time IoT Intrusion Detection Using Deep Convolutional Neural Networks

Abstract:
Internet of Things (IoT) devices are increasingly deployed in critical infrastructures. However, their resource constraints make them vulnerable to distributed denial-of-service (DDoS) and botnet intrusions. This research develops a lightweight deep convolutional neural network (CNN) capable of real-time anomaly detection at the network edge.

1. Problem Statement & Motivation:
Current signature-based intrusion detection systems cannot adapt to zero-day attack patterns. Moreover, cloud-centric detection creates latency bottlenecks that expose critical sensor networks before mitigation rules propagate.

2. Research Objectives:
1. Design a lightweight 1D-CNN architecture optimized for low-latency edge gateways.
2. Evaluate detection accuracy and false alarm rates on the standard BoT-IoT benchmark dataset.
3. Validate memory consumption and inference time on a Raspberry Pi 4 testbed.

3. Literature Review:
Prior studies by Vaswani et al. [1] and McMahan et al. [2] examined decentralized learning, while recent works on IoT security demonstrated autoencoders for anomaly scoring. However, existing models suffer from severe inference latency on embedded nodes.

4. Proposed Methodology & Architecture:
We formulate a quantized 1D-CNN pipeline with depthwise separable convolutions to minimize floating-point operations. Network packets are preprocessed into flow statistical vectors and normalized before tensor inference.

5. Dataset & Experimental Setup:
Experiments are conducted on 25,000 traffic flow instances from the BoT-IoT dataset. Features include packet count, byte rate, and connection duration. Model evaluation employs 5-fold cross-validation.

6. Work Plan & Milestones:
- Month 1: Dataset preprocessing and baseline implementation.
- Month 2: CNN optimization and hyperparameter tuning.
- Month 3: Hardware edge deployment and comparative latency benchmarks.
- Month 4: Final dissertation drafting and viva defense preparation.

7. References:
[1] Vaswani, A., et al. Attention Is All You Need. NeurIPS 2017.
[2] McMahan, B., et al. Communication-Efficient Learning of Deep Networks. AISTATS 2017.`;

export const ProposalCheckerPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('ross_token') || localStorage.getItem('token') || sessionStorage.getItem('token');

  const [documentTitle, setDocumentTitle] = useState('IoT Intrusion Detection Proposal');
  const [documentType, setDocumentType] = useState('proposal');
  const [rawText, setRawText] = useState(SAMPLE_PROPOSAL_TEXT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    if (!token) {
      setError('Please log in to run AI document analysis.');
      return;
    }
    if (!rawText.trim() || rawText.trim().length < 50) {
      setError('Please enter at least 50 characters of proposal text.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await module3Service.checkDocument({
        documentTitle: documentTitle.trim() || 'Untitled Proposal Document',
        documentType,
        rawText: rawText.trim()
      }, token);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze proposal document.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSample = () => {
    setDocumentTitle('IoT Intrusion Detection Proposal');
    setRawText(SAMPLE_PROPOSAL_TEXT);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-semibold border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Module 3: Proposal & Document Intelligence</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            AI Proposal Structure & Grammar Checker
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Verify your FYP/Thesis proposal against official DIU academic standards before submitting to your faculty supervisor. Detect missing required sections, audit academic grammar, and check formatting compliance.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => navigate('/proposal/templates')}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-blue-50 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Download size={14} /> Official DIU PPTX Templates
            </button>
            <button
              onClick={() => navigate('/project/submissions')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <FileText size={14} /> My Project Submissions
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form on Left, Guidelines on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 Cols */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-diu-blue" />
                <span>Document Input & Structure Verification</span>
              </h2>
              <p className="text-[11px] text-slate-500">Paste your proposal text or presentation script below</p>
            </div>
            <button
              type="button"
              onClick={handleResetSample}
              className="text-xs text-diu-blue hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Load Sample</span>
            </button>
          </div>

          <form onSubmit={handleCheck} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="e.g. Real-Time IoT Intrusion Detection"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-diu-blue"
                >
                  <option value="proposal">FYP Proposal Presentation (PPT/PPTX)</option>
                  <option value="thesis_chapter">Thesis Chapter / Literature Review</option>
                  <option value="progress_report">Mid-Term Progress Report</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Proposal / Thesis Content (Plain Text)
              </label>
              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the abstract, objectives, literature review, and methodology of your proposal here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 font-mono leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue resize-y"
                required
              />
              <span className="text-[10.5px] text-slate-400 block mt-1">
                {rawText.length} characters • Analyzed against official 8-section DIU standard
              </span>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Grounded in Departmental FYP Criteria
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-diu-blue hover:bg-diu-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Structure & Grammar...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Run AI Structure & Grammar Check</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info: 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mandatory DIU Proposal Sections</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">1</span>
                <span>Title & Executive Abstract</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">2</span>
                <span>Problem Statement & Research Motivation</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">3</span>
                <span>Specific Objectives & Project Scope</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">4</span>
                <span>Literature Review & Related Prior Work</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">5</span>
                <span>Proposed Methodology & System Pipeline</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">6</span>
                <span>Dataset Composition & Benchmark Setup</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">7</span>
                <span>Work Plan, Milestones & Timeline</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">8</span>
                <span>Formal References (IEEE/APA Standard)</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-3xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Next Step: Practice Viva Defense</span>
            </div>
            <p className="text-[11px] text-indigo-800 leading-relaxed">
              Once your proposal structure is verified, generate AI-assisted practice viva questions tailored to your project objectives and methodology.
            </p>
            <button
              onClick={() => navigate('/student/viva-prep')}
              className="mt-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
            >
              <span>Go to AI Viva Preparation</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── RESULTS CARD ── */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6 animate-fadeIn">
          {/* Header Score Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  result.structure_status === 'compliant'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : result.structure_status === 'partially_compliant'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {result.structure_status.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">Audited against DIU Master Template</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{result.document_title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{result.summary_findings}</p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Compliance Score</span>
                <span className="text-xs text-slate-400">Target: ≥80%</span>
              </div>
              <div className={`text-3xl font-black ${
                result.overall_compliance_score >= 80 ? 'text-emerald-600' :
                result.overall_compliance_score >= 50 ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {result.overall_compliance_score}<span className="text-sm font-semibold text-slate-400">/100</span>
              </div>
            </div>
          </div>

          {/* Missing Sections Alert (if any) */}
          {result.missing_sections && result.missing_sections.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-amber-900 block">
                  Missing Mandatory Sections Detected ({result.missing_sections.length}):
                </strong>
                <p className="text-xs text-amber-800 mt-0.5">
                  The following required sections were not clearly detected: <strong>{result.missing_sections.join(', ')}</strong>. Please include explicit section headings to ensure full compliance.
                </p>
              </div>
            </div>
          )}

          {/* Section Detection Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Required Section Detection Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.detected_sections.map((sec, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    sec.status === 'present'
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                      : 'bg-rose-50/40 border-rose-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs">{sec.section_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      sec.status === 'present'
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-rose-200 text-rose-900'
                    }`}>
                      {sec.status === 'present' ? 'Found' : 'Missing'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 font-mono">
                    {sec.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar & Academic Tone Issues */}
          {result.grammar_spelling_issues && result.grammar_spelling_issues.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-600" />
                <span>Academic Tone & Style Audits ({result.grammar_spelling_issues.length})</span>
              </h3>
              <div className="space-y-2">
                {result.grammar_spelling_issues.map((item, idx) => (
                  <div key={idx} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                    <div>
                      <span className="font-bold text-indigo-900">{item.issue}</span>
                      <p className="text-indigo-800 mt-0.5">{item.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <strong className="font-bold text-slate-900 block mb-1">Supervisor Submission Guidance:</strong>
            <p className="leading-relaxed">{result.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalCheckerPage;
