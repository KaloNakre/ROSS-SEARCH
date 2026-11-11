import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Sparkles, Save, ArrowLeft, CheckCircle2, Bookmark, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RESEARCH_DOMAINS } from '../data/mockData';

export const ResearchInterestsPage = () => {
  const navigate = useNavigate();
  const { studentProfile, updateStudentProfile } = useAuth();

  const [selectedInterests, setSelectedInterests] = useState(
    studentProfile.interests || ["Machine Learning", "Data Science"]
  );
  const [preferredDomain, setPreferredDomain] = useState(
    studentProfile.preferredDomain || "Machine Learning"
  );
  const [customInterest, setCustomInterest] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleInterest = (name) => {
    setSelectedInterests(prev => {
      if (prev.includes(name)) {
        return prev.filter(item => item !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customInterest.trim()) return;
    if (!selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests(prev => [...prev, customInterest.trim()]);
    }
    setCustomInterest('');
  };

  const handleSave = () => {
    updateStudentProfile({
      interests: selectedInterests,
      preferredDomain: preferredDomain
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      navigate('/student/profile');
    }, 1200);
  };

  // Group domains by category
  const categories = Array.from(new Set(RESEARCH_DOMAINS.map(d => d.category)));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/student/profile"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Research Interests & Domains
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select and prioritize your academic research areas for FYP/Thesis matching
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Save size={15} /> Save Interests
        </button>
      </div>

      {/* Success banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Research interests updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Primary Domain Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-diu-blue">
          <Bookmark size={18} />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Primary Research Domain
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          This primary domain will be prioritized when searching for suitable faculty supervisors.
        </p>

        <div className="max-w-md">
          <select
            value={preferredDomain}
            onChange={(e) => setPreferredDomain(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
          >
            {RESEARCH_DOMAINS.map(d => (
              <option key={d.id} value={d.name}>{d.name} ({d.category})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Select All Areas of Interest
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose as many domains as relevant. These tags will be displayed on your student profile.
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const domainsInCat = RESEARCH_DOMAINS.filter(d => d.category === category);
            return (
              <div key={category} className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {domainsInCat.map((domain) => {
                    const isSelected = selectedInterests.includes(domain.name);
                    return (
                      <button
                        key={domain.id}
                        type="button"
                        onClick={() => toggleInterest(domain.name)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-diu-blue text-white shadow-sm shadow-blue-500/20'
                            : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check size={14} className="stroke-[3]" />}
                        <span>{domain.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Domain Input */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Don't see your specific research area? Add custom topic:
          </label>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="e.g. Quantum Computing, Edge AI..."
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Currently Selected Summary */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Currently Selected ({selectedInterests.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-diu-blue text-xs font-medium border border-blue-100"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className="hover:text-rose-600 font-bold ml-1"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Save size={15} /> Save Interests & Return
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResearchInterestsPage;

