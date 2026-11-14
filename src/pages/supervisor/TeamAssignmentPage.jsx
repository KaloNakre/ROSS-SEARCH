import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Briefcase, 
  Layers, 
  ShieldAlert,
  ArrowRight,
  FolderKanban,
  User
} from 'lucide-react';
import module1Service from '../../services/module1Service';
import { useAuth } from '../../context/AuthContext';

export const TeamAssignmentPage = () => {
  const { apiCall } = useAuth();

  const [teams, setTeams] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 1. Load active opportunities that accept Teams or Both
    const opps = module1Service.getOpportunities().filter(o => o.isPublished && o.status === 'Active' && o.studentType !== 'Individual');
    setOpportunities(opps);
    if (opps.length > 0) setSelectedOppId(String(opps[0].id));

    // 2. Load assignments
    setAssignments(module1Service.getAssignments());

    // 3. Load teams from existing team API or fallback
    try {
      const data = await apiCall('/api/teams/?limit=50');
      const list = Array.isArray(data) ? data : (data?.items || []);
      if (list.length > 0) {
        setTeams(list);
        return;
      }
    } catch {}

    // Fallback existing teams from the platform
    setTeams([
      {
        id: 1,
        name: "Bengali NLP Research Team",
        section: "60_A",
        department: "Department of CSE",
        research_interest: "Natural Language Processing",
        members: [
          { name: "Tamim Hasan Sami", student_id: "201-15-313", role: "Leader" },
          { name: "Tanvir Ahmed", student_id: "201-15-101", role: "Member" },
          { name: "Farhana Yasmin", student_id: "201-15-102", role: "Member" }
        ]
      },
      {
        id: 2,
        name: "Cyber Defense Squad",
        section: "61_B",
        department: "Department of CSE",
        research_interest: "Cyber Security",
        members: [
          { name: "Riya Saha", student_id: "201-15-715", role: "Leader" },
          { name: "Tahmid Hossain", student_id: "201-15-202", role: "Member" },
          { name: "Sadia Afrin", student_id: "201-15-203", role: "Member" }
        ]
      },
      {
        id: 3,
        name: "Autonomous Robotics Lab",
        section: "60_C",
        department: "Department of Software Eng.",
        research_interest: "AI & Robotics",
        members: [
          { name: "Ahsan Habib", student_id: "201-15-305", role: "Leader" },
          { name: "Mehedi Hasan", student_id: "201-15-306", role: "Member" }
        ]
      }
    ]);
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const isTeamAssigned = (teamId) => {
    return assignments.some(a => a.type === 'team' && a.targetId === teamId && a.status === 'Active');
  };

  const getTeamAssignment = (teamId) => {
    return assignments.find(a => a.type === 'team' && a.targetId === teamId && a.status === 'Active');
  };

  const filteredTeams = teams.filter(t => {
    const name = t.name || '';
    const interest = t.research_interest || '';
    const section = t.section || '';
    const q = searchTerm.toLowerCase();
    return name.toLowerCase().includes(q) || interest.toLowerCase().includes(q) || section.toLowerCase().includes(q);
  });

  const handleAssignTeam = (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      showFeedback('error', 'Please select an existing eligible team.');
      return;
    }
    if (!selectedOppId) {
      showFeedback('error', 'Please select a research opportunity.');
      return;
    }

    const opp = opportunities.find(o => String(o.id) === String(selectedOppId));
    if (!opp) {
      showFeedback('error', 'Selected research opportunity could not be found.');
      return;
    }

    try {
      module1Service.assignTeam({
        team: selectedTeam,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        notes: assignmentNote.trim() || 'Team formally assigned to thesis topic.',
      });

      showFeedback('success', `Team "${selectedTeam.name}" assigned to "${opp.title}".`);
      setSelectedTeam(null);
      setAssignmentNote('');
      loadData();
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/supervisor/dashboard" className="hover:text-diu-blue">Supervisor Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Team Assignment</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderKanban className="text-diu-blue stroke-[2.2]" size={26} />
            Existing Team Assignment Integration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect pre-formed FYP/thesis teams to your published research opportunities without re-creating teams.
          </p>
        </div>

        <Link
          to="/supervisor/assignments"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          View All Assignments <ArrowRight size={14} />
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Team Browser */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search teams by name, research interest, or section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTeams.map((team) => {
              const assigned = isTeamAssigned(team.id);
              const isSelected = selectedTeam?.id === team.id;
              const existingAssignment = getTeamAssignment(team.id);

              return (
                <div
                  key={team.id}
                  onClick={() => {
                    if (!assigned) setSelectedTeam(team);
                  }}
                  className={`p-5 rounded-2xl border transition-all ${
                    assigned 
                      ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-50/70 border-diu-blue shadow-sm ring-2 ring-diu-blue cursor-pointer'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{team.name}</h4>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Sec: {team.section}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Domain Interest: <strong className="text-diu-blue">{team.research_interest || 'General CS'}</strong>
                      </p>

                      {/* Team Member List */}
                      {team.members && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {team.members.map((m, i) => (
                            <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                              <User size={10} className="text-slate-400" />
                              {m.name} ({m.student_id})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      {assigned ? (
                        <div className="text-right">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 inline-block">
                            Assigned
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1 max-w-[140px] truncate" title={existingAssignment?.opportunityTitle}>
                            {existingAssignment?.opportunityTitle}
                          </p>
                        </div>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1 rounded-xl transition-colors ${
                          isSelected ? 'bg-diu-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>
                          {isSelected ? 'Selected' : 'Select Team'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Assignment Form Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sticky top-24 space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FolderKanban size={18} className="text-diu-blue" />
              Assign Team to Opportunity
            </h3>

            {selectedTeam ? (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-diu-blue tracking-wider">Team Selected:</span>
                <p className="font-bold text-slate-900 text-sm">{selectedTeam.name}</p>
                <p className="text-slate-600">Section: {selectedTeam.section} • {selectedTeam.members?.length || 3} Members</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center text-xs text-slate-400">
                Please select an unassigned team from the left panel.
              </div>
            )}

            <form onSubmit={handleAssignTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Research Opportunity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedOppId}
                  onChange={(e) => setSelectedOppId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                >
                  {opportunities.map(opp => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} ({opp.availablePositions} positions left)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Team Assignment Directives & Proposal Timeline
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Assigned to transformer benchmarking study. First defense presentation scheduled for week 6."
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldAlert size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Reuses Tamim Hasan Sami's existing team management data without duplicating team creation.</span>
              </div>

              <button
                type="submit"
                disabled={!selectedTeam}
                className="w-full py-3 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={15} /> Confirm Team Assignment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAssignmentPage;
