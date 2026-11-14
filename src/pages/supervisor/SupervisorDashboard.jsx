import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tag, 
  BookOpen, 
  Briefcase, 
  Inbox, 
  Users, 
  UserPlus, 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  User,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import module1Service from '../../services/module1Service';

export const SupervisorDashboard = () => {
  const { currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [expertise, setExpertise] = useState([]);

  useEffect(() => {
    setOpportunities(module1Service.getOpportunities());
    setRequests(module1Service.getRequests());
    setAssignments(module1Service.getAssignments());
    setExpertise(module1Service.getExpertise());
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const activeAssignments = assignments.filter(a => a.status === 'Active');
  const studentAssignments = activeAssignments.filter(a => a.type === 'individual');
  const teamAssignments = activeAssignments.filter(a => a.type === 'team');

  const supervisorName = currentUser?.profile?.full_name || currentUser?.full_name || 'Faculty Member';
  const supervisorDept = currentUser?.profile?.department || currentUser?.department || 'Department of Computer Science and Engineering';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-diu-darkBlue via-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-200 border border-white/10">
            <Sparkles size={14} className="text-amber-400" />
            <span>Faculty Supervision & Mentorship Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {supervisorName}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
            {supervisorDept}. Manage your research interests, review prospective student thesis proposals, and guide undergraduate FYP teams toward defense excellence.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to="/supervisor/opportunities"
              className="px-5 py-2.5 rounded-xl bg-white text-diu-darkBlue hover:bg-blue-50 text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Create Opportunity
            </Link>
            <Link
              to="/supervisor/requests"
              className="px-5 py-2.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2"
            >
              <Inbox size={16} /> Review Student Requests ({pendingRequests.length})
            </Link>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-diu-blue flex items-center justify-center shrink-0">
            <Briefcase size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Active Opportunities</span>
            <span className="text-2xl font-black text-slate-900">{opportunities.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Pending Requests</span>
            <span className="text-2xl font-black text-slate-900">{pendingRequests.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Under Supervision</span>
            <span className="text-2xl font-black text-slate-900">
              {studentAssignments.length} Students • {teamAssignments.length} Teams
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Tag size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Declared Expertise</span>
            <span className="text-2xl font-black text-slate-900">{expertise.length} Tags</span>
          </div>
        </div>
      </div>

      {/* 10 Module 1 Responsibilities Control Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <LayoutDashboard size={20} className="text-diu-blue" />
          Supervisor Management Modules (Robayet Islam — ID: 809)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Part 01: Profile */}
          <Link
            to="/supervisor/profile"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-diu-blue transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-diu-blue flex items-center justify-center mb-4 group-hover:bg-diu-blue group-hover:text-white transition-colors">
                <User size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-diu-blue transition-colors">
                1. Supervisor Profile Management
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Maintain academic credentials, biography, office hours, and profile photo avatar with 2MB limits.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-diu-blue">
              <span>View & Edit Profile</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Part 02: Expertise */}
          <Link
            to="/supervisor/expertise"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-diu-blue transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Tag size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-diu-blue transition-colors">
                2. Research Expertise Management
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Add, edit, and organize research domain tags, technical skills, and publication keywords.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Manage Expertise Tags</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Part 03: Interests */}
          <Link
            to="/supervisor/interests/publish"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-diu-blue transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-diu-blue transition-colors">
                3. Research Interest Publishing
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Draft, live-preview, and publish thesis directions with candidate capacity requirements.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Publish & Preview Topics</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Part 04: Opportunities */}
          <Link
            to="/supervisor/opportunities"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-diu-blue transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-diu-blue flex items-center justify-center mb-4 group-hover:bg-diu-blue group-hover:text-white transition-colors">
                <Briefcase size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-diu-blue transition-colors">
                4. Research Opportunity Management
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Control active/inactive status, public visibility, application deadlines, and position quotas.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-diu-blue">
              <span>Manage Opportunities</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Part 07: Requests */}
          <Link
            to="/supervisor/requests"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-diu-blue transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Inbox size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-diu-blue transition-colors">
                7. Student Request Management
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Examine student applications, evaluate research statements, and accept or reject candidates.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Review Requests ({pendingRequests.length} pending)</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Part 08, 09, 10: Assignments */}
          <Link
            to="/supervisor/assignments"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-diu-blue transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-diu-blue transition-colors">
                8–10. Assigned Students & Teams
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Individual student assignment, existing FYP team integration, and safe unassignment workflows.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>Manage Assignments ({activeAssignments.length})</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
