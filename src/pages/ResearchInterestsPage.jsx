import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Sparkles, Save, ArrowLeft, CheckCircle2, Bookmark, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RESEARCH_DOMAINS } from '../data/mockData';

export const ResearchInterestsPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [availableInterests, setAvailableInterests] = useState([]);
  const [selectedInterestIds, setSelectedInterestIds] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchInterests = async () => {
      try {
        const [allRes, meRes] = await Promise.allSettled([
          apiCall('/api/research/interests'),
          apiCall('/api/students/me')
        ]);

        if (mounted) {
          let interestsList = [];
          if (allRes.status === 'fulfilled' && Array.isArray(allRes.value)) {
            interestsList = allRes.value;
          }
          // If backend research interests list is empty, fallback to mockData references formatted as objects
          if (interestsList.length === 0) {
            interestsList = RESEARCH_DOMAINS.map(d => ({
              id: d.id,
              name: d.name,
              category: d.category
            }));
          }
          setAvailableInterests(interestsList);

          if (meRes.status === 'fulfilled' && meRes.value) {
            const current = meRes.value.interests || [];
            // Current interests can be objects with id or names
            const currentIds = current.map(item => (typeof item === 'object' ? item.id : item));
            setSelectedInterestIds(currentIds);
          }
        }
      } catch (err) {
        console.error('Failed to load interests:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInterests();
    return () => { mounted = false; };
  }, [apiCall]);

  const toggleInterest = (id) => {
    setSelectedInterestIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      // Backend expects { interest_ids: [...] } where ids are integers or IDs registered in DB
      // Convert to integers where valid
      const numericIds = selectedInterestIds.map(id => Number(id)).filter(id => !isNaN(id));
      await apiCall('/api/students/me/interests', {
        method: 'PUT',
        body: JSON.stringify({ interest_ids: numericIds })
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        navigate('/student/profile');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update research interests.');
    } finally {
      setSaving(false);
    }
  };

  // Group by category
  const categories = Array.from(new Set(availableInterests.map(d => d.category || 'General')));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading research domains catalog...</p>
      </div>
    );
  }

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
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          <span>Save Interests</span>
        </button>
      </div>

      {/* Success banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Research interests updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Error banner */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-800 text-xs font-bold animate-fadeIn">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Select Your Areas of Interest
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose topics that align with your thesis goals to find compatible supervisors and peers.
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const items = availableInterests.filter(d => (d.category || 'General') === category);
            return (
              <div key={category} className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {category}
                </span>

                <div className="flex flex-wrap gap-2">
                  {items.map((item) => {
                    const isSelected = selectedInterestIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-diu-blue text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                        }`}
                      >
                        {isSelected && <Check size={13} className="shrink-0 stroke-[3]" />}
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResearchInterestsPage;
