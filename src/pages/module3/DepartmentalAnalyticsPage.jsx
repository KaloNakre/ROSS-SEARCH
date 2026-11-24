/**
 * ROSS-SEARCH: Module 3 — Departmental FYP Analytics & Supervisor Workload Dashboard
 * Assigned to: [Tamim Hasan Sami – ID: 313]
 * 
 * Capabilities:
 * - Institutional overview of research domain distribution across active student cohorts
 * - Ongoing vs completed project progress stages
 * - Faculty supervisor workload, assignment utilization, and available capacity slots
 * - Average proposal format compliance and pending supervisor review queues
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Users, 
  GraduationCap, 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Loader2,
  Calendar,
  Briefcase
} from 'lucide-react';
import { module3Service } from '../../services/module3Service';

export const DepartmentalAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    module3Service.getDepartmentalAnalytics().then(data => {
      setAnalytics(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Aggregating departmental research analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 mb-1">Analytics Unavailable</h3>
        <p className="text-xs text-slate-500">Could not retrieve departmental statistics at this time.</p>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Active FYP Projects',
      value: analytics.total_projects,
      sub: `${analytics.total_active_students} Students Participating`,
      icon: FolderKanban,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      label: 'Faculty Supervisors',
      value: analytics.total_supervisors,
      sub: 'Active Research Mentors',
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      label: 'Overall Completion Rate',
      value: `${analytics.overall_completion_rate}%`,
      sub: 'Dissertation Progress Velocity',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      label: 'Avg Proposal Compliance',
      value: `${analytics.average_compliance_score}/100`,
      sub: 'DIU Standard Alignment',
      icon: ShieldCheck,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-diu-darkBlue to-indigo-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-semibold border border-cyan-400/30">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-300" />
            <span>Institutional FYP & Thesis Intelligence</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Departmental Research Analytics & Supervisor Workload
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Real-time analytics for academic administrators. Monitor domain allocation distributions, track 5-phase project progress, audit proposal compliance scores, and right-size supervisor team capacities.
          </p>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl border ${kpi.color.split(' ')[2]} bg-white shadow-2xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${kpi.color.split(' ')[1]} ${kpi.color.split(' ')[0]}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-3xl font-black ${kpi.color.split(' ')[0]}`}>
                  {kpi.value}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Domain Distribution (6 Cols) & Project Stages (6 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Research Domain Distribution: 6 Cols */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-diu-blue" />
                <span>Research Domain Distribution</span>
              </h2>
              <p className="text-[11px] text-slate-500">Breakdown of student projects by technical domain</p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {analytics.domain_distribution.length} Domains
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {analytics.domain_distribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>{item.domain}</span>
                  <span className="text-slate-500 font-mono">{item.count} Projects ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-diu-blue to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Pipeline Stages: 6 Cols */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Ongoing vs. Completed Pipeline</span>
                </h2>
                <p className="text-[11px] text-slate-500">Distribution across 5 academic lifecycle phases</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Phase 1: Topic Proposal & Defense</span>
                  <span className="text-[11px] text-slate-400">Formal presentation and topic registration</span>
                </div>
                <span className="text-sm font-extrabold text-blue-600 px-2.5 py-1 bg-blue-50 rounded-xl">
                  {analytics.project_stages.proposal_stage} Projects
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Phase 2: Literature Review</span>
                  <span className="text-[11px] text-slate-400">Taxonomy and research gap synthesis</span>
                </div>
                <span className="text-sm font-extrabold text-indigo-600 px-2.5 py-1 bg-indigo-50 rounded-xl">
                  {analytics.project_stages.literature_review} Projects
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Phase 3 & 4: Development & Testing</span>
                  <span className="text-[11px] text-slate-400">Model training, evaluation, and ablation study</span>
                </div>
                <span className="text-sm font-extrabold text-purple-600 px-2.5 py-1 bg-purple-50 rounded-xl">
                  {analytics.project_stages.development_prototype} Projects
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Phase 5: Pre-Defense & Completed Theses</span>
                  <span className="text-[11px] text-slate-400">Plagiarism cleared & defense approved archives</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-600 px-2.5 py-1 bg-emerald-50 rounded-xl">
                  {analytics.project_stages.completed} Archived
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-center justify-between mt-4">
            <span className="font-semibold">Pending Supervisor Reviews: {analytics.pending_supervisor_reviews} submissions</span>
            <span className="font-mono text-[11px] text-blue-700">{analytics.upcoming_milestones_count} Upcoming Deadlines</span>
          </div>
        </div>

      </div>

      {/* Supervisor Workload Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-diu-blue" />
              <span>Supervisor Workload & Capacity Utilization</span>
            </h2>
            <p className="text-[11px] text-slate-500">Real-time mentoring load across departmental faculty</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            {analytics.supervisor_workloads.length} Faculty Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Supervisor Name</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4 text-center">Assigned Teams</th>
                <th className="py-3 px-4 text-center">Max Capacity</th>
                <th className="py-3 px-4">Utilization</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.supervisor_workloads.map((s) => (
                <tr key={s.supervisor_id} className="hover:bg-slate-50/60 transition-colors font-medium">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {s.supervisor_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {s.designation}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-diu-blue">
                    {s.assigned_teams}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-500 font-mono">
                    {s.max_slots}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.utilization_percentage >= 100 ? 'bg-rose-500' :
                            s.utilization_percentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, s.utilization_percentage)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-600">{s.utilization_percentage}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                      s.status === 'Full'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : s.status === 'Near Capacity'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {s.status}
                    </span>
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

export default DepartmentalAnalyticsPage;
