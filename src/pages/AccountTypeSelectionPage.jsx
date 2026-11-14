import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Lock,
  Layers,
  KeyRound
} from 'lucide-react';
import DiuLogo from '../components/DiuLogo';

export const AccountTypeSelectionPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* ── Background Cyber Grid & Mystic Ambient Glows ─────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── TOP HEADER: BACK TO HOME & MYSTIC ADMIN ICON ──────────────────── */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-20 pb-4">
        {/* Left: Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-800 shadow-md backdrop-blur-md"
        >
          <ArrowLeft size={14} /> Back to Public Home
        </Link>

        {/* Center: Brand Sub-Label */}
        <span className="hidden md:inline-flex text-[11px] font-mono tracking-widest text-slate-500 uppercase">
          Daffodil International University • ROSS-SEARCH
        </span>

        {/* Right: Mystic Admin Portal Icon Badge (As Requested by User) */}
        <Link
          to="/admin/login"
          title="Institutional Administrator Access"
          className="group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-purple-500/40 hover:border-purple-400 text-xs font-bold text-purple-300 transition-all shadow-lg shadow-purple-950/50 hover:scale-105 active:scale-95 backdrop-blur-md"
        >
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm group-hover:rotate-12 transition-transform">
            A
          </span>
          <span className="font-mono tracking-wider font-bold text-purple-200">ADMIN</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </Link>
      </header>

      {/* ── MAIN CONTENT: SIDE-BY-SIDE REGISTRATION CHOICES ──────────────── */}
      <main className="w-full max-w-5xl mx-auto my-auto z-20 py-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="flex justify-center mb-1">
            <DiuLogo variant="dark" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            <Sparkles size={13} className="text-blue-400" />
            <span>Select Your Role to Begin FYP & Thesis Journey</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Create Your Research Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Choose whether you are enrolling as an undergraduate student or registering as a university faculty supervisor.
          </p>
        </div>

        {/* ── 2 Balanced Side-by-Side Cards: Student & Supervisor ───────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: Student Registration */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-blue-500/30 hover:border-blue-400/80 p-8 flex flex-col justify-between shadow-2xl shadow-blue-950/40 transition-all hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <GraduationCap size={28} />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Student Portal
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
                Student Registration
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">
                For Undergraduate FYP & Thesis Students
              </p>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                Establish your student researcher profile, discover faculty supervisors, connect with intra-section team members, and manage thesis milestones.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Specify personal research domains & skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Search classmates & form intra-section teams</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  <span>Send direct supervision requests to faculty</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                to="/register/student"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group-hover:shadow-blue-500/50"
              >
                <span>Register as Student</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Supervisor Registration */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-emerald-500/30 hover:border-emerald-400/80 p-8 flex flex-col justify-between shadow-2xl shadow-emerald-950/40 transition-all hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-md">
                  <Briefcase size={28} />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Faculty Portal
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                Supervisor Registration
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1">
                For DIU Faculty Members & Project Supervisors
              </p>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                Faculty self-registration portal to establish your academic credentials, declare research interests, publish project opportunities, and evaluate student proposals.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Declare research expertise & publication tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Publish thesis openings with preview & quotas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Review & assign eligible students and teams</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                to="/register/supervisor"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group-hover:shadow-emerald-500/50"
              >
                <span>Register as Supervisor</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* ── FOOTER: SIGN IN LINK ───────────────────────────────────────────── */}
      <footer className="w-full max-w-4xl mx-auto text-center z-20 pt-6 border-t border-slate-800/80">
        <p className="text-xs text-slate-400">
          Already have an existing student or faculty account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
            Sign In Here
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default AccountTypeSelectionPage;
