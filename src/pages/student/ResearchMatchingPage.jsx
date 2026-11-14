import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  SlidersHorizontal,
  Briefcase,
  Layers,
  GraduationCap,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import module1Service from '../../services/module1Service';

export const ResearchMatchingPage = () => {
  const { currentUser, apiCall } = useAuth();
  const [studentInterests, setStudentInterests] = useState([]);
  const [preferredDomain, setPreferredDomain] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentPreferences();
  }, []);

  const loadStudentPreferences = async () => {
    setLoading(true);
    let interests = [];
    let domain = 'Natural Language Processing';

    try {
      const profile = await apiCall('/api/students/me');
      if (profile) {
        domain = profile.preferred_domain || domain;
        if (profile.interests && Array.isArray(profile.interests)) {
          interests = profile.interests.map(i => (typeof i === 'string' ? i : i.name));
        }
      }
    } catch {
      // Fallback preferences for student
      interests = ['Machine Learning', 'Natural Language Processing', 'Deep Learning'];
    }

    if (interests.length === 0) {
      interests = ['Machine Learning', 'Natural Language Processing', 'Deep Learning'];
    }

    setStudentInterests(interests);
    setPreferredDomain(domain);

    // Calculate matches with demonstration transparency
    const matchResults = module1Service.calculateMatches(interests, domain);
    setMatches(matchResults);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/student/dashboard" className="hover:text-diu-blue">Student Dashboard</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Research Matching</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="text-amber-500 stroke-[2.2]" size={26} />
            Research Interest & Topic Matching
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare your academic research preferences against faculty expertise and open thesis positions.
          </p>
        </div>

        <Link
          to="/supervisors"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          All Faculty Directory <ArrowRight size={14} />
        </Link>
      </div>

      {/* Explicit Demonstration Notice as Required by Prompt */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Demonstration Matching Interface (Simulation Mode)</p>
          <p className="text-amber-800 leading-relaxed">
            The compatibility indices and recommendations below are generated using demonstration heuristic weighting. Real-time statistical cosine similarity algorithms will be operational once final institutional embeddings are trained.
          </p>
        </div>
      </div>

      {/* Active Student Profile Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <GraduationCap size={15} className="text-diu-blue" />
            Your Academic Research Profile
          </h3>
          <Link to="/student/research-interests" className="text-xs font-bold text-diu-blue hover:underline">
            Update Your Preferences →
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Preferred Primary Domain:</span>
            <span className="font-bold text-slate-800 text-sm">{preferredDomain || 'Not declared'}</span>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-slate-400 block text-[11px] mb-1">Your Declared Topic Keywords:</span>
            <div className="flex flex-wrap gap-1.5">
              {studentInterests.map((interest, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-md bg-blue-50 text-diu-blue font-semibold text-xs border border-blue-200/50">
                  #{interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Matched Opportunities List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen size={18} className="text-diu-blue" />
          Suggested Faculty Opportunities & Thesis Topics ({matches.length})
        </h2>

        {matches.map(({ opportunity, score, domainMatch, matchingKeywords, isDemoScore }) => (
          <div
            key={opportunity.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-diu-blue border border-blue-200">
                  {opportunity.domain}
                </span>

                {domainMatch && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Domain Match
                  </span>
                )}

                <span className="text-[10px] font-semibold text-slate-400 font-mono">
                  Demo Score: {score}%
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 hover:text-diu-blue transition-colors">
                  {opportunity.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Faculty Supervisor: <strong>{opportunity.supervisorName}</strong> • {opportunity.department}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl line-clamp-2">
                {opportunity.description}
              </p>

              {/* Matching Keyword Badges */}
              {matchingKeywords && matchingKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700">Matching Keywords:</span>
                  {matchingKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Application Action */}
            <div className="flex flex-col sm:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
              <div className="text-right text-xs">
                <span className="text-slate-400 block text-[11px]">Available Capacity</span>
                <span className="font-bold text-diu-green">
                  {opportunity.availablePositions} slots open ({opportunity.studentType})
                </span>
              </div>

              <Link
                to={`/supervisors/${opportunity.supervisorId}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <span>View Supervisor & Apply</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Sparkles className="mx-auto text-slate-300 mb-3" size={36} />
            <h3 className="text-sm font-bold text-slate-700">No Matching Opportunities Available</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try updating your preferred research domains to see relevant faculty topics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchMatchingPage;
