/**
 * ROSS-SEARCH: Module 3 — AI Practice Viva & Defense Preparation Simulator
 * Assigned to: [Robayet Islam – ID: 809]
 * 
 * Capabilities:
 * - Generates targeted, defense-grade practice viva questions based on student project details and documents
 * - Questions categorized into objectives, methodology, dataset, findings, limitations, and novelty
 * - Provides ideal model answers, defense tips, and practice evaluation rubrics
 * - Tracks student viva preparation history
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Send, 
  History, 
  Target, 
  Cpu, 
  Database, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Award
} from 'lucide-react';
import { module3Service } from '../../services/module3Service';

const DOMAIN_OPTIONS = [
  "Natural Language Processing",
  "Computer Vision",
  "Cyber Security",
  "Machine Learning",
  "Data Science",
  "Healthcare AI",
  "Internet of Things",
  "Cloud Computing",
  "Bioinformatics",
  "Blockchain",
  "Software Engineering"
];

const CATEGORY_ICONS = {
  objectives: Target,
  methodology: Cpu,
  dataset: Database,
  results: TrendingUp,
  limitations: AlertTriangle,
  novelty: Award
};

export const VivaPracticePage = () => {
  const token = localStorage.getItem('ross_token') || localStorage.getItem('token') || sessionStorage.getItem('token');

  const [projectTitle, setProjectTitle] = useState('Bengali Sentiment Analysis Using Transformer Models');
  const [domain, setDomain] = useState('Natural Language Processing');
  const [abstract, setAbstract] = useState('Developing an optimized deep neural Transformer pipeline for low-resource Bengali text classification with comparative ablation on benchmark datasets.');
  
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  // Expanded accordion state for questions
  const [expandedQuestions, setExpandedQuestions] = useState({});
  // Practice answers written by the student
  const [practiceAnswers, setPracticeAnswers] = useState({});

  useEffect(() => {
    if (token) {
      module3Service.getVivaHistory(token).then(data => {
        setHistory(data);
        if (data && data.length > 0) {
          setCurrentSession(data[0]);
        }
      });
    }
  }, [token]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in to generate AI practice viva questions.');
      return;
    }
    if (!projectTitle.trim()) {
      setError('Please enter your project title.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const session = await module3Service.generateVivaQuestions({
        projectTitle: projectTitle.trim(),
        domain,
        abstract: abstract.trim(),
        questionsCount: 6
      }, token);

      setCurrentSession(session);
      // Auto expand first 2 questions
      setExpandedQuestions({ 1: true, 2: true });
      // Refresh history
      const updatedHistory = await module3Service.getVivaHistory(token);
      setHistory(updatedHistory);
    } catch (err) {
      setError(err.message || 'Failed to generate viva questions.');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (qId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleAnswerChange = (qId, val) => {
    setPracticeAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-semibold border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Academic Defense Preparation</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            AI-Assisted Practice Viva & Defense Simulator
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
            Generate defense-grade examination questions tailored to your project scope. Master challenging panel questions on methodology, datasets, failure conditions, and practical novelty before your final FYP defense.
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-700" />
            <span>Generate Targeted Defense Questions</span>
          </h2>
          <p className="text-[11px] text-slate-500">Provide your thesis title and research abstract to synthesize panel questions</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Thesis / Project Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Real-Time Deep Learning for Cyber-Physical Anomaly Detection"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-purple-700"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Research Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-purple-700"
              >
                {DOMAIN_OPTIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Project Abstract & Methodology Highlights</label>
            <textarea
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Outline your research objectives, dataset, and models to generate high-precision questions..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-700 font-mono"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Viva Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Generate Defense Questions (6 Categories)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── DEFENSE QUESTIONS DISPLAY ── */}
      {currentSession && currentSession.questions_data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                Practice Session: {currentSession.domain}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {currentSession.project_title}
              </h3>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-xl">
              {currentSession.questions_data.length} Categorized Questions
            </span>
          </div>

          <div className="space-y-3">
            {currentSession.questions_data.map((q) => {
              const isExpanded = !!expandedQuestions[q.id];
              const Icon = CATEGORY_ICONS[q.category] || HelpCircle;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Question Header Card */}
                  <div
                    onClick={() => toggleQuestion(q.id)}
                    className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        {q.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {q.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            q.difficulty === 'Challenging'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h4>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Expandable Model Answer & Tips */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs animate-fadeIn">
                      
                      {/* Model Answer Points */}
                      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-700" />
                          <span>What Panel Examiners Expect (Model Talking Points):</span>
                        </span>
                        <ul className="space-y-1 text-emerald-950 list-disc list-inside leading-relaxed pl-1">
                          {q.model_answer_points.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Defense Tips */}
                      <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-1">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Lightbulb size={14} className="text-amber-700" />
                          <span>Panel Strategy Tip:</span>
                        </span>
                        <p className="text-slate-800 leading-relaxed pl-5 font-medium">
                          {q.defense_tips}
                        </p>
                      </div>

                      {/* Interactive Student Practice Answer Box */}
                      <div className="space-y-1.5">
                        <label className="block font-bold text-slate-700">
                          Your Practice Response (Type your defense response to test your readiness):
                        </label>
                        <textarea
                          rows={3}
                          value={practiceAnswers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder="Draft your bullet points here..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-700 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History of Previous Practice Sessions */}
      {history.length > 1 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <History size={14} className="text-slate-400" />
            <span>Recent Viva Practice History</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {history.slice(1, 4).map((h) => (
              <div
                key={h.id}
                onClick={() => setCurrentSession(h)}
                className="p-3 rounded-2xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 cursor-pointer transition-all space-y-1"
              >
                <span className="text-[10px] font-bold text-purple-700">{h.domain}</span>
                <h5 className="font-bold text-slate-800 line-clamp-1">{h.project_title}</h5>
                <span className="text-[10px] text-slate-400 block">
                  {new Date(h.created_at).toLocaleDateString()} • {h.questions_count} Questions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VivaPracticePage;
