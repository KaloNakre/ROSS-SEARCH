import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Users, 
  FolderKanban, 
  Clock, 
  UserPlus, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RECENT_ACTIVITIES } from '../data/mockData';

export const StudentDashboard = () => {
  const { studentProfile, teams, supervisors } = useAuth();

  const statCards = [
    {
      label: "Find Supervisors",
      value: supervisors.length,
      icon: Search,
      bgColor: "bg-blue-50/70",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      link: "/supervisors"
    },
    {
      label: "My Teams",
      value: teams.length,
      icon: Users,
      bgColor: "bg-emerald-50/70",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      link: "/teams/my-teams"
    },
    {
      label: "My Projects",
      value: 1,
      icon: FolderKanban,
      bgColor: "bg-purple-50/70",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      link: "/teams/my-teams"
    },
    {
      label: "Pending Requests",
      value: 1,
      icon: Clock,
      bgColor: "bg-amber-50/70",
      textColor: "text-amber-600",
      borderColor: "border-amber-100",
      link: "/teams/my-teams"
    }
  ];

  const quickActions = [
    {
      title: "Find a Supervisor",
      desc: "Search faculty by domain and research expertise",
      icon: Search,
      path: "/supervisors",
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Search Students",
      desc: "Find teammates in your batch and section",
      icon: Users,
      path: "/students/section",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Create Team",
      desc: "Form an FYP / Thesis research team",
      icon: UserPlus,
      path: "/teams/create",
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "View Profile",
      desc: "Inspect and update your research profile",
      icon: User,
      path: "/student/profile",
      color: "text-amber-600 bg-amber-50"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-diu-blue text-xs font-semibold mb-2">
            <Sparkles size={13} /> Student Research Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, {studentProfile.name}!
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Your research journey continues. Track team progress and connect with supervisors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/research-interests"
            className="px-4 py-2 rounded-xl border border-diu-blue text-diu-blue hover:bg-blue-50 text-xs font-semibold transition-colors"
          >
            Manage Interests
          </Link>
          <Link
            to="/teams/create"
            className="px-4 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Create Team
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className={`p-5 rounded-2xl border ${card.borderColor} ${card.bgColor} bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bgColor} ${card.textColor}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-3xl font-black ${card.textColor}`}>
                  {card.value}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Columns: Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Quick Actions Panel */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
            <span className="text-xs text-slate-400">Shortcuts</span>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-diu-blue transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-[11px] text-slate-400">{action.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-diu-blue group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activities Panel */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
              <span className="text-xs text-slate-400">Live Updates</span>
            </div>

            <div className="space-y-4">
              {RECENT_ACTIVITIES.student.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100/60 text-diu-blue flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-800">{activity.text}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Academic Milestone Note */}
          <div className="mt-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <FileText size={18} className="text-diu-blue shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">Proposal Submission Phase: </span>
              <span className="text-slate-600">Ensure your 3-to-5 member team has selected a verified research domain.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;

