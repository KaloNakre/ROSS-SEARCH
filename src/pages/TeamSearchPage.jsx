import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Users, ChevronRight, Loader2, Plus, UserPlus, CheckCircle2, Clock, X, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RESEARCH_DOMAINS } from '../data/mockData';

export const TeamSearchPage = () => {
  const [searchParams] = useSearchParams();
  const { apiCall, currentUser, currentUserRole } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [onlyOpenSlots, setOnlyOpenSlots] = useState(searchParams.get('filter') === 'open_slots');
  const [myTeams, setMyTeams] = useState([]);
  const [mySentRequests, setMySentRequests] = useState([]);
  
  // Join Request Modal State
  const [targetTeam, setTargetTeam] = useState(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchAllData = async () => {
    try {
      const [teamsRes, myTeamsRes, reqsRes] = await Promise.allSettled([
        apiCall('/api/teams/?limit=100'),
        apiCall('/api/teams/my-teams'),
        apiCall('/api/teams/my/join-requests')
      ]);

      if (teamsRes.status === 'fulfilled' && Array.isArray(teamsRes.value)) {
        setTeams(teamsRes.value);
      }
      if (myTeamsRes.status === 'fulfilled' && Array.isArray(myTeamsRes.value)) {
        setMyTeams(myTeamsRes.value);
      }
      if (reqsRes.status === 'fulfilled' && Array.isArray(reqsRes.value)) {
        setMySentRequests(reqsRes.value);
      }
    } catch (err) {
      console.error('Failed to load teams data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const activeTeam = myTeams[0] || null;
  const isAlreadyInTeam = myTeams.length > 0;

  const handleOpenJoinModal = (team) => {
    setTargetTeam(team);
    setJoinMessage('Hello! I would like to join your research team to collaborate on this thesis project.');
  };

  const handleSendJoinRequest = async (e) => {
    e.preventDefault();
    if (!targetTeam) return;
    setSubmittingReq(true);
    try {
      await apiCall(`/api/teams/${targetTeam.id}/join-requests`, {
        method: 'POST',
        body: JSON.stringify({ message: joinMessage })
      });
      setFeedback({ 
        type: 'success', 
        text: `Join request sent to "${targetTeam.name || targetTeam.team_name}"! Team Leader has been notified.` 
      });
      setTargetTeam(null);
      await fetchAllData();
      setTimeout(() => setFeedback({ type: '', text: '' }), 4500);
    } catch (err) {
      alert(err.message || 'Failed to submit join request');
    } finally {
      setSubmittingReq(false);
    }
  };

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const name = t.name || t.team_name || '';
      const title = t.project_title || '';
      const domain = t.domain || '';
      const members = t.members_count ?? t.member_count ?? 1;
      const max = t.max_members || 5;

      const matchSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDomain = selectedDomain === 'All' || domain.toLowerCase().includes(selectedDomain.toLowerCase());
      const matchSlots = onlyOpenSlots ? members < max : true;

      return matchSearch && matchDomain && matchSlots;
    });
  }, [teams, searchTerm, selectedDomain, onlyOpenSlots]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Feedback Banner */}
      {feedback.text && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team Directory & Join Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse registered FYP/Thesis teams, inspect open member slots, and request to join
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/teams/my-teams"
            className="text-xs text-diu-blue font-bold hover:underline"
          >
            My Teams ({myTeams.length})
          </Link>

          <Link
            to="/teams/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus size={15} /> Create Team
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Search & Results */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search Bar & Filters */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search by team name or project title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>

              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-diu-blue"
              >
                <option value="All">All Domains</option>
                {RESEARCH_DOMAINS.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={onlyOpenSlots}
                  onChange={(e) => setOnlyOpenSlots(e.target.checked)}
                  className="rounded text-diu-blue focus:ring-diu-blue w-4 h-4 border-slate-300"
                />
                <span>Show only teams with open member slots ({`< 5`})</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">
                {filteredTeams.length} teams available
              </span>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Registered Teams ({filteredTeams.length})
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Loading teams directory...</p>
              </div>
            ) : filteredTeams.length > 0 ? (
              <div className="space-y-4">
                {filteredTeams.map((team) => {
                  const teamName = team.name || team.team_name || 'Research Team';
                  const membersCount = team.members_count ?? team.member_count ?? 1;
                  const maxCount = team.max_members || 5;
                  const openSlots = maxCount - membersCount;
                  const isFull = openSlots <= 0;
                  const isMyOwnTeam = myTeams.some(mt => mt.id === team.id);
                  const pendingReq = mySentRequests.find(r => r.team_id === team.id && r.status?.toLowerCase() === 'pending');

                  return (
                    <div
                      key={team.id}
                      className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-200 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-diu-blue flex items-center justify-center shrink-0 mt-0.5">
                            <Users size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900">
                                {teamName}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-diu-blue border border-blue-100">
                                Section {team.section}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                {team.domain}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium mt-1">
                              {team.project_title || 'Proposed Thesis Project'}
                            </p>
                          </div>
                        </div>

                        {/* Slots Badge */}
                        <div className="text-right shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isFull 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {membersCount}/{maxCount} Members {openSlots > 0 ? `(${openSlots} open)` : '(Full)'}
                          </span>
                        </div>
                      </div>

                      {/* Leader & Supervisor Info */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-white/70 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Team Leader</span>
                          <span className="font-semibold text-slate-800">{team.leader_name || 'Student Leader'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Supervisor</span>
                          <span className="font-semibold text-slate-800">{team.supervisor_name || 'Pending'}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                          <span className="font-semibold text-slate-800 truncate block">{team.department}</span>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <Link
                          to={`/teams/${team.id}`}
                          className="text-xs font-semibold text-diu-blue hover:underline inline-flex items-center gap-1"
                        >
                          <span>View Full Profile</span>
                          <ChevronRight size={14} />
                        </Link>

                        <div>
                          {isMyOwnTeam ? (
                            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-100 text-diu-blue">
                              Your Team
                            </span>
                          ) : pendingReq ? (
                            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                              <Clock size={12} /> Request Pending
                            </span>
                          ) : isAlreadyInTeam ? (
                            <span className="text-xs text-slate-400 font-medium">
                              Already in a Team
                            </span>
                          ) : isFull ? (
                            <span className="text-xs text-rose-500 font-medium">
                              Team is Full
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenJoinModal(team)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
                            >
                              <UserPlus size={14} />
                              <span>Add to the Team</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-500 space-y-2">
                <Users size={32} className="mx-auto text-slate-300" />
                <p>No registered research teams match your filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Team Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs text-center space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-slate-900">
              My FYP Team Status
            </h2>

            <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 text-diu-blue flex items-center justify-center mx-auto shadow-inner">
              <Users size={36} />
            </div>

            <div>
              <p className="text-xl font-black text-slate-900">
                {activeTeam ? (activeTeam.name || activeTeam.team_name) : 'No Active Team'}
              </p>
              <p className="text-xs font-bold text-diu-blue mt-1">
                {activeTeam 
                  ? `${activeTeam.members_count || activeTeam.member_count || 1}/${activeTeam.max_members || 5} Members` 
                  : 'Looking for a Team'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTeam ? `Section ${activeTeam.section} • ${activeTeam.domain}` : 'Join an open team or create one'}
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                to="/teams/create"
                className="w-full py-3 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all block"
              >
                Create New Team
              </Link>
            </div>

            {activeTeam && (
              <div className="pt-1">
                <Link
                  to={`/teams/${activeTeam.id}`}
                  className="text-xs text-diu-blue font-semibold hover:underline block"
                >
                  Manage Active Team &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Join Request Modal ──────────────────────────────────────────────── */}
      {targetTeam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-diu-blue flex items-center justify-center">
                  <UserPlus size={16} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Request to Join Team
                </h3>
              </div>
              <button
                onClick={() => setTargetTeam(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
              <p className="font-bold text-slate-900 text-sm">
                {targetTeam.name || targetTeam.team_name}
              </p>
              <p className="text-slate-600">{targetTeam.project_title}</p>
              <p className="text-slate-400 text-[11px]">
                Leader: <strong>{targetTeam.leader_name}</strong> • Section: <strong>{targetTeam.section}</strong>
              </p>
            </div>

            <form onSubmit={handleSendJoinRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Introductory Message to Team Leader
                </label>
                <textarea
                  rows={3}
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Introduce yourself, your academic interests, and how you can contribute..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTargetTeam(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReq}
                  className="px-5 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {submittingReq ? 'Sending Request...' : 'Send Join Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSearchPage;
