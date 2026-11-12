import React, { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { apiCall } = useAuth();
  const [stats, setStats] = useState({
    total_students: 0,
    total_supervisors: 0,
    total_teams: 0,
    total_users: 0,
    active_users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAdminStats = async () => {
      try {
        const data = await apiCall('/api/admin/stats');
        if (mounted && data) {
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAdminStats();
    return () => { mounted = false; };
  }, [apiCall]);

  const statCards = [
    {
      label: "Total Students",
      value: stats.total_students,
      icon: Users,
      bgColor: "bg-blue-50/70",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      link: "/admin/users"
    },
    {
      label: "Total Supervisors",
      value: stats.total_supervisors,
      icon: GraduationCap,
      bgColor: "bg-emerald-50/70",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      link: "/admin/supervisors"
    },
    {
      label: "Total Teams",
      value: stats.total_teams,
      icon: FolderKanban,
      bgColor: "bg-purple-50/70",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      link: "/teams/my-teams"
    },
    {
      label: "Active Users",
      value: stats.active_users || stats.total_users,
      icon: BookOpen,
      bgColor: "bg-amber-50/70",
      textColor: "text-amber-600",
      borderColor: "border-amber-100",
      link: "/admin/users"
    }
  ];

  const quickActions = [
    {
      title: "User Management",
      desc: "Activate, deactivate or review student registrations",
      icon: Users,
      path: "/admin/users",
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Faculty Supervisor Directory",
      desc: "Assign supervision quotas and expertise tags",
      icon: UserCheck,
      path: "/admin/supervisors",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Role & Permission Control",
      desc: "Audit RBAC permissions across student and faculty tiers",
      icon: ShieldCheck,
      path: "/admin/roles",
      color: "text-purple-600 bg-purple-50"
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading administrative metrics...</p>
      </div>
    );
  }

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
            Real-time server analytics and system management
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

      {/* 4 Stat Summary Cards */}
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

      {/* Two Columns: Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: System Status */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">System Telemetry & Database</h2>
            <span className="text-xs text-slate-400">Live Status</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  PostgreSQL / SQLite Storage Engine Active
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tables synchronized: users, students, supervisors, teams, revoked_tokens
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-diu-blue flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  Argon2id & JWT Token Revocation Guard
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  RFC 7519 cryptographic token authentication enabled across all endpoints
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Administration Actions */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Quick Administration</h2>
            <span className="text-xs text-slate-400">Controls</span>
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

      </div>
    </div>
  );
};

export default AdminDashboard;
