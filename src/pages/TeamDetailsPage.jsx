import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  User, 
  Building, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from '../components/NeutralAvatar';

export const TeamDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teams, removeTeamMember, deleteTeam, students, addTeamMember } = useAuth();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('');
  const [feedback, setFeedback] = useState('');

  const team = teams.find(t => t.id === id) || teams[0];

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

  const handleRemove = (memberId, memberName) => {
    if (confirm(`Are you sure you want to remove ${memberName} from this team?`)) {
      removeTeamMember(team.id, memberId);
      setFeedback(`Removed ${memberName} from team.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleDeleteTeam = () => {
    if (confirm(`Are you sure you want to disband and delete "${team.teamName}"? This action cannot be undone.`)) {
      deleteTeam(team.id);
      navigate('/teams/my-teams');
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!selectedStudentToAdd) return;
    const stu = students.find(s => s.id === selectedStudentToAdd);
    if (stu) {
      addTeamMember(team.id, stu);
      setFeedback(`Added ${stu.name} to the team!`);
      setShowAddModal(false);
      setSelectedStudentToAdd('');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  // Filter students who are not already in this team
  const availableStudents = students.filter(
    s => !team.members.some(m => m.id === s.id)
  );

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
                {team.teamName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-diu-blue">
                {team.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Section: <strong>{team.section}</strong> • Domain: <strong>{team.domain}</strong> • {team.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {team.membersCount < team.maxMembers && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <UserPlus size={14} /> Add Member
            </button>
          )}
          <button
            onClick={handleDeleteTeam}
            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
            title="Disband Team"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: Details on Left (7 cols), Supervisor & Milestones on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Title & Members List */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Project Abstract Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} className="text-diu-blue" />
              Project / Thesis Title
            </h2>
            <p className="text-base font-extrabold text-slate-900 leading-snug">
              {team.projectTitle}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {team.description || "No formal abstract supplied yet."}
            </p>
          </div>

          {/* Members List Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Team Roster</h2>
                <p className="text-xs text-slate-400">Current composition ({team.membersCount}/{team.maxMembers} members)</p>
              </div>
              <span className="text-xs font-bold text-diu-blue bg-blue-50 px-2.5 py-1 rounded-lg">
                Required: 3–5 Students
              </span>
            </div>

            <div className="space-y-3">
              {team.members.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <NeutralAvatar size="sm" className="rounded-xl shadow-xs shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {member.name}
                        </span>
                        {member.role === 'Leader' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-diu-blue">
                            Leader
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {member.studentId} • {member.department}
                      </p>
                    </div>
                  </div>

                  {member.role !== 'Leader' && (
                    <button
                      onClick={() => handleRemove(member.id, member.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {team.membersCount < 3 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <strong>Attention:</strong> Minimum 3 members required for formal defense eligibility. Invite more students from Section {team.section}.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Supervisor & Milestones */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Supervisor Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Assigned Supervisor
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center gap-3">
                <NeutralAvatar size="md" className="rounded-xl shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {team.supervisorName || "Dr. Full Name"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Department of CSE
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600">Assigned & Verified</span>
              </div>
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
                Select an eligible student from the available candidates in Section {team.section}.
              </p>
            </div>

            {availableStudents.length > 0 ? (
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Candidate
                  </label>
                  <select
                    required
                    value={selectedStudentToAdd}
                    onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  >
                    <option value="">-- Choose Candidate --</option>
                    {availableStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentId} - Sec {s.section})
                      </option>
                    ))}
                  </select>
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
                    className="px-5 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm"
                  >
                    Add to Team
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500 space-y-3">
                <p>No remaining unassigned candidates available in this section.</p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailsPage;

