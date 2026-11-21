/**
 * ROSS-SEARCH: Module 2 — Topic Similarity & Duplicate FYP Detector
 * Contributor: Tamim Hasan Sami (ID: 232-35-313)
 * Description: Compares a proposed project topic and abstract against the department's
 * past FYP/Thesis archive and current batch student registrations to reject duplicate topics,
 * calculate similarity scores, and allow registering verified novel topics.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Loader2, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  FileText,
  HelpCircle,
  TrendingUp,
  XCircle,
  BookmarkCheck,
  Check
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';
import { useAuth } from '../../context/AuthContext';

const DOMAIN_OPTIONS = [
  "Cyber Security",
  "Natural Language Processing",
  "Computer Vision",
  "Machine Learning",
  "Blockchain",
  "Internet of Things",
  "Healthcare AI"
];

export const TopicSimilarityPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Cyber Security');
  const [abstract, setAbstract] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [registering, setRegistering] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  useEffect(() => {
    const urlTopic = searchParams.get('topic');
    if (urlTopic) {
      setTitle(urlTopic);
    }
  }, [searchParams]);

  const handleSampleDuplicate = () => {
    setTitle('Cyber-Physical SCADA Network Threat Detection Using Deep Autoencoders and Random Forest');
    setDomain('Cyber Security');
    setAbstract('Deep learning autoencoders and random forest classifiers on SCADA network packets.');
    setResult(null);
  };

  const handleSampleOriginal = () => {
    setTitle('Quantum-Resistant Lattice Key Distribution for Micro-Satellite Telemetry over Turbulent Optical Channels');
    setDomain('Cyber Security');
    setAbstract('Implementation of post-quantum Kyber lattice cryptography on low-bandwidth orbital sensor links.');
    setResult(null);
  };

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setResult(null);
    setRegisteredSuccess(false);

    if (!title.trim() || title.trim().length < 5) {
      setErrorMsg('Please enter a descriptive project title (at least 5 characters).');
      return;
    }

    setAnalyzing(true);
    try {
      const data = await module2Service.checkSimilarity({
        title,
        abstract,
        domain
      });
      setResult(data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to analyze topic similarity.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRegisterTopic = async () => {
    if (!result || !result.can_register) return;
    setRegistering(true);
    try {
      await module2Service.registerThesisTopic(title, token);
      setRegisteredSuccess(true);
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to register thesis topic.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Module 2: Duplicate FYP Topic & Similarity Engine</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            Topic Similarity & Duplicate FYP/Thesis Detection
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Ensure your proposed Final Year Project or Thesis topic is completely novel.
            Our NLP engine compares your topic against the DIU departmental archive and active cohort registrations to prevent duplicate submissions.
          </p>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Proposed Research / Thesis Title *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSampleDuplicate}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors"
              >
                Test High Overlap (Duplicate)
              </button>
              <button
                type="button"
                onClick={handleSampleOriginal}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
              >
                Test Original / Novel Topic
              </button>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="e.g. SCADA Network Threat Detection, BanglaBERT, Zero-Trust Architecture..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Research Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Brief Scope / Abstract (Optional but recommended)
              </label>
              <textarea
                rows={2}
                placeholder="Mention specific dataset, model architecture, or target problem..."
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={analyzing}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning Departmental Archive & Calculating Cosine Similarity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Check Topic Similarity & Novelty Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── SIMILARITY AUDIT RESULTS ── */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Verdict Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    !result.can_register
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : result.highest_similarity >= 45
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {!result.can_register ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                    <span>{result.risk_level.toUpperCase()}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    DIU Thesis Archive Comparison
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {result.verdict_summary}
                </h3>

                {result.duplicate_conflict_details && (
                  <p className="text-xs font-semibold text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {result.duplicate_conflict_details}
                  </p>
                )}
              </div>

              {/* Similarity Percentage & Action Button */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-right">
                    <div className="text-[11px] font-bold uppercase text-slate-500">
                      Highest Similarity
                    </div>
                    <div className={`text-3xl font-black ${
                      !result.can_register
                        ? 'text-red-600'
                        : result.highest_similarity >= 45
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                    }`}>
                      {result.highest_similarity}%
                    </div>
                  </div>
                </div>

                {/* ── REGISTER TOPIC BUTTON (ENABLED ONLY IF NOVEL / NOT DUPLICATE) ── */}
                {result.can_register ? (
                  <button
                    onClick={handleRegisterTopic}
                    disabled={registering || registeredSuccess}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                      registeredSuccess
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {registering ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : registeredSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Topic Registered to Profile!</span>
                      </>
                    ) : (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        <span>Choose & Register This Topic to My Profile</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    ❌ Topic Blocked: Cannot be chosen due to high duplicate overlap
                  </div>
                )}
              </div>
            </div>

            {/* Recommendation Box */}
            <div className={`mt-6 p-4 rounded-xl border text-xs leading-relaxed ${
              !result.can_register
                ? 'bg-red-50/70 border-red-200 text-red-900'
                : result.highest_similarity >= 45
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Defense & Proposal Guidance:</span>
              </div>
              <p className="mb-2">{result.recommendation}</p>

              {result.ai_novelty_suggestions && result.ai_novelty_suggestions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1">
                  <strong className="block font-semibold">How to Achieve Required Research Novelty:</strong>
                  {result.ai_novelty_suggestions.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span>•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Matches Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Matching Previous Theses & Active Cohort Topics ({result.top_matches.length})</span>
            </h4>

            <div className="space-y-4">
              {result.top_matches.map((match) => (
                <div
                  key={match.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-2.5 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h5 className="font-bold text-slate-900 text-sm">
                      {match.title}
                    </h5>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 self-start sm:self-auto ${
                      match.similarity_percentage >= 70
                        ? 'bg-red-100 text-red-700'
                        : match.similarity_percentage >= 40
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {match.similarity_percentage}% Match
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Batch: <strong className="text-slate-800">{match.batch}</strong></span>
                    <span>Year: <strong className="text-slate-800">{match.year}</strong></span>
                    <span>Supervisor: <strong className="text-slate-800">{match.supervisor_name}</strong></span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-100 leading-relaxed font-medium">
                    {match.overlap_analysis}
                  </p>

                  {match.matched_keywords && match.matched_keywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Overlapping Terms:
                      </span>
                      {match.matched_keywords.map((kw, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-[10px] font-semibold">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSimilarityPage;
