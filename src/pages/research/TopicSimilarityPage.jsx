/**
 * ROSS-SEARCH: Module 2 — Topic Similarity & Duplicate FYP Detector
 * Contributor: Tamim Hasan Sami (ID: 232-35-313)
 * Description: Compares a proposed project topic and abstract against the department's
 * past FYP/Thesis archive to identify potential duplicate research, calculate similarity scores,
 * and provide actionable novelty recommendations.
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
  RotateCcw
} from 'lucide-react';
import { module2Service } from '../../services/module2Service';

const DOMAIN_OPTIONS = [
  "Natural Language Processing",
  "Cyber Security",
  "Computer Vision",
  "Machine Learning",
  "Blockchain",
  "Internet of Things",
  "Cloud Computing",
  "Healthcare AI"
];

export const TopicSimilarityPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Natural Language Processing');
  const [abstract, setAbstract] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Prepopulate if query parameter exists
  useEffect(() => {
    const urlTopic = searchParams.get('topic');
    if (urlTopic) {
      setTitle(urlTopic);
    }
  }, [searchParams]);

  const handleSampleDuplicate = () => {
    setTitle('Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM and BERT');
    setDomain('Natural Language Processing');
    setAbstract('Classifying sentiment in Bengali social media comments using Bidirectional LSTM and fine-tuned BERT models on user reviews.');
  };

  const handleSampleOriginal = () => {
    setTitle('Quantum-Resistant Lattice Cryptography for Zero-Trust Satellite Sensor Networks');
    setDomain('Cyber Security');
    setAbstract('Implementation of post-quantum NTRU encryption algorithms for micro-satellite low-bandwidth telemetry links under severe packet drop constraints.');
  };

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setResult(null);

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
            Topic Similarity & Departmental Duplicate Check
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Ensure your proposed Final Year Project or Thesis topic is novel and distinct.
            Our NLP engine compares your topic against the DIU departmental archive to prevent duplicate submissions.
          </p>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Proposed Research Title *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSampleDuplicate}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors"
              >
                Test High Overlap Topic
              </button>
              <button
                type="button"
                onClick={handleSampleOriginal}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
              >
                Test Novel / Original Topic
              </button>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="e.g. Deep Learning Approaches for Bengali Text Classification..."
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
                  <span>Scanning Departmental Archive & Calculating TF-IDF Cosine Similarity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Check Topic Similarity Against Past Projects</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── SIMILARITY AUDIT RESULTS ── */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Verdict Metric Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.highest_similarity >= 75
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : result.highest_similarity >= 45
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {result.risk_level.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    DIU Thesis Archive Comparison
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {result.verdict_summary}
                </h3>
              </div>

              {/* Similarity Percentage Gauge */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
                <div className="text-right">
                  <div className="text-[11px] font-bold uppercase text-slate-500">
                    Highest Similarity
                  </div>
                  <div className={`text-3xl font-black ${
                    result.highest_similarity >= 75
                      ? 'text-red-600'
                      : result.highest_similarity >= 45
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                  }`}>
                    {result.highest_similarity}%
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className={`mt-6 p-4 rounded-xl border text-xs leading-relaxed ${
              result.highest_similarity >= 75
                ? 'bg-red-50/70 border-red-200 text-red-900'
                : result.highest_similarity >= 45
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Examiner / Defense Recommendation:</span>
              </div>
              <p>{result.recommendation}</p>
            </div>
          </div>

          {/* Top Matches Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Top Matching Previous Departmental Projects ({result.top_matches.length})</span>
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
