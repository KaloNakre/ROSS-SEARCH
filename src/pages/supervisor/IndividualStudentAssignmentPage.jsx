import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  BookOpen, 
  GraduationCap, 
  Briefcase,
  Users,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import module1Service from '../../services/module1Service';
import { useAuth } from '../../context/AuthContext';

export const IndividualStudentAssignmentPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [students, setStudents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 1. Load active opportunities
    const opps = module1Service.getOpportunities().filter(o => o.isPublished && o.status === 'Active');
    setOpportunities(opps);
    if (opps.length > 0) setSelectedOppId(String(opps[0].id));

    // 2. Load active assignments
    const currentAssignments = module1Service.getAssignments();
    setAssignments(currentAssignments);

    // 3. Load students from live API or fallback demo list
    try {
      const data = await apiCall('/api/students/?limit=50');
      const list = Array.isArray(data) ? data : (data?.items || []);
      if (list.length > 0) {
        setStudents(list);
        return;
      }
    } catch {}

    // Fallback demonstration students
    setStudents([
      { id: 1, student_id: '201-15-809', full_name: 'Robayet Islam', department: 'Department of CSE', cgpa: '3.88', preferred_domain: 'Natural Language Processing' },
      { id: 2, student_id: '201-15-313', full_name: 'Tamim Hasan Sami', department: 'Department of CSE', cgpa: '3.84', preferred_domain: 'Machine Learning' },
      { id: 3, student_id: '201-15-715', full_name: 'Riya Saha', department: 'Department of CSE', cgpa: '3.92', preferred_domain: 'Cyber Security' },
      { id: 4, student_id: '201-15-101', full_name: 'Tanvir Ahmed', department: 'Department of Software Eng.', cgpa: '3.76', preferred_domain: 'Data Science' },
      { id: 5, student_id: '201-15-102', full_name: 'Farhana Yasmin', department: 'Department of CSE', cgpa: '3.82', preferred_domain: 'Computer Vision' },
    ]);
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const isAlreadyAssigned = (studentId) => {
    return assignments.some(a => a.type === 'individual' && a.targetId === studentId && a.status === 'Active');
  };

  const getStudentCurrentAssignment = (studentId) => {
    return assignments.find(a => a.type === 'individual' && a.targetId === studentId && a.status === 'Active');
  };

  const filteredStudents = students.filter(s => {
    const name = s.full_name || s.name || '';
    const id = s.student_id || '';
    const dept = s.department || '';
    const query = searchTerm.toLowerCase();
    return name.toLowerCase().includes(query) || id.toLowerCase().includes(query) || dept.toLowerCase().includes(query);
  });

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      showFeedback('error', 'Please select an eligible student candidate.');
      return;
    }
    if (!selectedOppId) {
      showFeedback('error', 'Please select a research opportunity.');
      return;
    }

    const opp = opportunities.find(o => String(o.id) === String(selectedOppId));
    if (!opp) {
      showFeedback('error', 'Selected research opportunity could not be found.');
      return;
    }

    try {
      module1Service.assignIndividualStudent({
        student: selectedStudent,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        notes: assignmentNote.trim() || 'Assigned to individual thesis position.',
      });

      showFeedback('success', `Student ${selectedStudent.full_name} (${selectedStudent.student_id}) successfully assigned to "${opp.title}".`);
      setSelectedStudent(null);
      setAssignmentNote('');
      loadData();
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/supervisor/dashboard" className="hover:text-diu-blue">Supervisor Hub</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Individual Assignment</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserPlus className="text-diu-blue stroke-[2.2]" size={26} />
            Individual Student Assignment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Allocate approved undergraduate candidates to published research opportunities. Duplicate assignments are strictly blocked.
          </p>
        </div>

        <Link
          to="/supervisor/assignments"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          View All Assignments <ArrowRight size={14} />
        </Link>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Browser */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search students by name, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredStudents.map((st) => {
              const assigned = isAlreadyAssigned(st.student_id);
              const isSelected = selectedStudent?.student_id === st.student_id;
              const existingAssignment = getStudentCurrentAssignment(st.student_id);

              return (
                <div
                  key={st.id || st.student_id}
                  onClick={() => {
                    if (!assigned) setSelectedStudent(st);
                  }}
                  className={`p-4 rounded-2xl border transition-all ${
                    assigned 
                      ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-50/70 border-diu-blue shadow-sm ring-2 ring-diu-blue cursor-pointer'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{st.full_name || st.name}</h4>
                        <span className="text-xs text-slate-400 font-mono">({st.student_id})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{st.department}</p>
                      {st.preferred_domain && (
                        <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-diu-blue">
                          Domain: {st.preferred_domain}
                        </span>
                      )}
                    </div>

                    <div>
                      {assigned ? (
                        <div className="text-right">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 inline-block">
                            Already Assigned
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1 max-w-[140px] truncate" title={existingAssignment?.opportunityTitle}>
                            {existingAssignment?.opportunityTitle}
                          </p>
                        </div>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1 rounded-xl transition-colors ${
                          isSelected ? 'bg-diu-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Assignment Form Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sticky top-24 space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Briefcase size={18} className="text-diu-blue" />
              Assign to Research Opportunity
            </h3>

            {selectedStudent ? (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-diu-blue tracking-wider">Candidate Selected:</span>
                <p className="font-bold text-slate-900 text-sm">{selectedStudent.full_name || selectedStudent.name}</p>
                <p className="text-slate-600">ID: {selectedStudent.student_id} • {selectedStudent.department}</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center text-xs text-slate-400">
                Please select an eligible unassigned student from the left panel.
              </div>
            )}

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Research Opportunity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedOppId}
                  onChange={(e) => setSelectedOppId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                >
                  {opportunities.map(opp => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} ({opp.availablePositions} positions left)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assignment Terms & Initial Milestone Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Assigned to literature review phase. Submit proposal draft by week 4."
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldAlert size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Once assigned, the student cannot be assigned to another thesis without explicit unassignment.</span>
              </div>

              <button
                type="submit"
                disabled={!selectedStudent}
                className="w-full py-3 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={15} /> Confirm Individual Assignment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualStudentAssignmentPage;
