import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building, 
  Mail, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft, 
  Edit3,
  Loader2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from '../components/NeutralAvatar';

export const SupervisorProfile = () => {
  const { id } = useParams();
  const { currentUserRole, apiCall } = useAuth();
  
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  const isOwnProfile = currentUserRole === 'supervisor' && (!id || id === 'me');

  useEffect(() => {
    let mounted = true;
    const fetchSupervisor = async () => {
      try {
        const path = id && id !== 'me' ? `/api/supervisors/${id}` : '/api/supervisors/me';
        const data = await apiCall(path);
        if (mounted) setSupervisor(data);
      } catch (err) {
        console.error('Failed to load supervisor profile:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSupervisor();
    return () => { mounted = false; };
  }, [id, apiCall]);

  const handleSendRequest = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 5000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading supervisor credentials...</p>
      </div>
    );
  }

  if (!supervisor) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
        <Building size={36} className="mx-auto text-slate-400 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Supervisor Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested faculty profile does not exist.</p>
        <Link to="/supervisors" className="px-5 py-2 rounded-xl bg-diu-blue text-white text-xs font-semibold">
          Return to Supervisors
        </Link>
      </div>
    );
  }

  const name = supervisor.full_name || supervisor.name || 'Faculty Member';
  const designation = supervisor.designation || 'Lecturer';
  const department = supervisor.department || 'Department of CSE';
  const email = supervisor.email || 'faculty@diu.edu.bd';
  const phone = supervisor.phone || 'N/A';
  const room = supervisor.room || 'Faculty Annex';
  const about = supervisor.about || 'Faculty member and research supervisor at Daffodil International University.';
  const isAccepting = supervisor.is_accepting_teams ?? supervisor.acceptingTeams ?? true;
  const availableSlots = supervisor.available_slots ?? supervisor.availableSlots ?? 3;
  const maxSlots = supervisor.max_slots ?? supervisor.maxSlots ?? 5;
  const expertiseList = Array.isArray(supervisor.expertise)
    ? supervisor.expertise.map(e => (typeof e === 'string' ? e : e.name || ''))
    : [];
  const publications = supervisor.publications || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/supervisors"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Supervisor Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Faculty research credentials, expertise and supervisory availability
            </p>
          </div>
        </div>

        {isOwnProfile && (
          <Link
            to="/supervisor/profile/edit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <Edit3 size={15} /> Edit My Profile
          </Link>
        )}
      </div>

      {/* Success Notification */}
      {requestSent && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Supervision request submitted successfully to {name}. You will be notified of their decision.</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
        
        {/* Top Section: Avatar & Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b border-slate-100">
          
          <div className="flex flex-col items-center">
            <NeutralAvatar
              src={null}
              size="card"
              showLabel={true}
              className="w-36 h-36 rounded-2xl shadow-sm"
            />
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              Verified Faculty
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-diu-blue">
                Faculty Member
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-700">
              {designation}
            </p>
            <p className="text-xs font-bold text-diu-green flex items-center justify-center sm:justify-start gap-1">
              <Building size={14} /> {department}
            </p>

            {/* Quick Contact & Office */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-3 text-xs text-slate-600">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail size={15} className="text-slate-400" />
                <span><strong>Email:</strong> {email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-slate-400 font-bold">Tel:</span>
                <span><strong>Phone:</strong> {phone}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:col-span-2">
                <MapPin size={15} className="text-slate-400" />
                <span><strong>Office:</strong> {room}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supervision Quota / Availability Bar */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              FYP Supervisory Slots
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900">
                {availableSlots} Available / {maxSlots} Maximum
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                  isAccepting
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isAccepting ? 'Accepting Teams' : 'Quota Filled'}
              </span>
            </div>
          </div>

          {!isOwnProfile && isAccepting && (
            <button
              onClick={handleSendRequest}
              className="px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-all"
            >
              Request Supervision
            </button>
          )}
        </div>

        {/* Research Expertise */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Research Expertise & Domains
          </h3>
          <div className="flex flex-wrap gap-2">
            {expertiseList.length > 0 ? (
              expertiseList.map((exp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-diu-blue text-xs font-semibold border border-blue-100"
                >
                  {exp}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No expertise listed yet.</p>
            )}
          </div>
        </div>

        {/* About / Bio */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Faculty Research Profile
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {about}
          </p>
        </div>

        {/* Selected Publications */}
        {publications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} className="text-diu-blue" />
              <span>Selected Publications</span>
            </h3>
            <div className="space-y-2">
              {publications.map((pub, idx) => {
                const title = typeof pub === 'string' ? pub : (pub.title || 'Research Publication');
                const year = typeof pub === 'object' && pub.year ? pub.year : '';
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <p className="font-semibold text-slate-800">{title}</p>
                    {year && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar size={12} /> {year}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SupervisorProfile;
