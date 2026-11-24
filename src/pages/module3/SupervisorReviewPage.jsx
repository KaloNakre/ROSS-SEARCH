/**
 * ROSS-SEARCH: Module 3 — Supervisor Submissions Review & Feedback Portal
 * Assigned to: [Riya Saha – ID: 715]
 * 
 * Capabilities:
 * - Supervisors review student project drafts, proposal slide decks, and reports
 * - Evaluate document contents and version iterations
 * - Provide structured feedback remarks and request revisions or grant approval
 */

import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  FileText, 
  MessageSquare, 
  Send, 
  Filter, 
  Search, 
  Loader2, 
  User, 
  Layers
} from 'lucide-react';
import { module3Service } from '../../services/module3Service';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Submissions' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'revision_required', label: 'Revisions Requested' },
  { id: 'approved', label: 'Approved' },
];

export const SupervisorReviewPage = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Review Modal State
  const [selectedSub, setSelectedSub] = useState(null);
  const [decisionStatus, setDecisionStatus] = useState('approved');
  const [feedbackRemarks, setFeedbackRemarks] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchSubmissions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await module3Service.getSubmissions({ status: selectedStatus }, token);
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load supervisor submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedStatus, token]);

  const handleOpenReviewModal = (sub) => {
    setSelectedSub(sub);
    setDecisionStatus(sub.status === 'pending' ? 'approved' : sub.status);
    setFeedbackRemarks(sub.feedback_remarks || '');
    setReviewError(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackRemarks.trim()) {
      setReviewError('Please provide evaluation feedback remarks for the student team.');
      return;
    }
    setSubmittingReview(true);
    setReviewError(null);

    try {
      await module3Service.reviewSubmission(selectedSub.id, {
        status: decisionStatus,
        feedback_remarks: feedbackRemarks.trim()
      }, token);

      setSelectedSub(null);
      fetchSubmissions();
    } catch (err) {
      setReviewError(err.message || 'Failed to submit supervisor review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-semibold border border-cyan-400/30">
            <ClipboardCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span>Faculty Supervision & Mentorship Workspace</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Student Submissions Review & Feedback Portal
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Review student project proposal presentations, literature review drafts, and thesis chapters. Provide structured feedback remarks, request revisions, and monitor progress toward defense readiness.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedStatus(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === f.id
                  ? 'bg-diu-blue text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-diu-blue animate-spin mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading assigned student submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Submissions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no student submissions matching the selected status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                    {sub.phase} • Version {sub.version}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    sub.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : sub.status === 'revision_required'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : sub.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {sub.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {sub.title}
                </h3>

                <div className="text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <div><strong>File:</strong> {sub.file_name} ({sub.file_size_kb} KB)</div>
                  <div><strong>Submitted:</strong> {new Date(sub.created_at).toLocaleString()}</div>
                </div>

                {/* Document text snippet */}
                {sub.document_text && (
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100 font-mono">
                    {sub.document_text}
                  </p>
                )}

                {/* Existing Review Feedback if already reviewed */}
                {sub.feedback_remarks && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-amber-900 block">Feedback Remarks:</span>
                    <p className="text-slate-800">{sub.feedback_remarks}</p>
                    {sub.reviewed_at && (
                      <span className="text-[10px] text-amber-700 block">
                        Reviewed on {new Date(sub.reviewed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenReviewModal(sub)}
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>{sub.feedback_remarks ? 'Update Review Feedback' : 'Review & Provide Feedback'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SUPERVISOR REVIEW MODAL ── */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-scaleUp">
            <button
              onClick={() => setSelectedSub(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X size={18} />
            </button>

            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700">
                {selectedSub.phase} • v{selectedSub.version}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">{selectedSub.title}</h2>
              <p className="text-xs text-slate-500 font-mono">Attachment: {selectedSub.file_name}</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Evaluation Decision</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionStatus('approved')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      decisionStatus === 'approved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecisionStatus('revision_required')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      decisionStatus === 'revision_required'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Request Revision
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecisionStatus('rejected')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      decisionStatus === 'rejected'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Supervisor Feedback & Required Action Items
                </label>
                <textarea
                  rows={5}
                  value={feedbackRemarks}
                  onChange={(e) => setFeedbackRemarks(e.target.value)}
                  placeholder="Provide concrete evaluation remarks, missing aspects to address, or approval authorization..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>

              {reviewError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  {reviewError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send size={14} />}
                  <span>Submit Evaluation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorReviewPage;
