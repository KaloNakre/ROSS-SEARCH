import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  GraduationCap, 
  Check, 
  X, 
  ArrowLeft, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RoleManagementPage = () => {
  const { currentUserRole } = useAuth();

  const permissionsMatrix = [
    { module: "Browse & Search Supervisors", student: true, supervisor: true, admin: true },
    { module: "Edit Own Student Profile & Credentials", student: true, supervisor: false, admin: true },
    { module: "Manage Research Interests & Domains", student: true, supervisor: false, admin: true },
    { module: "Search Classmates by Section", student: true, supervisor: true, admin: true },
    { module: "Create & Disband Research Teams", student: true, supervisor: false, admin: true },
    { module: "Invite / Remove Team Members", student: true, supervisor: false, admin: true },
    { module: "Accept / Reject Supervision Requests", student: false, supervisor: true, admin: true },
    { module: "Update Faculty Supervision Quotas", student: false, supervisor: true, admin: true },
    { module: "Manage Student Accounts & Enrolment", student: false, supervisor: false, admin: true },
    { module: "Configure System Roles & Access", student: false, supervisor: false, admin: true }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-diu-blue text-xs font-semibold mb-1">
              <Sparkles size={13} /> Strict RBAC System
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Role-Based Access Control (RBAC)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Authenticated role architecture enforced at both frontend router and backend API endpoints
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Your Current Role:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
            {currentUserRole}
          </span>
        </div>
      </div>

      {/* 3 Role Definition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Student Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-diu-blue flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Student Role</h2>
            <p className="text-xs text-slate-500 mt-1">
              For undergraduate candidates completing their mandatory FYP or Thesis courses.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Self-service registration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Profile & topic definition</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Peer search in same section</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Form 3–5 member teams</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Authority Level:</span>
            <span className="font-bold text-blue-600">Student Access</span>
          </div>
        </div>

        {/* Supervisor Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Supervisor Role</h2>
            <p className="text-xs text-slate-500 mt-1">
              For faculty advisors, lecturers, and professors mentoring research teams.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Accept or decline teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Manage supervisory quota</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Publish expertise tags</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Track assigned project groups</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Authority Level:</span>
            <span className="font-bold text-emerald-600">Faculty Access</span>
          </div>
        </div>

        {/* Admin Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Admin Role</h2>
            <p className="text-xs text-slate-500 mt-1">
              For departmental FYP coordinators and academic system administrators.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>User verification and oversight</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Faculty quota modifications</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Section matching policy enforcement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>System audit and compliance logs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Authority Level:</span>
            <span className="font-bold text-purple-600">Full System Access</span>
          </div>
        </div>

      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            RBAC Feature Permission Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Module 1 functional capabilities partitioned by user role
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Capability / Feature Scope</th>
                <th className="py-3.5 px-6 text-center">Student</th>
                <th className="py-3.5 px-6 text-center">Supervisor</th>
                <th className="py-3.5 px-6 text-center">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-800">
                    {item.module}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {item.student ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 mx-auto">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {item.supervisor ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 mx-auto">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {item.admin ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 mx-auto">
                        <X size={14} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementPage;
