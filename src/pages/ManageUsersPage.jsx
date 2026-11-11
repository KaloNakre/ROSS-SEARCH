import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Shield, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Edit2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NeutralAvatar from '../components/NeutralAvatar';
import { SECTIONS, DEPARTMENTS } from '../data/mockData';

export const ManageUsersPage = () => {
  const { students, setStudents } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [feedback, setFeedback] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    studentId: '',
    department: DEPARTMENTS[0],
    section: '60_A',
    email: '',
    interests: ['Machine Learning']
  });

  const filteredStudents = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSection = selectedSection === 'All' || s.section === selectedSection;
    const matchDept = selectedDept === 'All' || s.department.includes(selectedDept);
    return matchSearch && matchSection && matchDept;
  });

  const handleToggleStatus = (id, name) => {
    setFeedback(`Toggled active access status for ${name}.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDeleteUser = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      setFeedback(`User ${name} removed from system.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.studentId.trim()) return;

    const created = {
      id: `stu-${Date.now()}`,
      name: newUser.name,
      studentId: newUser.studentId,
      department: newUser.department,
      section: newUser.section,
      batch: '60th',
      email: newUser.email || `${newUser.studentId.toLowerCase()}@s.diu.edu.bd`,
      phone: '+880 1XXXXXXXXX',
      interests: newUser.interests,
      preferredTopic: 'General Computer Science',
      teamStatus: 'Looking for Team',
      bio: 'New student enrolled for FYP/Thesis.'
    };

    setStudents(prev => [created, ...prev]);
    setShowAddModal(false);
    setNewUser({
      name: '',
      studentId: '',
      department: DEPARTMENTS[0],
      section: '60_A',
      email: '',
      interests: ['Machine Learning']
    });
    setFeedback(`Added ${created.name} successfully.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
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
              Manage Students and Users
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify student registrations, section assignments, and system accounts
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus size={15} /> Add Student / User
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
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <div className="sm:col-span-6 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by student candidate name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-diu-blue"
            >
              <option value="All">All Sections</option>
              {SECTIONS.map(s => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-diu-blue"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="SWE">SWE</option>
            </select>
          </div>

        </div>
      </div>

      {/* Users Table / List Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Registered Students ({filteredStudents.length})
          </h2>
          <span className="text-xs text-slate-400">
            Adhering to strict student privacy rules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Candidate / User</th>
                <th className="py-3.5 px-6">ID & Email</th>
                <th className="py-3.5 px-6">Department & Section</th>
                <th className="py-3.5 px-6">Team Status</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <NeutralAvatar size="sm" className="rounded-lg shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">{stu.name}</span>
                      <span className="text-[11px] text-slate-400">Undergraduate</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-700 block">{stu.studentId}</span>
                    <span className="text-[11px] text-slate-400">{stu.email}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-800 font-medium block">{stu.department}</span>
                    <span className="text-[11px] text-diu-blue font-bold">Section {stu.section}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-diu-blue border border-blue-100">
                      {stu.teamStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(stu.id, stu.name)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-semibold"
                    >
                      Status
                    </button>
                    <button
                      onClick={() => handleDeleteUser(stu.id, stu.name)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl animate-fadeIn space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add Student Record</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter student placeholder details for academic FYP registration.
              </p>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Candidate G"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    placeholder="212-15-XXXX7"
                    value={newUser.studentId}
                    onChange={(e) => setNewUser({ ...newUser, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={newUser.section}
                    onChange={(e) => setNewUser({ ...newUser, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                  >
                    {SECTIONS.map(s => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
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
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;

