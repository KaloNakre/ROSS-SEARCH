import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, UserPlus, Filter, CheckCircle2, User, Building, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SECTIONS, DEPARTMENTS } from '../data/mockData';
import NeutralAvatar from '../components/NeutralAvatar';

export const SearchStudentsSection = () => {
  const { students, teams, addTeamMember } = useAuth();
  const [selectedSection, setSelectedSection] = useState('60_A');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  // Primary active team
  const activeTeam = teams[0] || null;

  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const matchSection = selectedSection === 'All' || stu.section === selectedSection;
      const matchDept = selectedDept === 'All' || stu.department.includes(selectedDept);
      const matchSearch =
        stu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stu.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase())) ||
        stu.preferredTopic.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSection && matchDept && matchSearch;
    });
  }, [students, selectedSection, selectedDept, searchTerm]);

  const handleInvite = (student) => {
    if (!activeTeam) {
      alert('Please create an FYP/Thesis team first before sending teammate invites.');
      return;
    }
    if (activeTeam.membersCount >= activeTeam.maxMembers) {
      alert('Your team has already reached the maximum 5-member limit.');
      return;
    }
    addTeamMember(activeTeam.id, student);
    setInviteSuccess(`Invitation sent and ${student.name} added to ${activeTeam.teamName}!`);
    setTimeout(() => setInviteSuccess(''), 4000);
  };

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
            <Users size={14} /> My Active Team ({activeTeam.membersCount}/{activeTeam.maxMembers})
          </Link>
        )}
      </div>

      {/* Success banner */}
      {inviteSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{inviteSuccess}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Section Selector */}
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
            >
              <option value="All">All Sections</option>
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
              <option value="CSE">Computer Science and Engineering</option>
              <option value="SWE">Software Engineering</option>
            </select>
          </div>

          {/* Search Term */}
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search by Domain or Topic
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="e.g. Machine Learning, Cyber Security..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Eligible Teammates in Section {selectedSection} ({filteredStudents.length})
          </h2>
          <span className="text-xs text-slate-400">
            Status: Looking for FYP Team
          </span>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="space-y-3">
            {filteredStudents.map((stu) => {
              const isAlreadyMember = activeTeam?.members.some(m => m.id === stu.id);
              return (
                <div
                  key={stu.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Neutral Avatar */}
                    <NeutralAvatar size="md" className="rounded-xl shadow-xs shrink-0" />
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{stu.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                          {stu.studentId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Sec {stu.section}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {stu.department} • {stu.batch}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {stu.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-diu-blue text-[11px] font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 mt-2 italic">
                        "Focus: {stu.preferredTopic}"
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isAlreadyMember ? (
                      <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                        Already in Team
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInvite(stu)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <UserPlus size={14} /> Invite to Team
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Users size={32} className="mx-auto text-slate-300" />
            <p className="text-sm font-medium">No students found matching current section filters.</p>
            <p className="text-xs">Try selecting "All Sections" or adjusting your search keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStudentsSection;

