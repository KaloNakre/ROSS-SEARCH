import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ChevronRight, Loader2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RESEARCH_DOMAINS } from '../data/mockData';

export const TeamSearchPage = () => {
  const { apiCall } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [myTeams, setMyTeams] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchAllTeams = async () => {
      try {
        const [teamsRes, myTeamsRes] = await Promise.allSettled([
          apiCall('/api/teams/?limit=100'),
          apiCall('/api/teams/my-teams')
        ]);
        if (mounted) {
          if (teamsRes.status === 'fulfilled' && Array.isArray(teamsRes.value)) {
            setTeams(teamsRes.value);
          }
          if (myTeamsRes.status === 'fulfilled' && Array.isArray(myTeamsRes.value)) {
            setMyTeams(myTeamsRes.value);
          }
        }
      } catch (err) {
        console.error('Failed to load teams:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAllTeams();
    return () => { mounted = false; };
  }, [apiCall]);

  const activeTeam = myTeams[0] || null;

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const name = t.team_name || '';
      const title = t.project_title || '';
      const domain = t.domain || '';
      const matchSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDomain = selectedDomain === 'All' || domain.toLowerCase().includes(selectedDomain.toLowerCase());
      return matchSearch && matchDomain;
    });
  }, [teams, searchTerm, selectedDomain]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team Directory & Search
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse registered FYP/Thesis research teams across departments and sections
          </p>
        </div>

        <Link
          to="/teams/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={15} /> Create Team
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Search & Results */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex gap-2">
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
              <div className="space-y-3">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 transition-all gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-diu-blue flex items-center justify-center shrink-0 mt-0.5">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {team.team_name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-diu-blue border border-blue-100">
                            Sec {team.section}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">
                          {team.project_title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Supervisor: {team.supervisor_name || 'Pending'} • Domain: {team.domain}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-500">
                        {team.member_count || 1}/{team.max_members || 5} Members
                      </span>
                      <Link
                        to={`/teams/${team.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-diu-blue hover:underline py-1 px-2.5 rounded-lg hover:bg-blue-100/40 transition-colors"
                      >
                        <span>Details</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 space-y-2">
                <p>No registered research teams match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Team Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs text-center space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-slate-900">
              My Team Status
            </h2>

            <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 text-diu-blue flex items-center justify-center mx-auto shadow-inner">
              <Users size={36} />
            </div>

            <div>
              <p className="text-xl font-black text-slate-900">
                {activeTeam ? activeTeam.team_name : 'No Active Team'}
              </p>
              <p className="text-xs font-bold text-diu-blue mt-1">
                {activeTeam ? `${activeTeam.member_count || 1}/${activeTeam.max_members || 5} Members` : '0/5 Members'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTeam ? `Section ${activeTeam.section} • ${activeTeam.domain}` : 'Create an FYP team to begin'}
              </p>
            </div>

            <div className="pt-2">
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
    </div>
  );
};

export default TeamSearchPage;
