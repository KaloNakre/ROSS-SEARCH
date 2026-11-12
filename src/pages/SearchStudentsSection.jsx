import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, User, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SECTIONS, DEPARTMENTS } from '../data/mockData';

export const SearchStudentsSection = () => {
  const { apiCall } = useAuth();
  const [selectedSection, setSelectedSection] = useState('60_A');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchActiveTeam = async () => {
      try {
        const teams = await apiCall('/api/teams/my-teams');
        if (mounted && Array.isArray(teams) && teams.length > 0) {
          setActiveTeam(teams[0]);
        }
      } catch (err) {
        console.error('Failed to load my teams:', err);
      }
    };
    fetchActiveTeam();
    return () => { mounted = false; };
  }, [apiCall]);

  useEffect(() => {
    let mounted = true;
    const fetchSectionStudents = async () => {
      setLoading(true);
      try {
        const data = await apiCall(`/api/students/section/${selectedSection}`);
        if (mounted) {
          setStudents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch section students:', err);
        if (mounted) setStudents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSectionStudents();
    return () => { mounted = false; };
  }, [selectedSection, apiCall]);

  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const name = stu.full_name || stu.name || '';
      const dept = stu.department || '';
      const stuId = stu.student_id || '';
      const matchDept = selectedDept === 'All' || dept.includes(selectedDept);
      const matchSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stuId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [students, selectedDept, searchTerm]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Search Students by Section
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find eligible classmates in your academic section to form a compliant 3–5 member FYP/Thesis team
          </p>
        </div>

        {activeTeam && (
          <Link
            to={`/teams/${activeTeam.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-diu-blue text-xs font-semibold rounded-xl"
          >
            <Users size={14} /> My Active Team ({activeTeam.member_count || 1}/{activeTeam.max_members || 5})
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Section Selector */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
            >
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search by Name / ID
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing registered students for <strong>Section {selectedSection}</strong></span>
        <span>{filteredStudents.length} Students Found</span>
      </div>

      {/* Main Student Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3">
          <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Fetching section students...</p>
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((stu) => {
            const name = stu.full_name || stu.name || 'Student';
            const studentId = stu.student_id || 'N/A';
            const department = stu.department || 'Department of CSE';
            const batch = stu.batch || 'Batch';

            return (
              <div
                key={stu.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-diu-blue flex items-center justify-center shrink-0 border border-blue-100">
                      <User size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-slate-900 truncate">
                        {name}
                      </h2>
                      <p className="text-[11px] font-semibold text-diu-blue">
                        {studentId}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {department}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Section: <strong>{selectedSection}</strong></span>
                    <span>{batch}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <Users size={12} /> Section Peer
                    </span>
                    {activeTeam && (
                      <Link
                        to={`/teams/${activeTeam.id}`}
                        className="text-diu-blue hover:underline font-semibold"
                      >
                        Invite to Team &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto space-y-3">
          <Users size={36} className="mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800">No Students Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            No registered students currently found for Section {selectedSection}.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchStudentsSection;
