import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MyTeamsPage = () => {
  const { apiCall, currentUserRole } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTeams = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/teams/my-teams');
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load my teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const handleDeleteTeam = async (teamId, teamName) => {
    if (confirm(`Are you sure you want to disband and delete "${teamName}"?`)) {
      try {
        await apiCall(`/api/teams/${teamId}`, { method: 'DELETE' });
        await fetchMyTeams();
      } catch (err) {
        alert(err.message || 'Failed to delete team.');
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Teams
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your FYP/Thesis research teams and collaborative groups
          </p>
        </div>

        {teams.length > 0 && (
          <Link
            to="/teams/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus size={16} /> Create New Team
          </Link>
        )}
      </div>

      {/* Main Content Area */}
      {teams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-200/80 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-5">
          <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-diu-blue shadow-inner">
            <Users size={40} className="stroke-[1.5]" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              No Teams Found!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Create a team or join an existing one to start collaborating on your thesis.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/teams/create"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              Create New Team
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
                      {team.team_name}
                    </h2>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {team.member_count || 1}/{team.max_members || 5} Members
                  </span>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Project / Thesis Title
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2">
                    {team.project_title}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Leader:</span>
                    <span className="font-semibold text-slate-800">{team.leader_name}</span>
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
                  onClick={() => handleDeleteTeam(team.id, team.team_name)}
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
    </div>
  );
};

export default MyTeamsPage;
