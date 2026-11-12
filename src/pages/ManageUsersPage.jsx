import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ManageUsersPage = () => {
  const { apiCall } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [feedback, setFeedback] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/admin/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, userEmail, currentActive) => {
    try {
      await apiCall(`/api/admin/users/${userId}/toggle-active`, { method: 'PUT' });
      setFeedback(`User ${userEmail} account status toggled.`);
      await fetchUsers();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to toggle user status.');
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (confirm(`Are you sure you want to permanently delete user "${userEmail}" and all associated data?`)) {
      try {
        await apiCall(`/api/admin/users/${userId}`, { method: 'DELETE' });
        setFeedback(`User ${userEmail} deleted successfully.`);
        await fetchUsers();
        setTimeout(() => setFeedback(''), 3000);
      } catch (err) {
        alert(err.message || 'Failed to delete user.');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const email = u.email || '';
    const name = u.full_name || u.student?.full_name || '';
    const matchSearch =
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
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
              Manage User Accounts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active account directory, role assignments, and system authorization
            </p>
          </div>
        </div>
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
            placeholder="Search by user email, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue"
          >
            <option value="All">All Roles</option>
            <option value="student">Students</option>
            <option value="supervisor">Supervisors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Registered Users ({filteredUsers.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-diu-blue animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Fetching accounts from server...</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">User / Identity</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Student ID / Details</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-diu-blue flex items-center justify-center font-bold text-xs uppercase">
                          {user.email.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.full_name || 'Academic User'}</p>
                          <p className="text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'supervisor'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {user.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {user.student ? `${user.student.student_id} (Sec ${user.student.section || 'N/A'})` : '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.email, user.is_active)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-semibold"
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
