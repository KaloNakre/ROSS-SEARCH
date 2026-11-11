import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  Edit3, 
  Sparkles, 
  BookOpen, 
  FolderKanban,
  CheckCircle2,
  ImageOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from '../components/NeutralAvatar';

export const StudentProfile = () => {
  const { studentProfile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Academic credentials and research background for FYP & Thesis
          </p>
        </div>

        <Link
          to="/student/profile/edit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Edit3 size={15} /> Edit Profile
        </Link>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b border-slate-100">
          
          {/* Neutral Avatar / Uploaded Picture Container */}
          <div className="flex flex-col items-center">
            <NeutralAvatar
              src={studentProfile.profileImage}
              size="card"
              showLabel={!studentProfile.profileImage}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl shadow-sm"
            />
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              {studentProfile.profileImage ? "Custom Profile Photo" : "Neutral Placeholder"}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-slate-900">{studentProfile.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-diu-blue">
                Undergraduate Student
              </span>
            </div>

            <p className="text-xs font-semibold text-diu-green flex items-center justify-center sm:justify-start gap-1">
              <Building size={14} /> {studentProfile.department}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-3 text-xs text-slate-600">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <GraduationCap size={15} className="text-slate-400" />
                <span><strong>Student ID:</strong> {studentProfile.studentId}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <FolderKanban size={15} className="text-slate-400" />
                <span><strong>Section:</strong> {studentProfile.section} ({studentProfile.batch})</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail size={15} className="text-slate-400" />
                <span><strong>Email:</strong> {studentProfile.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone size={15} className="text-slate-400" />
                <span><strong>Phone:</strong> {studentProfile.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Research Expertise Section */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Research Interests & Domains
            </h3>
            <Link
              to="/student/research-interests"
              className="text-xs text-diu-blue font-semibold hover:underline"
            >
              Update Preferences &rarr;
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {studentProfile.interests && studentProfile.interests.length > 0 ? (
              studentProfile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-diu-blue text-xs font-semibold"
                >
                  {interest}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No research domains selected yet.</span>
            )}
          </div>
        </div>

        {/* About / Bio */}
        <div className="pt-6 space-y-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            About / Research Statement
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {studentProfile.bio || "No research statement provided yet."}
          </p>
        </div>

        {/* Current Project / Thesis Proposal */}
        <div className="pt-6 space-y-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Registered FYP / Thesis Topic
          </h3>
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
            <BookOpen size={18} className="text-diu-green shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {studentProfile.projectTitle || "Topic Title Pending Final Approval"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Domain: <strong className="text-diu-blue">{studentProfile.preferredDomain || "Machine Learning"}</strong> • Status: Registered
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;

