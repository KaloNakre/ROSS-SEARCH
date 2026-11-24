import React, { useState, useEffect } from 'react';
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
  FileText,
  Sparkles,
  Loader2,
  BookOpen,
  ExternalLink,
  Compass,
  FileCheck,
  HelpCircle,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { module2Service } from '../services/module2Service';

export const StudentDashboard = () => {
  const { currentUser, apiCall } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [myTeams, setMyTeams] = useState([]);
  const [supervisorCount, setSupervisorCount] = useState(0);
  const [libraryPapers, setLibraryPapers] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const [profileRes, teamsRes, supsRes, libraryRes] = await Promise.allSettled([
          apiCall('/api/students/me'),
          apiCall('/api/teams/my-teams'),
          apiCall('/api/supervisors/?limit=100'),
          token ? module2Service.getLibrary(token) : Promise.resolve([])
        ]);

        if (mounted) {
          if (profileRes.status === 'fulfilled') setStudentProfile(profileRes.value);
          if (teamsRes.status === 'fulfilled') setMyTeams(Array.isArray(teamsRes.value) ? teamsRes.value : []);
          if (supsRes.status === 'fulfilled') {
            const list = Array.isArray(supsRes.value) ? supsRes.value : (supsRes.value?.items || []);
            setSupervisorCount(list.length);
          }
          if (libraryRes.status === 'fulfilled') {
            setLibraryPapers(Array.isArray(libraryRes.value) ? libraryRes.value : []);
          }
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [apiCall]);

  const statCards = [
    {
      label: "Find Supervisors",
      value: supervisorCount,
      icon: Search,
      bgColor: "bg-blue-50/70",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      link: "/supervisors"
    },
    {
      label: "My Teams",
      value: myTeams.length,
      icon: Users,
      bgColor: "bg-emerald-50/70",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      link: "/teams/my-teams"
    },
    {
      label: "My Projects",
      value: myTeams.length > 0 ? myTeams.length : 0,
      icon: FolderKanban,
      bgColor: "bg-purple-50/70",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      link: "/teams/my-teams"
    },
    {
      label: "Active Status",
      value: currentUser?.is_active ? "Active" : "Pending",
      icon: Clock,
      bgColor: "bg-amber-50/70",
      textColor: "text-amber-600",
      borderColor: "border-amber-100",
      link: "/student/profile"
    }
  ];

  const quickActions = [
    {
      title: "AI Proposal Checker",
      desc: "Instant format compliance, missing sections & grammar scan",
      icon: FileCheck,
      path: "/proposal/check",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Project Submissions & Milestones",
      desc: "Upload files, version history and track supervisor feedback",
      icon: UploadCloud,
      path: "/project/submissions",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "AI Viva Preparation Simulator",
      desc: "Mock defense viva questions, rubric tips and model answers",
      icon: HelpCircle,
      path: "/student/viva-prep",
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Official DIU Templates",
      desc: "Download official PPT/DOCX proposal & thesis templates",
      icon: FileText,
      path: "/proposal/templates",
      color: "text-blue-600 bg-blue-50"
    },
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading your research workspace...</p>
      </div>
    );
  }

  const studentName = studentProfile?.full_name || currentUser?.full_name || 'Student';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-diu-blue text-xs font-semibold mb-2">
            <Sparkles size={13} /> Student Research Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, {studentName}!
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

        {/* Live Academic Guidelines Panel */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Academic Status & Guidelines</h2>
              <span className="text-xs text-slate-400">DIU Portal</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-100/60 text-diu-blue flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-800">
                    Account Verified & Active • {studentProfile?.department ? (studentProfile.department.includes('Computer Science') || studentProfile.department.includes('CSE') ? 'CSE Department' : studentProfile.department) : 'CSE Department'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Student ID: {studentProfile?.student_id || 'N/A'} | Section: {studentProfile?.section || 'Not assigned'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-800">
                    Team Membership ({myTeams.length} Active Team{myTeams.length === 1 ? '' : 's'})
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {myTeams.length > 0 ? myTeams[0].team_name : 'No active thesis group yet. Click Create Team to form one.'}
                  </p>
                </div>
              </div>
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

      {/* ── My AI Analyzed Research Papers & Reading Library ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1">
              <BookOpen size={13} /> Personal Research Repository
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              My AI Analyzed Research Papers & Reading Library
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Research papers you searched, downloaded, and analyzed with the AI Paper Summarizer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/research/discovery"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Search size={14} />
              <span>Discover Papers</span>
            </Link>
            <Link
              to="/research/summarizer"
              className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>Analyze New PDF</span>
            </Link>
          </div>
        </div>

        {libraryPapers.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-slate-100">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700 mb-1">No Analyzed Papers in Your Library Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Select your research domain in Academic Discovery, download open-access PDFs, and run multi-model AI analysis to populate your library.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/research/discovery"
                className="px-4 py-2 bg-diu-blue hover:bg-diu-dark text-white rounded-xl text-xs font-semibold"
              >
                Explore Domain Papers
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {libraryPapers.map((paper) => (
              <div
                key={paper.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 bg-white hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {paper.domain || "Computer Science"}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {paper.reading_status === 'completed' ? 'Analyzed' : 'Reading'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 mb-1">
                    {paper.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-2 line-clamp-1">
                    {paper.authors} {paper.year ? `(${paper.year})` : ''}
                  </p>

                  {paper.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 line-clamp-3 mb-3">
                      {paper.notes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {paper.pdf_url ? (
                    <a
                      href={paper.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>PDF Link</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">PDF Archived</span>
                  )}

                  <Link
                    to={`/research/summarizer?paperUrl=${encodeURIComponent(paper.pdf_url || '')}&title=${encodeURIComponent(paper.title)}`}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <span>Re-Analyze</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
