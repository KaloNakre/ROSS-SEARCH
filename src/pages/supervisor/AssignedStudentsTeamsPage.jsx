import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  User, 
  FolderKanban, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Briefcase, 
  Eye, 
  ArrowLeft,
  X,
  FileText,
  Filter,
  Plus
} from 'lucide-react';
import module1Service from '../../services/module1Service';

export const AssignedStudentsTeamsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'individual' | 'team'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'Active' | 'Completed'
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [unassignTarget, setUnassignTarget] = useState(null);
  const [unassignReason, setUnassignReason] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    setAssignments(module1Service.getAssignments());
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const filteredAssignments = assignments.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const handleConfirmUnassign = () => {
    if (!unassignTarget) return;
    module1Service.unassignTarget(unassignTarget.id, unassignReason);
    refreshList();
    showFeedback('success', `"${unassignTarget.targetName}" has been successfully unassigned and released.`);
    setUnassignTarget(null);
    setUnassignReason('');
  };

  const handleUpdateStatus = (id, newStatus) => {
    module1Service.updateAssignmentStatus(id, newStatus);
    refreshList();
    showFeedback('success', `Assignment status updated to ${newStatus}.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/supervisor/dashboard" className="hover:text-diu-blue">Supervisor Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Active Assignments</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="text-diu-blue stroke-[2.2]" size={26} />
            Assigned Students & Teams Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unified management of under-supervision individual thesis students and FYP project teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/supervisor/assign-student"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <User size={14} /> Assign Student
          </Link>
          <Link
            to="/supervisor/assign-team"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-diu-blue text-diu-blue hover:bg-blue-50 text-xs font-bold rounded-xl transition-colors"
          >
            <FolderKanban size={14} /> Assign Team
          </Link>
        </div>
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

      {/* Filter Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter size={15} className="text-diu-blue" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'all' ? 'bg-white text-diu-blue shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types ({assignments.length})
            </button>
            <button
              onClick={() => setFilterType('individual')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'individual' ? 'bg-white text-diu-blue shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Individuals ({assignments.filter(a => a.type === 'individual').length})
            </button>
            <button
              onClick={() => setFilterType('team')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'team' ? 'bg-white text-diu-blue shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teams ({assignments.filter(a => a.type === 'team').length})
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Completed">Completed Only</option>
          </select>
        </div>
      </div>

      {/* Assignments Cards */}
      <div className="space-y-4">
        {filteredAssignments.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  item.type === 'individual' 
                    ? 'bg-blue-50 text-diu-blue border-blue-200' 
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {item.type === 'individual' ? <User size={11} /> : <FolderKanban size={11} />}
                  {item.type === 'individual' ? 'INDIVIDUAL STUDENT' : 'FYP TEAM'}
                </span>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                  item.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {item.status}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  Assigned: {item.assignedDate}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {item.targetName}
                </h3>
                <p className="text-xs text-slate-500">
                  {item.department} {item.targetId && `• Target ID: ${item.targetId}`}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 max-w-2xl text-xs space-y-1">
                <p className="text-diu-blue font-semibold">
                  Thesis Opportunity: {item.opportunityTitle}
                </p>
                {item.notes && (
                  <p className="text-slate-600 italic text-[11px]">
                    Directives: {item.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
              <button
                onClick={() => setSelectedAssignment(item)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Eye size={13} /> View Record
              </button>

              {item.status === 'Active' ? (
                <button
                  onClick={() => handleUpdateStatus(item.id, 'Completed')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  Mark Completed
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(item.id, 'Active')}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-diu-blue border border-blue-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  Re-open Active
                </button>
              )}

              <button
                onClick={() => setUnassignTarget(item)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                title="Unassign and Release"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Users className="mx-auto text-slate-300 mb-3" size={36} />
            <h3 className="text-sm font-bold text-slate-700">No Assignments Matching Selected Filters</h3>
            <p className="text-xs text-slate-400 mt-1">
              Assign students or teams to research opportunities using the buttons above.
            </p>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                  {selectedAssignment.type === 'individual' ? 'Student Supervision Dossier' : 'Team Project Dossier'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedAssignment.targetName}</h3>
                <p className="text-xs text-slate-400 font-mono">ID: {selectedAssignment.targetId}</p>
              </div>
              <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Assigned Research Opportunity:</span>
                <p className="text-diu-blue font-semibold">{selectedAssignment.opportunityTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[11px]">Formal Supervisor:</span>
                  <p className="text-slate-600">{selectedAssignment.supervisorName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[11px]">Assignment Date:</span>
                  <p className="text-slate-600">{selectedAssignment.assignedDate}</p>
                </div>
              </div>

              {selectedAssignment.notes && (
                <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200/60 text-slate-700">
                  <span className="font-bold block text-diu-blue mb-1">Supervision Directives:</span>
                  <p className="leading-relaxed text-[11px]">{selectedAssignment.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNASSIGN CONFIRMATION MODAL */}
      {unassignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
              <Trash2 size={18} />
              Confirm Removal & Unassignment
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to unassign <strong>{unassignTarget.targetName}</strong> from <strong>"{unassignTarget.opportunityTitle}"</strong>? This will release their allocated thesis slot.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Unassignment (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Mutual release / Topic change / Project completed"
                value={unassignReason}
                onChange={(e) => setUnassignReason(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setUnassignTarget(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnassign}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Unassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedStudentsTeamsPage;
