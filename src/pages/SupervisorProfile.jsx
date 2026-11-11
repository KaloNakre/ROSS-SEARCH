import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  Edit3,
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from '../components/NeutralAvatar';

export const SupervisorProfile = () => {
  const { id } = useParams();
  const { supervisors, supervisorProfile, currentUserRole } = useAuth();
  const [requestSent, setRequestSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectProposalText, setProjectProposalText] = useState('');

  // Find supervisor by id, or default to first / current supervisor profile
  const supervisor = (id ? supervisors.find(s => s.id === id) : null) || supervisorProfile;

  const isOwnProfile = currentUserRole === 'supervisor' && (!id || id === supervisor.id);

  const handleSendRequest = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setShowModal(false);
    setTimeout(() => setRequestSent(false), 5000);
  };

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
          <span>Supervision request submitted successfully to {supervisor.name}. You will be notified of their decision.</span>
        </div>
      )}

      {/* Main Profile Card (Matches Screenshot Layout) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
        
        {/* Top Section: Avatar & Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b border-slate-100">
          
          {/* Neutral Empty Placeholder as in mockup ("No Image") */}
          <div className="flex flex-col items-center">
            <NeutralAvatar
              src={supervisor.profileImage}
              size="card"
              showLabel={!supervisor.profileImage}
              className="w-36 h-36 rounded-2xl shadow-sm"
            />
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              {supervisor.profileImage ? "Custom Picture" : "No Profile Picture"}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {supervisor.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-diu-blue">
                Faculty Member
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-700">
              {supervisor.designation}
            </p>
            <p className="text-xs font-bold text-diu-green flex items-center justify-center sm:justify-start gap-1">
              <Building size={14} /> {supervisor.department}
            </p>

            {/* Quick Contact & Office */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-3 text-xs text-slate-600">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin size={15} className="text-slate-400" />
                <span>{supervisor.room || "Room 602, Academic Building 4"}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <GraduationCap size={15} className="text-slate-400" />
                <span>{supervisor.education || "Ph.D. in Computer Science & Engineering"}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail size={15} className="text-slate-400" />
                <span>{supervisor.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone size={15} className="text-slate-400" />
                <span>{supervisor.phone || "+880 1XXXXXXXXX"}</span>
              </div>
            </div>

            {/* Supervised Slots Indicator */}
            <div className="pt-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500">Supervision Slots:</span>
                <span className="font-bold text-slate-800">
                  {supervisor.availableSlots || 2} of {supervisor.maxSlots || 5} Available
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Research Expertise */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Research Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {supervisor.expertise.map((exp) => (
              <span
                key={exp}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-diu-blue text-xs font-semibold"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            About
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
            {supervisor.about || "A dedicated researcher in the field of Machine Learning and Artificial Intelligence, with numerous publications in top-tier journals."}
          </p>
        </div>

        {/* Key Publications */}
        {supervisor.publications && supervisor.publications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Selected Recent Publications
            </h3>
            <ul className="space-y-2">
              {supervisor.publications.map((pub, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-100"
                >
                  <BookOpen size={15} className="text-diu-blue shrink-0 mt-0.5" />
                  <span>{pub}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary Action Button (Matches Screenshot: "Contact Supervisor") */}
        {!isOwnProfile && (
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowModal(true)}
              disabled={supervisor.availableSlots === 0}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Send size={16} /> Contact Supervisor
            </button>
            {supervisor.availableSlots === 0 && (
              <p className="text-xs text-rose-500 mt-2">
                This faculty member has reached maximum supervision capacity for this academic semester.
              </p>
            )}
          </div>
        )}

      </div>

      {/* Contact / Supervision Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl animate-fadeIn space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Send Supervision Request to {supervisor.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Provide an overview of your team's proposed research topic and objectives.
              </p>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proposed Research Topic / Abstract
                </label>
                <textarea
                  rows={4}
                  required
                  value={projectProposalText}
                  onChange={(e) => setProjectProposalText(e.target.value)}
                  placeholder="Outline the problem domain, proposed solution, and initial objectives..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm"
                >
                  Submit Request
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

