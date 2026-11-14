import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Eye, 
  FileText, 
  AlertCircle, 
  Search,
  MessageSquare,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import module1Service from '../../services/module1Service';

export const SupervisorRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'accepted' | 'rejected' | 'all'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseModal, setResponseModal] = useState({ open: false, type: '', reqId: null });
  const [responseNote, setResponseNote] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    refreshRequests();
  }, []);

  const refreshRequests = () => {
    setRequests(module1Service.getRequests());
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  const handleOpenResponse = (reqId, type) => {
    setResponseModal({ open: true, type, reqId });
    setResponseNote(
      type === 'accepted' 
        ? 'Accepted. Please schedule an initial discussion during office hours.'
        : 'Thank you for your application. Unfortunately, research slots for this cycle are at capacity.'
    );
  };

  const handleConfirmResponse = () => {
    if (!responseModal.reqId) return;
    module1Service.respondToRequest(responseModal.reqId, responseModal.type, responseNote);
    refreshRequests();
    showFeedback(
      'success', 
      responseModal.type === 'accepted' 
        ? 'Student supervision request approved. Proceed to Final Assignment when ready.' 
        : 'Supervision request declined.'
    );
    setResponseModal({ open: false, type: '', reqId: null });
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/supervisor/dashboard" className="hover:text-diu-blue">Supervisor Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Student Requests</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Inbox className="text-diu-blue stroke-[2.2]" size={26} />
            Student Request Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming undergraduate thesis applications, evaluate candidate profiles, and issue preliminary acceptance.
          </p>
        </div>

        <Link
          to="/supervisor/assignments"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:border-diu-blue text-slate-700 hover:text-diu-blue text-xs font-bold rounded-xl transition-colors"
        >
          View Final Assignments <ArrowRight size={14} />
        </Link>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'pending', label: 'Pending Requests', count: requests.filter(r => r.status === 'pending').length },
          { id: 'accepted', label: 'Approved Requests', count: requests.filter(r => r.status === 'accepted').length },
          { id: 'rejected', label: 'Declined Requests', count: requests.filter(r => r.status === 'rejected').length },
          { id: 'all', label: 'All Requests', count: requests.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-diu-blue text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  req.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : req.status === 'accepted'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {req.status === 'pending' && <Clock size={11} />}
                  {req.status === 'accepted' && <CheckCircle2 size={11} />}
                  {req.status === 'rejected' && <XCircle size={11} />}
                  {req.status.toUpperCase()}
                </span>

                <span className="text-xs font-bold text-slate-800">
                  {req.studentName}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  ID: {req.studentId}
                </span>

                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  CGPA: {req.cgpa || '3.75'}
                </span>
              </div>

              <div className="text-xs font-semibold text-diu-blue">
                Applied for: {req.opportunityTitle}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 max-w-2xl">
                "{req.message}"
              </p>

              {/* Research Interests Tags */}
              {req.researchInterests && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Student Interests:</span>
                  {req.researchInterests.map((interest, i) => (
                    <span key={i} className="text-[10px] font-medium bg-blue-50 text-diu-blue px-2 py-0.5 rounded-md">
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
              <button
                onClick={() => setSelectedRequest(req)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Eye size={14} /> Full Details
              </button>

              {req.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleOpenResponse(req.id, 'accepted')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <CheckCircle2 size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleOpenResponse(req.id, 'rejected')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}

              {req.status === 'accepted' && (
                <Link
                  to="/supervisor/assign-student"
                  className="px-3.5 py-1.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  Assign to Topic <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Inbox className="mx-auto text-slate-300 mb-3" size={36} />
            <h3 className="text-sm font-bold text-slate-700">No {activeTab} requests found</h3>
            <p className="text-xs text-slate-400 mt-1">
              New student supervision requests submitted through the portal will appear here.
            </p>
          </div>
        )}
      </div>

      {/* FULL DETAILS MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-diu-blue">{selectedRequest.department}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedRequest.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Student ID: {selectedRequest.studentId} • CGPA: {selectedRequest.cgpa}
                </p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Submitted Supervision Statement:</span>
              <p className="text-slate-600 leading-relaxed italic">
                "{selectedRequest.message}"
              </p>
            </div>

            <div className="text-xs space-y-1">
              <p><strong className="text-slate-700">Target Research Opportunity:</strong> {selectedRequest.opportunityTitle}</p>
              <p><strong className="text-slate-700">Contact Email:</strong> {selectedRequest.studentEmail}</p>
              <p><strong className="text-slate-700">Application Date:</strong> {selectedRequest.submittedAt}</p>
              {selectedRequest.responseNote && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 mt-2">
                  <span className="font-bold">Supervisor Note:</span> {selectedRequest.responseNote}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleOpenResponse(selectedRequest.id, 'accepted')}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleOpenResponse(selectedRequest.id, 'rejected')}
                    className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESPONSE CONFIRMATION MODAL */}
      {responseModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={18} className={responseModal.type === 'accepted' ? 'text-emerald-600' : 'text-rose-600'} />
              {responseModal.type === 'accepted' ? 'Approve Supervision Request' : 'Decline Supervision Request'}
            </h3>

            <p className="text-xs text-slate-500">
              Add a response or instruction note to be delivered to the student:
            </p>

            <textarea
              rows={3}
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResponseModal({ open: false, type: '', reqId: null })}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResponse}
                className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-xs ${
                  responseModal.type === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {responseModal.type === 'accepted' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorRequestsPage;
