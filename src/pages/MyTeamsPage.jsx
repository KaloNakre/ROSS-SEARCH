import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, ChevronRight, Loader2, Trash2, UserPlus, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MyTeamsPage = () => {
  const { apiCall, currentUserRole, currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchMyTeamsAndRequests = async () => {
    setLoading(true);
    try {
      const [teamsData, requestsData] = await Promise.allSettled([
        apiCall('/api/teams/my-teams'),
        apiCall('/api/teams/my/join-requests')
      ]);

      if (teamsData.status === 'fulfilled' && Array.isArray(teamsData.value)) {
        setTeams(teamsData.value);
      } else {
        setTeams([]);
      }

      if (requestsData.status === 'fulfilled' && Array.isArray(requestsData.value)) {
        setSentRequests(requestsData.value);
      } else {
        setSentRequests([]);
      }
    } catch (err) {
      console.error('Failed to load my teams and requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeamsAndRequests();
  }, []);

  const handleDeleteTeam = async (teamId, teamName) => {
    if (confirm(`Are you sure you want to disband and delete "${teamName}"? This action cannot be undone.`)) {
      try {
        await apiCall(`/api/teams/${teamId}`, { method: 'DELETE' });
        setFeedback({ type: 'success', text: `Team "${teamName}" disbanded and deleted successfully.` });
        await fetchMyTeamsAndRequests();
        setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
      } catch (err) {
        alert(err.message || 'Failed to delete team.');
      }
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (confirm('Cancel your pending join request for this team?')) {
      setCancellingId(requestId);
      try {
        await apiCall(`/api/teams/join-requests/${requestId}`, { method: 'DELETE' });
        setFeedback({ type: 'success', text: 'Join request cancelled successfully.' });
        setSentRequests(prev => prev.filter(r => r.id !== requestId));
        setTimeout(() => setFeedback({ type: '', text: '' }), 3500);
      } catch (err) {
        alert(err.message || 'Failed to cancel request');
      } finally {
        setCancellingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading your research teams...</p>
      </div>
    );
  }

  const pendingRequests = sentRequests.filter(r => r.status?.toLowerCase() === 'pending');

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Feedback Alert */}
      {feedback.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-2 text-xs font-semibold ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Teams
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your FYP/Thesis research teams, collaborative memberships & join requests
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/teams/search"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus size={15} className="text-diu-blue" />
            <span>Add to the Team</span>
          </Link>

          <Link
            to="/teams/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={16} /> Create New Team
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      {teams.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs text-center max-w-2xl mx-auto my-6 space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-diu-blue shadow-inner">
            <Users size={38} className="stroke-[1.6]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              No Teams Found!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              You are currently not enrolled in any FYP/Thesis research group. You can either register your own new team or join an existing team that has open slots.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/teams/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Plus size={16} /> Create New Team
            </Link>

            <Link
              to="/teams/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-all hover:scale-105 border border-slate-200"
            >
              <UserPlus size={16} className="text-diu-blue" />
              <span>Add to the Team</span>
            </Link>
          </div>
        </div>
      ) : (
        /* List of Teams */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-diu-blue border border-blue-100 uppercase tracking-wider">
                      Section {team.section} • {team.domain}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">
                      {team.name || team.team_name}
                    </h2>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {team.members_count || team.member_count || 1}/{team.max_members || 5} Members
                  </span>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Project / Thesis Title
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2">
                    {team.project_title || 'Title to be finalised'}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Leader:</span>
                    <span className="font-semibold text-slate-800">{team.leader_name || 'Leader'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Supervisor:</span>
                    <span className="font-semibold text-slate-800">{team.supervisor_name || "Pending Selection"}</span>
                  </div>
                </div>
              </div>

              {/* View Details Link */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  to={`/teams/${team.id}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-diu-blue text-diu-blue hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Manage Team Details</span>
                  <ChevronRight size={15} />
                </Link>
                <button
                  onClick={() => handleDeleteTeam(team.id, team.name || team.team_name)}
                  className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                  title="Disband Team"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pending Join Requests Section (Outgoing) ─────────────────────────── */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">
                Your Pending Team Join Requests ({pendingRequests.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Awaiting Team Leader Approval</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{req.team_name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 italic">"{req.message}"</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Submitted on: {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                  <Link to={`/teams/${req.team_id}`} className="text-xs font-semibold text-diu-blue hover:underline">
                    View Team Overview →
                  </Link>
                  <button
                    onClick={() => handleCancelRequest(req.id)}
                    disabled={cancellingId === req.id}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    {cancellingId === req.id ? 'Cancelling...' : 'Cancel Request'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeamsPage;
