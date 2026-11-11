import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, ChevronRight, PlusCircle, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from '../components/NeutralAvatar';

export const TeamSearchPage = () => {
  const navigate = useNavigate();
  const { students, teams } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'create'

  const activeTeam = teams[0] || null;
  const currentMembersCount = activeTeam ? activeTeam.membersCount : 0;

  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Team Search & Formation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Find teammates or create your FYP/Thesis team
        </p>
      </div>

      {/* Tabs as in Mockup: Search Team | Create Team */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'search'
              ? 'border-diu-blue text-diu-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Search Team
        </button>
        <button
          type="button"
          onClick={() => navigate('/teams/create')}
          className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'create'
              ? 'border-diu-blue text-diu-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Create Team
        </button>
      </div>

      {/* Grid: Search & Results on Left (8 cols), Team Summary on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Search & Student Results */}
        <div className="lg:col-span-8 space-y-5">
          {/* Search Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search by student name or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>
              <button
                type="button"
                className="px-6 py-2.5 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Search Results ({filteredStudents.length})
            </h2>

            <div className="space-y-2.5">
              {filteredStudents.map((stu) => (
                <div
                  key={stu.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-diu-blue flex items-center justify-center shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                        {stu.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {stu.department} • Sec {stu.section}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/students/section`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-diu-blue hover:underline py-1.5 px-3 rounded-lg hover:bg-blue-100/40 transition-colors"
                  >
                    <span>View Profile</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Team Summary (Matches Mockup Exactly) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs text-center space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-slate-900">
              Team Summary
            </h2>

            {/* Icon Circle */}
            <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 text-diu-blue flex items-center justify-center mx-auto shadow-inner">
              <Users size={36} />
            </div>

            {/* Member count */}
            <div>
              <p className="text-2xl font-black text-slate-900">
                Team Members
              </p>
              <p className="text-xl font-bold text-diu-blue mt-1">
                {currentMembersCount}/5
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTeam ? activeTeam.teamName : 'No team formed yet'}
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Link
                to="/teams/create"
                className="w-full py-3 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all block"
              >
                Create Team
              </Link>
            </div>

            {activeTeam && (
              <div className="pt-2">
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

