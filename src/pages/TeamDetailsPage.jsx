import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  User, 
  Building, 
  GraduationCap, 
  CheckCircle2, 
  ArrowLeft,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TeamDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiCall, currentUser, currentUserRole } = useAuth();
  
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [candidateStudentId, setCandidateStudentId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const fetchTeam = async () => {
    try {
      const data = await apiCall(`/api/teams/${id}`);
      setTeam(data);
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading team workspace...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
        <Users size={36} className="mx-auto text-slate-400 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Team Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested research team does not exist or has been removed.</p>
        <Link to="/teams/my-teams" className="px-5 py-2 rounded-xl bg-diu-blue text-white text-xs font-semibold">
          Return to My Teams
        </Link>
      </div>
    );
  }

  const isLeader = currentUser?.id === team.leader_id || currentUserRole === 'admin';

  const handleRemoveMember = async (memberUserId, memberName) => {
    if (confirm(`Are you sure you want to remove ${memberName} from this team?`)) {
      try {
        await apiCall(`/api/teams/${team.id}/members/${memberUserId}`, { method: 'DELETE' });
        setFeedback(`Removed ${memberName} from team.`);
        await fetchTeam();
        setTimeout(() => setFeedback(''), 3000);
      } catch (err) {
        alert(err.message || 'Failed to remove member.');
      }
    }
  };

  const handleDeleteTeam = async () => {
    if (confirm(`Are you sure you want to disband and delete "${team.team_name}"? This action cannot be undone.`)) {
      try {
        await apiCall(`/api/teams/${team.id}`, { method: 'DELETE' });
        navigate('/teams/my-teams');
      } catch (err) {
        alert(err.message || 'Failed to delete team.');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!candidateStudentId.trim()) return;
    setAddingMember(true);
    setErrorMsg('');
    try {
      await apiCall(`/api/teams/${team.id}/members`, {
        method: 'POST',
        body: JSON.stringify({ student_id: candidateStudentId.trim() })
      });
      setFeedback(`Added student (${candidateStudentId}) to the team!`);
      setShowAddModal(false);
      setCandidateStudentId('');
      await fetchTeam();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add student. Check ID and section compatibility.');
    } finally {
      setAddingMember(false);
    }
  };

  const members = team.members || [];
  const currentCount = team.member_count || members.length || 1;
  const maxCount = team.max_members || 5;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/teams/my-teams"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {team.team_name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-diu-blue">
                {team.status || 'Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Section: <strong>{team.section}</strong> • Domain: <strong>{team.domain}</strong> • {team.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLeader && currentCount < maxCount && (
            <button
              onClick={() => { setShowAddModal(true); setErrorMsg(''); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <UserPlus size={14} /> Add Member
            </button>
          )}
          {isLeader && (
            <button
              onClick={handleDeleteTeam}
              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
              title="Disband Team"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: Details on Left, Supervisor & Milestone on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Project Details & Members */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Project Abstract Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Project / Thesis Overview
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {team.project_title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {team.description || "Research project proposal under faculty supervision."}
              </p>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Team Members ({currentCount}/{maxCount})
                </h2>
                <p className="text-xs text-slate-400">Section {team.section} Cohort</p>
              </div>

              {currentCount >= 3 ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Compliant Group Size
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Need {3 - currentCount} more for minimum
                </span>
              )}
            </div>

            <div className="space-y-3">
              {members.map((member) => {
                const memberId = member.id || member.student_id;
                const memberName = member.full_name || member.name || 'Student Member';
                const isTeamLead = member.id === team.leader_id || memberName === team.leader_name;

                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-diu-blue flex items-center justify-center shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {memberName}
                          </h4>
                          {isTeamLead && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-diu-blue">
                              Team Leader
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          ID: {member.student_id || 'N/A'} • {member.department || team.department}
                        </p>
                      </div>
                    </div>

                    {isLeader && !isTeamLead && (
                      <button
                        onClick={() => handleRemoveMember(member.id, memberName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Supervisor Assignment & Milestones */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Supervisor Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Faculty Supervisor
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <p className="text-sm font-bold text-slate-900">
                {team.supervisor_name || 'Pending Faculty Assignment'}
              </p>
              <p className="text-xs text-diu-green font-medium">
                {team.department}
              </p>
            </div>

            <Link
              to="/supervisors"
              className="w-full py-2.5 rounded-xl border border-diu-blue text-diu-blue hover:bg-blue-50 text-xs font-semibold flex items-center justify-center transition-colors block text-center"
            >
              Browse Faculty Supervisors
            </Link>
          </div>

          {/* FYP Milestone Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              FYP Phase 1 Milestones
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Team Registration Completed</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Section Alignment Verified ({team.section})</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <Clock size={16} className="text-amber-500 shrink-0" />
                <span>Formal Proposal Defense Submission</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Clock size={16} className="text-slate-300 shrink-0" />
                <span>Mid-Term Code Review & Deliverables</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl animate-fadeIn space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add Teammate</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the official DIU Student ID of a student registered in Section {team.section}.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student ID Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 212-15-12345"
                  value={candidateStudentId}
                  onChange={(e) => setCandidateStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingMember}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {addingMember && <Loader2 size={13} className="animate-spin" />}
                  <span>Add to Team</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailsPage;
