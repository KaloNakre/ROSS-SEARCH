import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, ChevronRight, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RESEARCH_DOMAINS, DEPARTMENTS } from '../data/mockData';

export const FindSupervisorPage = () => {
  const { supervisors } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic
  const filteredSupervisors = useMemo(() => {
    return supervisors.filter((sup) => {
      const matchesSearch =
        sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDomain =
        selectedDomain === 'All' ||
        sup.expertise.includes(selectedDomain);

      const matchesDept =
        selectedDepartment === 'All' ||
        sup.department.includes(selectedDepartment) ||
        (selectedDepartment === 'CSE' && sup.department.includes('CSE')) ||
        (selectedDepartment === 'SWE' && sup.department.includes('SWE'));

      return matchesSearch && matchesDomain && matchesDept;
    });
  }, [supervisors, searchTerm, selectedDomain, selectedDepartment]);

  // Pagination
  const totalPages = Math.ceil(filteredSupervisors.length / itemsPerPage) || 1;
  const paginatedSupervisors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSupervisors.slice(start, start + itemsPerPage);
  }, [filteredSupervisors, currentPage]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedDomain('All');
    setSelectedDepartment('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Suitable Supervisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Discover experienced supervisors based on your research interests
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name, expertise, or research topic..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>

          {/* Domain Filter */}
          <div className="w-full sm:w-48">
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            >
              <option value="All">All Research Domains</option>
              {RESEARCH_DOMAINS.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="w-full sm:w-44">
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE Dept.</option>
              <option value="SWE">SWE Dept.</option>
            </select>
          </div>

          {/* Search Trigger Button */}
          <button
            type="button"
            className="px-6 py-2.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
          >
            Search
          </button>
        </div>

        {/* Active Filter Indicators */}
        {(searchTerm || selectedDomain !== 'All' || selectedDepartment !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Showing {filteredSupervisors.length} result(s)
            </span>
            <button
              onClick={handleReset}
              className="text-diu-blue hover:underline font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* STRICT RULE 5: Text-based supervisor cards without profile photos or generated avatars */}
      {paginatedSupervisors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedSupervisors.map((supervisor) => (
            <div
              key={supervisor.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-diu-blue/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Name & Designation */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {supervisor.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {supervisor.designation}
                    </p>
                    <p className="text-xs font-semibold text-diu-green">
                      {supervisor.department}
                    </p>
                  </div>

                  {/* Availability Badge */}
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 ${
                      supervisor.acceptingTeams
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {supervisor.acceptingTeams ? 'Available' : 'Slots Full'}
                  </span>
                </div>

                {/* Research Expertise Tags */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Research Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {supervisor.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="px-2.5 py-1 rounded-lg bg-blue-50/80 text-diu-blue text-[11px] font-medium"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Slots info */}
                <div className="mt-4 text-xs text-slate-500 flex items-center justify-between">
                  <span>Available Slots:</span>
                  <span className="font-bold text-slate-700">
                    {supervisor.availableSlots} / {supervisor.maxSlots} Teams
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
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-diu-blue flex items-center justify-center mx-auto">
            <Search size={26} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Supervisors Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            We couldn't find any supervisors matching your current search criteria or domain selection.
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

