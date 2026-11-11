import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft,
  BookOpen,
  Building,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, RESEARCH_DOMAINS } from '../data/mockData';

export const ManageSupervisorsPage = () => {
  const { supervisors, setSupervisors } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [feedback, setFeedback] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState(null);

  const [newSup, setNewSup] = useState({
    name: 'Dr. Full Name',
    designation: 'Assistant Professor',
    department: 'Department of CSE',
    room: 'Room 501, Academic Building 4',
    email: 'supervisor.new@diu.edu.bd',
    expertise: ['Machine Learning', 'Data Science'],
    availableSlots: 3,
    maxSlots: 5
  });

  const filteredSupervisors = supervisors.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchDept = selectedDept === 'All' || s.department.includes(selectedDept);
    return matchSearch && matchDept;
  });

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to remove ${name} from active supervisor directory?`)) {
      setSupervisors(prev => prev.filter(s => s.id !== id));
      setFeedback(`Removed ${name} from supervisor list.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `sup-${Date.now()}`,
      ...newSup,
      acceptingTeams: newSup.availableSlots > 0,
      about: "Faculty researcher at Daffodil International University.",
      publications: ["Selected Journal Publications in Computer Science, 2024"]
    };
    setSupervisors(prev => [created, ...prev]);
    setShowAddModal(false);
    setFeedback(`Added supervisor ${created.name} successfully.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleUpdateSupervisor = (e) => {
    e.preventDefault();
    if (!editingSupervisor) return;
    setSupervisors(prev => prev.map(s => s.id === editingSupervisor.id ? editingSupervisor : s));
    setEditingSupervisor(null);
    setFeedback(`Updated supervisor details successfully.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Supervisor Profiles & Expertise
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Maintain faculty research domains, supervisory quotas, and thesis assignments
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={15} /> Add Supervisor
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by faculty name, expertise, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-diu-blue"
          >
            <option value="All">All Departments</option>
            <option value="CSE">Department of CSE</option>
            <option value="SWE">Department of SWE</option>
          </select>
        </div>
      </div>

      {/* Supervisors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSupervisors.map((sup) => (
          <div
            key={sup.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{sup.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{sup.designation}</p>
                  <p className="text-xs font-bold text-diu-green">{sup.department}</p>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    sup.availableSlots > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {sup.availableSlots} Slots Left
                </span>
              </div>

              {/* Research Tags */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Assigned Domains & Expertise
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sup.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-blue-50 text-diu-blue text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 flex items-center justify-between">
                <span>Room / Office:</span>
                <span className="font-semibold text-slate-700">{sup.room}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link
                to={`/supervisors/${sup.id}`}
                className="text-xs text-diu-blue hover:underline font-semibold"
              >
                View Public Profile
              </Link>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingSupervisor({ ...sup })}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1"
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(sup.id, sup.name)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Remove supervisor"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Supervisor Modal */}
      {editingSupervisor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl animate-fadeIn space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Edit {editingSupervisor.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Update faculty title, room number, and supervision quotas.
              </p>
            </div>

            <form onSubmit={handleUpdateSupervisor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingSupervisor.name}
                  onChange={(e) => setEditingSupervisor({ ...editingSupervisor, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Available Slots</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editingSupervisor.availableSlots}
                    onChange={(e) => setEditingSupervisor({ ...editingSupervisor, availableSlots: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingSupervisor.maxSlots}
                    onChange={(e) => setEditingSupervisor({ ...editingSupervisor, maxSlots: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSupervisor(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supervisor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl animate-fadeIn space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add Faculty Supervisor</h3>
              <p className="text-xs text-slate-500 mt-1">
                Register a faculty profile for student research supervision.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supervisor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Full Name"
                  value={newSup.name}
                  onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <select
                    value={newSup.designation}
                    onChange={(e) => setNewSup({ ...newSup, designation: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newSup.department}
                    onChange={(e) => setNewSup({ ...newSup, department: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                  >
                    <option value="Department of CSE">Department of CSE</option>
                    <option value="Department of SWE">Department of SWE</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm"
                >
                  Register Supervisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSupervisorsPage;

