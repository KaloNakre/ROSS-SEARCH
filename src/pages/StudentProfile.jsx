import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Building, 
  GraduationCap, 
  Edit3, 
  FolderKanban,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from '../components/NeutralAvatar';

export const StudentProfile = () => {
  const { currentUser, apiCall } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const data = await apiCall('/api/students/me');
        if (mounted) setProfile(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [apiCall]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading student profile...</p>
      </div>
    );
  }

  const fullName = profile?.full_name || currentUser?.full_name || 'Student';
  const studentId = profile?.student_id || 'N/A';
  const department = profile?.department || 'Department of CSE';
  const section = profile?.section || 'Not assigned';
  const batch = profile?.batch || 'N/A';
  const email = currentUser?.email || 'N/A';
  const phone = profile?.phone || 'Not provided';
  const bio = profile?.bio || 'Undergraduate student at Daffodil International University pursuing FYP / Thesis.';
  const projectTitle = profile?.project_title || 'No formal thesis title registered yet.';
  const interests = profile?.interests || [];

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
          
          <div className="flex flex-col items-center">
            <NeutralAvatar
              src={null}
              size="card"
              showLabel={true}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl shadow-sm"
            />
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              Academic ID Verified
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-slate-900">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-diu-blue">
                Undergraduate Student
              </span>
            </div>

            <p className="text-xs font-semibold text-diu-green flex items-center justify-center sm:justify-start gap-1">
              <Building size={14} /> {department}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-3 text-xs text-slate-600">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <GraduationCap size={15} className="text-slate-400" />
                <span><strong>Student ID:</strong> {studentId}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <FolderKanban size={15} className="text-slate-400" />
                <span><strong>Section:</strong> {section} ({batch})</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail size={15} className="text-slate-400" />
                <span><strong>Email:</strong> {email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-slate-400 font-bold">Tel:</span>
                <span><strong>Phone:</strong> {phone}</span>
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
            {interests.length > 0 ? (
              interests.map((interest, idx) => {
                const name = typeof interest === 'string' ? interest : interest.name;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-diu-blue text-xs font-medium border border-blue-100"
                  >
                    <Sparkles size={12} />
                    <span>{name}</span>
                  </span>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">
                No research domains selected yet. Click "Update Preferences" to define your topics.
              </p>
            )}
          </div>
        </div>

        {/* Project Title & Bio */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Registered Thesis Topic
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-800 font-medium">
                {projectTitle}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Academic Background & Bio
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed">
                {bio}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
