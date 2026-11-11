import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  FolderKanban, 
  BookOpen, 
  CheckCircle2, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { ADMIN_STATS, RECENT_ACTIVITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { students, supervisors, teams } = useAuth();

  const statCards = [
    {
      label: "Total Students",
      value: ADMIN_STATS.totalStudents,
      icon: Users,
      bgColor: "bg-blue-50/70",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      link: "/admin/users"
    },
    {
      label: "Total Supervisors",
      value: ADMIN_STATS.totalSupervisors,
      icon: GraduationCap,
      bgColor: "bg-emerald-50/70",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      link: "/admin/supervisors"
    },
    {
      label: "Total Teams",
      value: ADMIN_STATS.totalTeams,
      icon: FolderKanban,
      bgColor: "bg-purple-50/70",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      link: "/teams/my-teams"
    },
    {
      label: "Total Projects",
      value: ADMIN_STATS.totalProjects,
      icon: BookOpen,
      bgColor: "bg-amber-50/70",
      textColor: "text-amber-600",
      borderColor: "border-amber-100",
      link: "/teams/my-teams"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-diu-blue text-xs font-semibold mb-2">
            <Sparkles size={13} /> Administrative Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage users, supervisors and system activities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/roles"
            className="px-4 py-2 rounded-xl border border-diu-blue text-diu-blue hover:bg-blue-50 text-xs font-semibold transition-colors"
          >
            Role Management
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* 4 Stat Summary Cards (Matches Screenshot Exactly) */}
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

      {/* Two Columns: Recent Activities & Quick Actions (Matches Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Recent Activities */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
            <span className="text-xs text-slate-400">System Logs</span>
          </div>

          <div className="space-y-4">
            {RECENT_ACTIVITIES.admin.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-diu-blue flex items-center justify-center shrink-0 mt-0.5">
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

        {/* Right Column: Quick Actions */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
              <span className="text-xs text-slate-400">Admin Controls</span>
            </div>

            <div className="space-y-3">
              <Link
                to="/admin/users"
                className="w-full py-3 px-5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-xs sm:text-sm font-semibold text-slate-800 hover:text-diu-blue flex items-center justify-between transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <Users size={16} className="text-diu-blue" /> Manage Users
                </span>
                <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/admin/supervisors"
                className="w-full py-3 px-5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-xs sm:text-sm font-semibold text-slate-800 hover:text-diu-blue flex items-center justify-between transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <UserCheck size={16} className="text-emerald-600" /> Manage Supervisors
                </span>
                <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/admin/roles"
                className="w-full py-3 px-5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-xs sm:text-sm font-semibold text-slate-800 hover:text-diu-blue flex items-center justify-between transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-purple-600" /> Role & Permission Management
                </span>
                <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500">
            <strong>Audit Compliance:</strong> Academic data for Module 1 is protected under DIU Student Data Privacy standards.
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

