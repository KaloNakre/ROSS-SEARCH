/**
 * ROSS-SEARCH: Module 3 — Student Project Submissions & Milestone Tracking
 * Assigned to: [Riya Saha – ID: 715]
 * 
 * Capabilities:
 * - Upload project files (proposals, reports, thesis drafts)
 * - Automatic version incrementing (v1, v2, v3...)
 * - Complete submission history and status tracking
 * - Supervisor feedback and revision remarks viewer
 * - Milestone deadlines and completion progress tracker
 */

import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Layers, 
  Calendar, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Send,
  Download
} from 'lucide-react';
import { module3Service } from '../../services/module3Service';
import { useAuth } from '../../context/AuthContext';

const PHASES = [
  { id: 'proposal', label: 'Phase 1: Topic Proposal' },
  { id: 'lit_review', label: 'Phase 2: Literature Review' },
  { id: 'methodology', label: 'Phase 3: Methodology' },
  { id: 'prototype', label: 'Phase 4: Implementation' },
  { id: 'final_thesis', label: 'Phase 5: Final Thesis Draft' },
];

export const StudentSubmissionsPage = () => {
  const { currentUser } = useAuth();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const [submissions, setSubmissions] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Form State
  const [subTitle, setSubTitle] = useState('');
  const [subPhase, setSubPhase] = useState('proposal');
  const [subFileName, setSubFileName] = useState('');
  const [subDocText, setSubDocText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [subsData, milesData] = await Promise.all([
        module3Service.getSubmissions({}, token),
        module3Service.getMilestones(null, token)
      ]);
      setSubmissions(subsData);
      setMilestones(milesData);
    } catch (err) {
      console.error('Failed to load submissions and milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subTitle.trim() || !subFileName.trim()) {
      setUploadError('Please provide a submission title and file attachment name.');
      return;
    }
    setSubmitting(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      await module3Service.submitProjectFile({
        title: subTitle.trim(),
        phase: subPhase,
        file_name: subFileName.trim(),
        document_text: subDocText.trim() || 'Project file attached for supervisor review.'
      }, token);

      setUploadSuccess(true);
      setSubTitle('');
      setSubFileName('');
      setSubDocText('');
      fetchData();
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      setUploadError(err.message || 'Failed to submit project file.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-diu-darkBlue via-indigo-900 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-semibold border border-cyan-400/30">
            <Layers className="w-3.5 h-3.5 text-cyan-300" />
            <span>Module 3: Project Progress & Supervisor Revisions</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Project Submissions & Milestone Progress Tracker
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Upload project drafts and proposal slide decks, track supervisor review feedback, manage revision versions, and monitor your 5-phase FYP completion milestones.
          </p>
        </div>
      </div>

      {/* Grid: Upload on Left (5 Cols), Milestones & History on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload Form: 5 Cols */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-diu-blue" />
              <span>Submit Project File for Review</span>
            </h2>
            <p className="text-[11px] text-slate-500">Auto-increments version number for revised drafts</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Submission Title</label>
              <input
                type="text"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="e.g. Phase 1: Topic Proposal Presentation"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-diu-blue"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Project Phase</label>
              <select
                value={subPhase}
                onChange={(e) => setSubPhase(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-diu-blue"
              >
                {PHASES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">File Attachment Name</label>
              <input
                type="text"
                value={subFileName}
                onChange={(e) => setSubFileName(e.target.value)}
                placeholder="e.g. Team_NLP_Proposal_Draft_v1.pptx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-diu-blue"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Executive Notes & Content Excerpt</label>
              <textarea
                rows={4}
                value={subDocText}
                onChange={(e) => setSubDocText(e.target.value)}
                placeholder="Highlight key points, changes made since last version, or questions for your supervisor..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-diu-blue font-mono"
              />
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>File submitted successfully! Waiting for supervisor evaluation.</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-diu-blue hover:bg-diu-dark text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting File...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit File to Supervisor</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Milestones & History: 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* FYP Milestones Progress Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>FYP Phase Milestones & Deadlines</span>
                </h3>
                <p className="text-[11px] text-slate-500">Target defense and review deadlines</p>
              </div>
              <span className="text-[11px] font-bold text-diu-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                5 Standard Phases
              </span>
            </div>

            {milestones.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">
                Milestones will appear once your team is formed.
              </p>
            ) : (
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{m.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Deadline: {new Date(m.deadline).toLocaleDateString()}</span>
                      <span className="font-bold text-slate-700">{m.progress_percentage}% completed</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          m.status === 'completed' ? 'bg-emerald-500' : 'bg-diu-blue'
                        }`}
                        style={{ width: `${m.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission History & Supervisor Feedback */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Submission Version History & Supervisor Feedback</span>
              </h3>
              <p className="text-[11px] text-slate-500">Track iterations, reviews, and requested revisions</p>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                No submissions recorded yet. Use the upload form on the left to submit your first draft.
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                            {sub.phase} • v{sub.version}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sub.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'revision_required'
                              ? 'bg-amber-100 text-amber-800'
                              : sub.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {sub.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{sub.title}</h4>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          File: {sub.file_name} • Submitted {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Supervisor Feedback Box */}
                    {sub.feedback_remarks ? (
                      <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <MessageSquare size={13} className="text-amber-700" />
                          <span>Feedback from {sub.reviewer_name || 'Faculty Supervisor'}:</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed pl-4 font-medium">
                          {sub.feedback_remarks}
                        </p>
                        {sub.reviewed_at && (
                          <span className="text-[10px] text-amber-700 block pl-4">
                            Reviewed on {new Date(sub.reviewed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">
                        Waiting for faculty supervisor review and remarks...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentSubmissionsPage;
