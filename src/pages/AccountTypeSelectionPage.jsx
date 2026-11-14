import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Lock
} from 'lucide-react';
import DiuLogo from '../components/DiuLogo';

export const AccountTypeSelectionPage = () => {
  const accountTypes = [
    {
      id: 'student',
      title: 'Student Registration',
      subtitle: 'For Undergraduate FYP & Thesis Students',
      description: 'Create an academic student account to discover faculty supervisors, connect with intra-section team members, and track research milestones.',
      badge: 'Public Registration',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: GraduationCap,
      iconBg: 'bg-blue-50 text-diu-blue',
      btnText: 'Register as Student',
      btnLink: '/register/student',
      btnStyle: 'bg-diu-blue hover:bg-diu-accentBlue text-white shadow-md shadow-blue-500/20',
      features: [
        'Personal research domain preferences',
        'Intra-section teammate discovery',
        'Faculty supervisor request submission'
      ]
    },
    {
      id: 'supervisor',
      title: 'Supervisor Registration',
      subtitle: 'For DIU Faculty Members & Supervisors',
      description: 'Faculty self-registration portal to establish your academic supervision profile, declare research domains, publish thesis opportunities, and evaluate student requests.',
      badge: 'Faculty Portal',
      badgeColor: 'bg-blue-100 text-diu-blue border-blue-200',
      icon: Briefcase,
      iconBg: 'bg-emerald-50 text-diu-green',
      btnText: 'Register as Supervisor',
      btnLink: '/register/supervisor',
      btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20',
      features: [
        'Research expertise & keyword tagging',
        'Thesis topic & opportunity publishing',
        'Incoming student supervision request review'
      ]
    },
    {
      id: 'admin',
      title: 'Admin Portal Login',
      subtitle: 'For Departmental & Institutional Heads',
      description: 'Restricted management interface for program coordinators and administrators. Public registration is strictly disabled for security compliance.',
      badge: 'Institutional Access Only',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: ShieldCheck,
      iconBg: 'bg-purple-50 text-purple-600',
      btnText: 'Proceed to Admin Login',
      btnLink: '/admin/login',
      btnStyle: 'bg-slate-800 hover:bg-slate-900 text-white shadow-md shadow-slate-900/20',
      features: [
        'System-wide user & role administration',
        'Supervisor credential oversight',
        'No public registration (provisioned accounts only)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-white to-emerald-50/40 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-diu-blue transition-colors bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-2xs"
        >
          <ArrowLeft size={14} /> Back to Homepage
        </Link>
        <span className="text-xs text-slate-400 font-semibold tracking-wider">
          DAFFODIL INTERNATIONAL UNIVERSITY
        </span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="flex justify-center mb-2">
            <DiuLogo variant="light" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-diu-darkBlue tracking-tight">
            Choose Your Account Type
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Welcome to the ROSS-SEARCH Research Management Portal. Please select your official university role to proceed with account registration or administrative access.
          </p>
        </div>

        {/* 3 Option Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {accountTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div 
                key={type.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 p-7 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${type.iconBg} flex items-center justify-center shadow-xs`}>
                      <Icon size={24} className="stroke-[2.2]" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${type.badgeColor}`}>
                      {type.badge}
                    </span>
                  </div>

                  {/* Titles */}
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-diu-blue transition-colors">
                    {type.title}
                  </h2>
                  <p className="text-xs font-semibold text-diu-green mt-1">
                    {type.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {type.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                    {type.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-4">
                  <Link
                    to={type.btnLink}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${type.btnStyle}`}
                  >
                    <span>{type.btnText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Existing User Login Prompt */}
        <div className="text-center p-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-2xs max-w-md mx-auto">
          <p className="text-xs text-slate-600 font-medium">
            Already have an active student or supervisor account?{' '}
            <Link to="/login" className="text-diu-blue font-bold hover:underline">
              Sign In to Your Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelectionPage;
