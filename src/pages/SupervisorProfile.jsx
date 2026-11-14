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
  Calendar,
  Phone,
  GraduationCap,
  Briefcase,
  Users,
  Send,
  X,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from '../components/NeutralAvatar';
import module1Service from '../services/module1Service';

export const SupervisorProfile = () => {
  const { id } = useParams();
  const { currentUserRole, apiCall } = useAuth();

  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [opportunities, setOpportunities] = useState([]);

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

    // Load active opportunities
    const allOpps = module1Service.getOpportunities().filter(o => o.isPublished && o.status === 'Active');
    setOpportunities(allOpps);
    if (allOpps.length > 0) setSelectedOpportunityId(String(allOpps[0].id));

    return () => { mounted = false; };
  }, [id, apiCall]);

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!requestMessage.trim()) return;

    const opp = opportunities.find(o => String(o.id) === String(selectedOpportunityId));

    module1Service.submitRequest({
      supervisorId: supervisor?.id || 1,
      opportunityId: opp ? opp.id : null,
      opportunityTitle: opp ? opp.title : 'General Supervision Inquiry',
      message: requestMessage.trim(),
    });

    setRequestModalOpen(false);
    setRequestSuccess(true);
    setRequestMessage('');
    setTimeout(() => setRequestSuccess(false), 5000);
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
  const designation = supervisor.designation || 'Assistant Professor';
  const department = supervisor.department || 'Department of Computer Science and Engineering';
  const email = supervisor.email || 'faculty@diu.edu.bd';
  const phone = supervisor.phone || '+880 1712 345678';
  const room = supervisor.room || 'Faculty Annex, Daffodil Smart City';
  const about = supervisor.about || 'Faculty member and research supervisor at Daffodil International University.';
  const education = supervisor.education || 'Ph.D. in Computer Science; M.Sc. in CSE';
  const isAccepting = supervisor.is_accepting_teams ?? supervisor.acceptingTeams ?? true;
  const availableSlots = supervisor.available_slots ?? supervisor.availableSlots ?? 3;
  const maxSlots = supervisor.max_slots ?? supervisor.maxSlots ?? 5;
  const profileImageUrl = supervisor.profile_image_url || null;

  const expertiseList = Array.isArray(supervisor.expertise)
    ? supervisor.expertise.map(e => (typeof e === 'string' ? e : e.name || ''))
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
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

        {isOwnProfile ? (
          <Link
            to="/supervisor/profile/edit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <Edit3 size={15} /> Edit My Profile
          </Link>
        ) : (
          currentUserRole === 'student' && (
            <button
              onClick={() => setRequestModalOpen(true)}
              disabled={!isAccepting || availableSlots <= 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
            >
              <Send size={15} /> Request Supervision
            </button>
          )
        )}
      </div>

      {/* Success Notification */}
      {requestSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Supervision request successfully submitted to {name}. Track status in your student dashboard.</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">

        {/* Top Section: Avatar & Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b border-slate-100">
          <div className="flex flex-col items-center">
            <NeutralAvatar
              src={profileImageUrl}
              size="card"
              showLabel={!profileImageUrl}
              className="w-36 h-36 rounded-2xl shadow-sm"
            />
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              Verified Faculty
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-diu-blue">
                {designation}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              {department}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" />
                <a href={`mailto:${email}`} className="hover:text-diu-blue">{email}</a>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-slate-400" />
                {phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                {room}
              </span>
            </div>
          </div>
        </div>

        {/* Supervision Slot Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Available Slots</span>
            <span className="text-2xl font-black text-diu-blue">{availableSlots}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">of {maxSlots} total</span>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0">
            <span className="text-xs text-slate-500 font-semibold block">Acceptance Status</span>
            <span className={`text-xs font-bold inline-block mt-2 px-3 py-1 rounded-full ${isAccepting && availableSlots > 0
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
              }`}>
              {isAccepting && availableSlots > 0 ? 'Accepting Candidates' : 'Slots Full'}
            </span>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0">
            <span className="text-xs text-slate-500 font-semibold block">Institution</span>
            <span className="text-xs font-bold text-slate-800 block mt-2">Daffodil Int. University</span>
          </div>
        </div>

        {/* Academic Qualifications */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <GraduationCap size={16} className="text-diu-blue" />
            Academic Qualifications
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            {education}
          </p>
        </div>

        {/* Biography */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FileText size={16} className="text-diu-blue" />
            Biography & Research Overview
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            {about}
          </p>
        </div>

        {/* Declared Research Expertise */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BookOpen size={16} className="text-diu-blue" />
            Research Expertise & Focus Domains
          </h3>
          <div className="flex flex-wrap gap-2">
            {expertiseList.length > 0 ? (
              expertiseList.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-diu-blue border border-blue-200/60"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No specific research tags registered yet.</span>
            )}
          </div>
        </div>

        {/* Open Opportunities by this Faculty */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Briefcase size={16} className="text-diu-blue" />
            Published Thesis Opportunities
          </h3>
          <div className="space-y-2.5">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-diu-blue">
                    {opp.domain}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs mt-1">{opp.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{opp.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-diu-green block">
                    {opp.availablePositions}/{opp.maxCapacity} slots open
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Deadline: {opp.applicationDeadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUPERVISION REQUEST MODAL */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-diu-blue">
                  Student Supervision Application
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Request Supervision from {name}
                </h3>
              </div>
              <button onClick={() => setRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Target Thesis Opportunity
                </label>
                <select
                  value={selectedOpportunityId}
                  onChange={(e) => setSelectedOpportunityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                >
                  {opportunities.map(opp => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} ({opp.domain})
                    </option>
                  ))}
                  <option value="">General Research Supervision (Self-Proposed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supervision Statement & Research Motivation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain why you wish to conduct your thesis under this supervisor's mentorship, your previous projects, and your proposed research topic..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send size={14} /> Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorProfile;
