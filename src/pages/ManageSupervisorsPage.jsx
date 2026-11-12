import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../data/mockData';

export const ManageSupervisorsPage = () => {
  const { apiCall } = useAuth();
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [feedback, setFeedback] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingSupervisor, setAddingSupervisor] = useState(false);
  const [modalError, setModalError] = useState('');

  const [newSup, setNewSup] = useState({
    name: '',
    designation: 'Assistant Professor',
    department: 'Department of CSE',
    room: 'Room 501, Academic Building 4',
    email: '',
    password: '',
    expertise: 'Machine Learning, Data Science',
    availableSlots: 3,
    maxSlots: 5
  });

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/supervisors/?limit=100');
      const list = Array.isArray(data) ? data : (data?.items || []);
      setSupervisors(list);
    } catch (err) {
      console.error('Failed to load supervisors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setAddingSupervisor(true);
    setModalError('');
    try {
      const expertiseArr = newSup.expertise.split(',').map(s => s.trim()).filter(Boolean);
      await apiCall('/api/admin/supervisors', {
        method: 'POST',
        body: JSON.stringify({
          full_name: newSup.name,
          designation: newSup.designation,
          department: newSup.department,
          room: newSup.room,
          email: newSup.email,
          password: newSup.password,
          expertise: expertiseArr,
          available_slots: parseInt(newSup.availableSlots, 10),
          max_slots: parseInt(newSup.maxSlots, 10)
        })
      });

      setFeedback(`Added supervisor ${newSup.name} successfully.`);
      setShowAddModal(false);
      setNewSup({
        name: '',
        designation: 'Assistant Professor',
        department: 'Department of CSE',
        room: 'Room 501, Academic Building 4',
        email: '',
        password: '',
        expertise: 'Machine Learning, Data Science',
        availableSlots: 3,
        maxSlots: 5
      });
      await fetchSupervisors();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setModalError(err.message || 'Failed to register supervisor account.');
    } finally {
      setAddingSupervisor(false);
    }
  };

  const filteredSupervisors = supervisors.filter((s) => {
    const name = s.full_name || s.name || '';
    const dept = s.department || '';
    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'All' || dept.includes(selectedDept);
    return matchSearch && matchDept;
  });

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
              Manage Supervisor Profiles & Quotas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Maintain faculty research domains, supervisory quotas, and thesis assignments
            </p>
          </div>
        </div>

        <button
          onClick={() => { setShowAddModal(true); setModalError(''); }}
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
            placeholder="Search by faculty name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
          />
        </div>

        <div className="sm:w-56">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Supervisors Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Faculty Directory ({filteredSupervisors.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading faculty members...</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Faculty Member</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Supervisory Slots</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSupervisors.map((s) => {
                  const name = s.full_name || s.name || 'Faculty Member';
                  const designation = s.designation || 'Lecturer';
                  const dept = s.department || 'Department of CSE';
                  const isAccepting = s.is_accepting_teams ?? s.acceptingTeams ?? true;
                  const availableSlots = s.available_slots ?? s.availableSlots ?? 3;
                  const maxSlots = s.max_slots ?? s.maxSlots ?? 5;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <p className="font-bold text-slate-900">{name}</p>
                        <p className="text-slate-500">{designation}</p>
                      </td>
                      <td className="py-3.5 px-6 text-slate-700 font-medium">{dept}</td>
                      <td className="py-3.5 px-6 text-slate-700 font-semibold">
                        {availableSlots} / {maxSlots} Available
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isAccepting
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {isAccepting ? 'Available' : 'Full'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          to={`/supervisors/${s.id}`}
                          className="px-3 py-1 rounded-lg bg-blue-50 text-diu-blue hover:bg-diu-blue hover:text-white font-semibold transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Supervisor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl animate-fadeIn space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add Faculty Supervisor</h3>
              <p className="text-xs text-slate-500 mt-1">
                Register a faculty supervisor account on the live server database.
              </p>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Full Name"
                  value={newSup.name}
                  onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="supervisor@diu.edu.bd"
                    value={newSup.email}
                    onChange={(e) => setNewSup({ ...newSup, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Temporary password"
                    value={newSup.password}
                    onChange={(e) => setNewSup({ ...newSup, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newSup.designation}
                    onChange={(e) => setNewSup({ ...newSup, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newSup.department}
                    onChange={(e) => setNewSup({ ...newSup, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expertise (comma separated)</label>
                <input
                  type="text"
                  placeholder="Machine Learning, Computer Vision"
                  value={newSup.expertise}
                  onChange={(e) => setNewSup({ ...newSup, expertise: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                />
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
                  disabled={addingSupervisor}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {addingSupervisor && <Loader2 size={13} className="animate-spin" />}
                  <span>Save Supervisor</span>
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
