import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  Users, 
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, RESEARCH_DOMAINS } from '../data/mockData';
import NeutralAvatar from '../components/NeutralAvatar';

export const FindSupervisorPage = () => {
  const { apiCall } = useAuth();
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/supervisors/?limit=100');
      const list = Array.isArray(data) ? data : (data?.items || []);
      setSupervisors(list);
    } catch (err) {
      console.error('Failed to fetch supervisors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const filteredSupervisors = useMemo(() => {
    return supervisors.filter((sup) => {
      const name = sup.full_name || sup.name || '';
      const dept = sup.department || '';
      const expertiseList = Array.isArray(sup.expertise)
        ? sup.expertise.map(e => (typeof e === 'string' ? e : e.name || ''))
        : [];

      const matchSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expertiseList.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
        dept.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = selectedDept === 'All' || dept.includes(selectedDept);
      const matchDomain = selectedDomain === 'All' || expertiseList.some(e => e.toLowerCase().includes(selectedDomain.toLowerCase()));
      const matchAccepting = !acceptingOnly || (sup.is_accepting_teams ?? sup.acceptingTeams);

      return matchSearch && matchDept && matchDomain && matchAccepting;
    });
  }, [supervisors, searchTerm, selectedDept, selectedDomain, acceptingOnly]);

  const totalPages = Math.ceil(filteredSupervisors.length / itemsPerPage);
  const paginatedSupervisors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSupervisors.slice(start, start + itemsPerPage);
  }, [filteredSupervisors, currentPage]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedDomain('All');
    setAcceptingOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Supervisor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover faculty advisors and research supervisors matching your FYP/Thesis domain
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {filteredSupervisors.length} Verified Faculty Members
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search faculty by name, topic, or keyword..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-diu-blue"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedDomain}
              onChange={(e) => { setSelectedDomain(e.target.value); setCurrentPage(1); }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-diu-blue"
            >
              <option value="All">All Research Domains</option>
              {RESEARCH_DOMAINS.map((domain) => (
                <option key={domain.id} value={domain.name}>{domain.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle & Reset Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={acceptingOnly}
              onChange={(e) => { setAcceptingOnly(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 rounded text-diu-blue focus:ring-diu-blue border-slate-300"
            />
            <span>Show Only Supervisors Accepting New Teams</span>
          </label>

          {(searchTerm || selectedDept !== 'All' || selectedDomain !== 'All' || acceptingOnly) && (
            <button
              onClick={handleReset}
              className="text-diu-blue hover:underline font-semibold"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Results Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3">
          <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading faculty supervisor directory...</p>
        </div>
      ) : paginatedSupervisors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSupervisors.map((supervisor) => {
            const name = supervisor.full_name || supervisor.name || 'Faculty Member';
            const designation = supervisor.designation || 'Lecturer';
            const department = supervisor.department || 'Department of CSE';
            const isAccepting = supervisor.is_accepting_teams ?? supervisor.acceptingTeams ?? true;
            const availableSlots = supervisor.available_slots ?? supervisor.availableSlots ?? 3;
            const maxSlots = supervisor.max_slots ?? supervisor.maxSlots ?? 5;
            const expertiseList = Array.isArray(supervisor.expertise)
              ? supervisor.expertise.map(e => (typeof e === 'string' ? e : e.name || ''))
              : [];

            return (
              <div
                key={supervisor.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top: Avatar & Info */}
                  <div className="flex items-start gap-4">
                    <NeutralAvatar
                      src={null}
                      size="md"
                      className="rounded-2xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-slate-900 truncate">
                        {name}
                      </h2>
                      <p className="text-xs text-slate-500 truncate">
                        {designation}
                      </p>
                      <p className="text-xs font-semibold text-diu-green">
                        {department}
                      </p>
                    </div>

                    {/* Availability Badge */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 ${
                        isAccepting
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {isAccepting ? 'Available' : 'Slots Full'}
                    </span>
                  </div>

                  {/* Research Expertise Tags */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Research Expertise
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {expertiseList.length > 0 ? (
                        expertiseList.slice(0, 4).map((exp, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-blue-50/80 text-diu-blue text-[11px] font-medium"
                          >
                            {exp}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Expertise listed on profile</span>
                      )}
                    </div>
                  </div>

                  {/* Slots info */}
                  <div className="mt-4 text-xs text-slate-500 flex items-center justify-between">
                    <span>Available Slots:</span>
                    <span className="font-bold text-slate-700">
                      {availableSlots} / {maxSlots} Teams
                    </span>
                  </div>
                </div>

                {/* View Profile Action Link / Button */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <Link
                    to={`/supervisors/${supervisor.id}`}
                    className="w-full py-2 px-4 rounded-xl bg-blue-50 hover:bg-diu-blue text-diu-blue hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Profile</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-diu-blue flex items-center justify-center mx-auto">
            <Search size={26} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Supervisors Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            We couldn't find any supervisors matching your current search criteria.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-xl bg-diu-blue text-white text-xs font-semibold hover:bg-diu-accentBlue"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === pageNum
                    ? 'bg-diu-blue text-white shadow-xs'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default FindSupervisorPage;
