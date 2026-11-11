import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Users, 
  BookOpen, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import DiuLogo from '../components/DiuLogo';

export const HomePage = () => {
  const featureCards = [
    {
      title: "Find Suitable Supervisor",
      desc: "Search faculty members by domain, expertise, and research publications.",
      icon: Search,
      link: "/supervisors",
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Find Your Research Team",
      desc: "Connect with eligible peer students in your section with matching domains.",
      icon: Users,
      link: "/teams/search",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Explore Research Resources",
      desc: "Access approved thesis guidelines, proposal templates, and paper archives.",
      icon: BookOpen,
      link: "/resources",
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Track Your Progress",
      desc: "Monitor proposal milestones, supervisor reviews, and defense timelines.",
      icon: TrendingUp,
      link: "/student/dashboard",
      color: "text-amber-600 bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        {/* Subtle Decorative Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-diu-blue text-xs font-semibold tracking-wide">
                <Sparkles size={14} className="text-diu-green" />
                <span>Official Daffodil International University Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-diu-darkBlue tracking-tight leading-tight">
                ROSS-SEARCH
              </h1>

              <p className="text-lg sm:text-xl text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A Research-Oriented Smart Search and Shared Knowledge Platform for FYP and Thesis Development.
              </p>

              <div className="text-sm font-semibold text-diu-green uppercase tracking-wider">
                Find • Connect • Collaborate • Achieve
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-diu-blue hover:bg-diu-accentBlue text-white text-base font-semibold shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center px-7 py-3.5 rounded-full border-2 border-diu-blue text-diu-blue hover:bg-blue-50 text-base font-semibold transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Column: Campus Photograph */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Image frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-slate-100 aspect-[4/3] group">
                  <img
                    src="/assets/diu_campus_building.png"
                    alt="Daffodil International University Permanent Campus"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-5">
                    <div>
                      <p className="text-white font-bold text-sm">DIU Permanent Campus</p>
                      <p className="text-blue-200 text-xs">Knowledge & Innovation Hub, Ashulia</p>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border border-slate-100 py-2.5 px-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-diu-green">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">FYP & Thesis</span>
                    <span className="block text-[11px] text-slate-500">Academic Portal</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Feature Highlights as in mockup */}
          <div className="mt-16 pt-8 border-t border-slate-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((feat) => {
                const Icon = feat.icon;
                return (
                  <Link
                    key={feat.title}
                    to={feat.link}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-diu-blue/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${feat.color}`}>
                        <Icon size={24} />
                      </div>
                      <h3 className="font-bold text-base text-slate-800 group-hover:text-diu-blue transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-diu-blue">
                      <span>Explore</span>
                      <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* Decorative Wave at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none opacity-40">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full text-blue-100 fill-current">
            <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* About & Features Detail Section */}
      <section id="about" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-diu-green">
              Empowering Student Research
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Why ROSS-SEARCH for Daffodil International University?
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Final Year Projects (FYP) and Undergraduate Theses require systematic collaboration, timely supervisor guidance, and verified domain alignment. ROSS-SEARCH streamlines the journey from concept to defense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-diu-blue flex items-center justify-center mb-4">
                <Search size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-base mb-2">
                Domain-Centric Supervisor Search
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter prospective thesis supervisors by specific research expertise such as Deep Learning, Cyber Security, or Robotics without navigating disjointed departmental portals.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-diu-green flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-base mb-2">
                Intra-Section Teammate Matching
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Locate classmates in the same academic section who share your research interests, helping you form cohesive and compliant 3-to-5 member project teams.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-base mb-2">
                Privacy-Preserving UI & RBAC
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adheres strictly to student data protection standards. Profiles utilize neutral representations until users deliberately opt to update their verified academic details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-diu-darkBlue text-slate-300 py-12 border-t border-blue-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <DiuLogo variant="dark" />
            </div>
            <p className="text-xs text-slate-400 text-center md:text-right">
              Daffodil Smart City, Ashulia, Dhaka, Bangladesh<br />
              Daffodil International University (DIU)
            </p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} ROSS-SEARCH. Built for Daffodil International University.</p>
            <div className="flex gap-6">
              <Link to="/login" className="hover:text-white transition-colors">Portal Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Student Registration</Link>
              <Link to="/supervisors" className="hover:text-white transition-colors">Supervisor Directory</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

