import React, { useState } from 'react';
import { Settings, Shield, Bell, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { currentUser, currentUserRole } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [proposalUpdates, setProposalUpdates] = useState(true);
  const [feedback, setFeedback] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setFeedback('Account preferences saved successfully.');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage system preferences, notification channels, and security settings
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Account Info */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">Signed In Account</h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">{currentUser?.full_name || 'Academic User'}</p>
              <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-diu-blue">
              {currentUserRole}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Notification Preferences</h2>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer select-none">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block">Email Notifications</span>
              <span className="text-[11px] text-slate-500">Receive alerts when team invites or supervisor messages arrive</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded text-diu-blue focus:ring-diu-blue h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer select-none">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block">Proposal Defense Reminders</span>
              <span className="text-[11px] text-slate-500">Automated deadline notices for DIU FYP Phase 1</span>
            </div>
            <input
              type="checkbox"
              checked={proposalUpdates}
              onChange={(e) => setProposalUpdates(e.target.checked)}
              className="rounded text-diu-blue focus:ring-diu-blue h-4 w-4"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Save Preferences
          </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsPage;
