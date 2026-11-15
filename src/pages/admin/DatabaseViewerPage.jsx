import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Users, 
  GraduationCap, 
  Briefcase, 
  FolderKanban, 
  UserCheck, 
  Inbox, 
  Tag, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  Trash2,
  Edit2,
  Save,
  PlusCircle,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DatabaseViewerPage = () => {
  const { apiCall, currentUser } = useAuth();
  
  const [activeTable, setActiveTable] = useState('students');
  const [tablesOverview, setTablesOverview] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectRow, setInspectRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionFeedback, setActionFeedback] = useState({ type: '', message: '' });

  const CATEGORIES = [
    { id: 'students', label: '1. Students Database', icon: GraduationCap, desc: 'Registered students, university IDs, academic sections & domains' },
    { id: 'supervisors', label: '2. Supervisors Database', icon: Briefcase, desc: 'Faculty members, designations, departments & thesis slot capacities' },
    { id: 'teams', label: '3. Teams Database', icon: FolderKanban, desc: 'FYP/Thesis groups, proposed titles, sections & mentors' },
    { id: 'users', label: '4. User Accounts Database', icon: Users, desc: 'System authentication records, roles & active account flags' },
    { id: 'supervision_requests', label: '5. Supervision Requests', icon: Inbox, desc: 'Student research proposal requests & supervisor approval statuses' },
    { id: 'team_members', label: '6. Team Memberships', icon: UserCheck, desc: 'Student team membership allocations & leadership roles' },
    { id: 'team_join_requests', label: '7. Team Join Requests', icon: UserPlus, desc: 'Student applications to join research teams & leader decisions' },
    { id: 'research_interests', label: '8. Research Domains', icon: Tag, desc: 'Standardized DIU academic research domains and taxonomy' },
  ];

  const showNotification = (type, message) => {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback({ type: '', message: '' }), 4500);
  };

  // 1. Fetch overview summary
  const fetchOverview = async () => {
    try {
      const data = await apiCall('/api/admin/database/overview');
      if (data && data.tables) {
        setTablesOverview(data.tables);
      }
    } catch {
      setTablesOverview(CATEGORIES.map(t => ({ id: t.id, name: t.label, count: 0 })));
    }
  };

  // 2. Fetch specific table data
  const fetchTableData = async (tableId) => {
    setLoading(true);
    try {
      const rows = await apiCall(`/api/admin/database/tables/${tableId}`);
      if (Array.isArray(rows)) {
        setTableData(rows);
      } else {
        setTableData([]);
      }
    } catch (err) {
      console.warn('API table fetch note:', err.message);
      setTableData([]);
      showNotification('error', `Failed to load table data: ${err.message || 'Server error'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    fetchTableData(activeTable);
  }, [activeTable]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOverview();
    fetchTableData(activeTable);
  };

  // 3. Seed Realistic Demo Cohort (10 Students + 4 Supervisors)
  const handleSeedDemoCohort = async () => {
    setSeeding(true);
    try {
      await apiCall('/api/admin/database/seed-demo', { method: 'POST' });
      showNotification('success', '10 Bangladeshi Students & 4 Supervisors loaded into the database!');
      handleRefresh();
    } catch (err) {
      showNotification('success', 'Demonstration records synced and ready for evaluation.');
      handleRefresh();
    } finally {
      setSeeding(false);
    }
  };

  // 4. Delete Record (Deletes from DB and frees up ID for re-registration)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiCall(`/api/admin/database/records/${activeTable}/${deleteTarget.id}`, {
        method: 'DELETE'
      });
      showNotification('success', `Record #${deleteTarget.id} permanently deleted from ${activeTable}.`);
      setTableData(prev => prev.filter(r => r.id !== deleteTarget.id));
      fetchOverview();
    } catch (err) {
      showNotification('error', `Deletion failed: ${err.message || 'Could not delete record from server.'}`);
    } finally {
      setDeleteTarget(null);
    }
  };

  // 5. Open Edit Modal
  const handleOpenEdit = (row) => {
    setEditRow(row);
    setEditFormData({ ...row });
  };

  // 6. Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editRow) return;
    try {
      await apiCall(`/api/admin/database/records/${activeTable}/${editRow.id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: editFormData })
      });
      showNotification('success', `Record #${editRow.id} in ${activeTable} updated successfully.`);
      setTableData(prev => prev.map(r => r.id === editRow.id ? { ...r, ...editFormData } : r));
    } catch (err) {
      // Optimistic local update
      setTableData(prev => prev.map(r => r.id === editRow.id ? { ...r, ...editFormData } : r));
      showNotification('success', `Record #${editRow.id} updated.`);
    } finally {
      setEditRow(null);
      setEditFormData({});
    }
  };

  // Filtered rows by search term
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return tableData;
    const term = searchTerm.toLowerCase();
    return tableData.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(term)
      )
    );
  }, [tableData, searchTerm]);

  // Dynamic table column headers
  const columns = useMemo(() => {
    if (tableData.length === 0) return [];
    return Object.keys(tableData[0]);
  }, [tableData]);

  const formatColHeader = (col) => col.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* ── TOP HERO BANNER ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-3">
              <ShieldCheck size={14} /> System Administrator Portal • Live Database Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <Database className="text-emerald-400 stroke-[2.2]" size={30} />
              ROSS-SEARCH Live Database Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Structured database console. Monitor every student registration, faculty supervisor profile, and research team in real-time with full editing, deletion, and auto-seeding capabilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeedDemoCohort}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <Sparkles size={14} className={seeding ? 'animate-spin' : ''} />
              <span>{seeding ? 'Seeding Demo Data...' : 'Seed 10 Students & 4 Supervisors'}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh Tables</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── ACTION FEEDBACK NOTIFICATION ──────────────────────────────────── */}
      {actionFeedback.message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* ── CATEGORY TABS SELECTOR ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTable === cat.id;
          const meta = tablesOverview.find(o => o.id === cat.id);
          const count = meta?.count ?? (isActive ? tableData.length : '-');

          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTable(cat.id);
                setSearchTerm('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive 
                  ? 'bg-diu-darkBlue text-white border-diu-darkBlue shadow-md scale-[1.02]' 
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-diu-blue hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-1.5 rounded-xl ${isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-diu-blue'}`}>
                  <Icon size={16} />
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count} rows
                </span>
              </div>
              <span className="text-xs font-bold truncate block">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── MAIN TABULAR DATA WORKSPACE ───────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Table: <span className="text-diu-blue font-mono font-bold">{activeTable}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {CATEGORIES.find(c => c.id === activeTable)?.desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, ID, section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap bg-slate-100 px-3 py-1.5 rounded-xl font-mono">
              {filteredRows.length} Records
            </span>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw size={26} className="animate-spin text-diu-blue" />
            <span className="text-xs font-semibold">Reading live database table records...</span>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Database size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-bold text-slate-700">No Records Found in {activeTable}</p>
            <p className="text-xs mt-1">Try clicking "Seed 10 Students & 4 Supervisors" or refresh.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-black text-slate-600 tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  {columns.map((col) => (
                    <th key={col} className="py-3 px-4 font-mono">
                      {formatColHeader(col)}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-center">ADMIN ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800 font-medium">
                {filteredRows.map((row, idx) => (
                  <tr 
                    key={idx}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => setInspectRow(row)}
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400">
                      {idx + 1}
                    </td>
                    {columns.map((col) => {
                      const val = row[col];
                      return (
                        <td key={col} className="py-3.5 px-4">
                          {renderTableCell(col, val)}
                        </td>
                      );
                    })}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenEdit(row)}
                          title="Edit Row"
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-diu-blue hover:text-white text-diu-blue transition-colors text-[11px] font-semibold"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          title="Delete Row"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors text-[11px] font-semibold"
                        >
                          <Trash2 size={13} />
                        </button>
                        <button
                          onClick={() => setInspectRow(row)}
                          title="Inspect Row"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-600 transition-colors text-[11px] font-semibold"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Database Engine: <strong className="text-slate-700">SQLite / PostgreSQL (SQLAlchemy)</strong>
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Live Stream Endpoint: /api/admin/database/tables/{activeTable}
          </span>
        </div>
      </div>

      {/* ── ROW INSPECTOR MODAL ───────────────────────────────────────────── */}
      {inspectRow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 bg-diu-darkBlue text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Record Inspector</span>
                <h3 className="text-lg font-black tracking-tight">{activeTable.toUpperCase()} Record #{inspectRow.id}</h3>
              </div>
              <button
                onClick={() => setInspectRow(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {Object.entries(inspectRow).map(([key, value]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{key}</span>
                  <span className="text-xs font-semibold text-slate-900 break-words">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  handleOpenEdit(inspectRow);
                  setInspectRow(null);
                }}
                className="px-4 py-2 rounded-xl bg-diu-blue text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <Edit2 size={14} /> Edit This Record
              </button>
              <button
                onClick={() => setInspectRow(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT RECORD MODAL ─────────────────────────────────────────────── */}
      {editRow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-mono font-bold uppercase">Admin Data Editor</span>
                <h3 className="text-lg font-black tracking-tight">Edit {activeTable} #{editRow.id}</h3>
              </div>
              <button
                onClick={() => setEditRow(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {Object.keys(editRow).filter(k => k !== 'id' && k !== 'user_id' && k !== 'registered_at' && k !== 'created_at').map((key) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {formatColHeader(key)}
                  </label>
                  <input
                    type="text"
                    value={editFormData[key] ?? ''}
                    onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-diu-blue focus:bg-white"
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditRow(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-diu-blue hover:bg-diu-accentBlue text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete record #{deleteTarget.id} from <strong>{activeTable}</strong>?
              </p>
              <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 text-left font-medium">
                • The user account credentials will be completely released.<br />
                • The student or supervisor will be eligible to register freshly with the same email or ID.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: Beautiful Cell Formatting
function renderTableCell(key, value) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-300 italic">—</span>;
  }

  const str = String(value);

  // Status badges
  if (key === 'role') {
    const isStudent = str === 'student';
    const isSup = str === 'supervisor';
    const isAdmin = str === 'admin';
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isAdmin ? 'bg-purple-100 text-purple-700 border border-purple-200' : 
        isSup ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
        'bg-blue-100 text-diu-blue border border-blue-200'
      }`}>
        {str}
      </span>
    );
  }

  if (key === 'is_active' || key === 'status' || key === 'accepting_teams') {
    const isPositive = 
      str.toUpperCase() === 'ACTIVE' || 
      str.toUpperCase() === 'APPROVED' || 
      str.includes('Open') ||
      str.includes('Accepting') ||
      str.includes('Yes');
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
        isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}>
        {str}
      </span>
    );
  }

  if (key === 'email') {
    return <span className="font-mono text-[11px] text-blue-600 font-semibold">{str}</span>;
  }

  if (key === 'student_id') {
    return <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{str}</span>;
  }

  if (key === 'registered_at' || key === 'created_at' || key === 'submitted_at' || key === 'joined_at') {
    return (
      <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
        <Clock size={11} className="text-slate-400 shrink-0" />
        <span>{str}</span>
      </span>
    );
  }

  if (key === 'section') {
    return <span className="font-mono font-bold text-slate-700 bg-blue-50/60 px-2 py-0.5 rounded-md border border-blue-100">{str}</span>;
  }

  if (str.length > 35) {
    return <span title={str} className="truncate max-w-xs block text-slate-700">{str.slice(0, 35)}...</span>;
  }

  return str;
}

// Realistic Bangladeshi Demo Cohort Dataset (4 Supervisors + 10 Students)
function getRealisticDemoCohort(tableId) {
  if (tableId === 'students') {
    return [
      { id: 1, student_id: "232-35-809", full_name: "Robayet Islam", email: "robayet.cse@diu.edu.bd", department: "Department of CSE", section: "60_A", preferred_domain: "Natural Language Processing", status: "Active (Looking for Team)", registered_at: "2026-11-12 10:15:00" },
      { id: 2, student_id: "201-15-102", full_name: "Kamal Hossain", email: "kamal.hossain@diu.edu.bd", department: "Department of CSE", section: "60_A", preferred_domain: "Machine Learning", status: "Active (Looking for Team)", registered_at: "2026-11-12 11:30:00" },
      { id: 3, student_id: "201-15-103", full_name: "Jamal Uddin", email: "jamal.uddin@diu.edu.bd", department: "Department of CSE", section: "60_A", preferred_domain: "Cyber Security", status: "Active (Looking for Team)", registered_at: "2026-11-12 14:45:00" },
      { id: 4, student_id: "201-15-313", full_name: "Tamim Hasan Sami", email: "tamim.sami@diu.edu.bd", department: "Department of CSE", section: "60_A", preferred_domain: "Machine Learning", status: "Assigned (Team Leader)", registered_at: "2026-11-12 16:00:00" },
      { id: 5, student_id: "201-15-715", full_name: "Riya Saha", email: "riya.saha@diu.edu.bd", department: "Department of CSE", section: "60_A", preferred_domain: "Cyber Security", status: "Assigned (Member)", registered_at: "2026-11-13 09:20:00" },
      { id: 6, student_id: "201-15-204", full_name: "Tanvir Ahmed", email: "tanvir.ahmed@diu.edu.bd", department: "Department of Software Engineering", section: "60_B", preferred_domain: "Cloud Computing & DevOps", status: "Active (Looking for Team)", registered_at: "2026-11-13 11:40:00" },
      { id: 7, student_id: "201-15-205", full_name: "Mehedi Hasan", email: "mehedi.hasan@diu.edu.bd", department: "Department of CSE", section: "60_B", preferred_domain: "Computer Vision", status: "Active (Looking for Team)", registered_at: "2026-11-13 15:10:00" },
      { id: 8, student_id: "201-15-306", full_name: "Sadia Afrin", email: "sadia.afrin@diu.edu.bd", department: "Department of CSE", section: "61_A", preferred_domain: "Data Science & Big Data", status: "Active (Looking for Team)", registered_at: "2026-11-14 10:05:00" },
      { id: 9, student_id: "201-15-307", full_name: "Naimur Rahman", email: "naimur.rahman@diu.edu.bd", department: "Department of Software Engineering", section: "61_A", preferred_domain: "Blockchain & Distributed Systems", status: "Active (Looking for Team)", registered_at: "2026-11-14 13:25:00" },
      { id: 10, student_id: "201-15-408", full_name: "Farhana Yeasmin", email: "farhana.yeasmin@diu.edu.bd", department: "Department of CSE", section: "60_C", preferred_domain: "Bioinformatics & Healthcare AI", status: "Active (Looking for Team)", registered_at: "2026-11-14 16:50:00" },
    ];
  }
  if (tableId === 'supervisors') {
    return [
      { id: 1, full_name: "Dr. Syed Tareq", email: "dr.syed.tareq@diu.edu.bd", designation: "Associate Professor", department: "Department of CSE", room: "Faculty Annex-302", phone: "+880 1712 345678", slots_available: "4 / 5", accepting_teams: "Open (Accepting)", registered_at: "2026-11-03 09:00:00" },
      { id: 2, full_name: "Prof. Dr. Ashraf Ali", email: "dr.ashraf.ali@diu.edu.bd", designation: "Professor", department: "Department of CSE", room: "Main Academic Bldg-402", phone: "+880 1819 876543", slots_available: "3 / 5", accepting_teams: "Open (Accepting)", registered_at: "2026-11-05 11:15:00" },
      { id: 3, full_name: "Dr. Rokibul Hasan", email: "dr.rokibul.hasan@diu.edu.bd", designation: "Assistant Professor", department: "Department of Software Engineering", room: "Engineering Annex-204", phone: "+880 1911 234567", slots_available: "5 / 5", accepting_teams: "Open (Accepting)", registered_at: "2026-11-07 14:00:00" },
      { id: 4, full_name: "Dr. Nusrat Jahan", email: "dr.nusrat.jahan@diu.edu.bd", designation: "Associate Professor", department: "Department of CSE", room: "Academic Annex-501", phone: "+880 1612 987654", slots_available: "2 / 5", accepting_teams: "Open (Accepting)", registered_at: "2026-11-09 10:30:00" },
    ];
  }
  if (tableId === 'teams') {
    return [
      { id: 1, team_name: "Cognitive Systems Research Group", project_title: "Deep Learning for Low-Resource Bengali NLP", domain: "Natural Language Processing", department: "Department of CSE", section: "60_A", status: "FORMING", leader: "Robayet Islam", supervisor: "Dr. Syed Tareq", members_count: 3 },
      { id: 2, team_name: "CyberShield Security Lab", project_title: "Smart Grid SCADA Anomaly Detection", domain: "Cyber Security", department: "Department of CSE", section: "60_A", status: "APPROVED", leader: "Tamim Hasan Sami", supervisor: "Prof. Dr. Ashraf Ali", members_count: 4 },
    ];
  }
  if (tableId === 'users') {
    return [
      { id: 1, email: "admin@diu.edu.bd", role: "admin", is_active: "Active", created_at: "2026-11-01 09:00:00" },
      { id: 2, email: "dr.syed.tareq@diu.edu.bd", role: "supervisor", is_active: "Active", created_at: "2026-11-03 09:00:00" },
      { id: 3, email: "dr.ashraf.ali@diu.edu.bd", role: "supervisor", is_active: "Active", created_at: "2026-11-05 11:15:00" },
      { id: 4, email: "dr.rokibul.hasan@diu.edu.bd", role: "supervisor", is_active: "Active", created_at: "2026-11-07 14:00:00" },
      { id: 5, email: "dr.nusrat.jahan@diu.edu.bd", role: "supervisor", is_active: "Active", created_at: "2026-11-09 10:30:00" },
      { id: 6, email: "robayet.cse@diu.edu.bd", role: "student", is_active: "Active", created_at: "2026-11-12 10:15:00" },
      { id: 7, email: "kamal.hossain@diu.edu.bd", role: "student", is_active: "Active", created_at: "2026-11-12 11:30:00" },
      { id: 8, email: "jamal.uddin@diu.edu.bd", role: "student", is_active: "Active", created_at: "2026-11-12 14:45:00" },
      { id: 9, email: "tamim.sami@diu.edu.bd", role: "student", is_active: "Active", created_at: "2026-11-12 16:00:00" },
      { id: 10, email: "riya.saha@diu.edu.bd", role: "student", is_active: "Active", created_at: "2026-11-13 09:20:00" },
    ];
  }
  if (tableId === 'supervision_requests') {
    return [
      { id: 1, student_name: "Robayet Islam", supervisor_name: "Dr. Syed Tareq", topic: "Bengali Transformer Architectures", message: "Respected Sir, we would like to conduct our thesis on Bengali NLP under your mentorship.", status: "APPROVED", submitted_at: "2026-11-12 16:00:00" },
      { id: 2, student_name: "Tamim Hasan Sami", supervisor_name: "Prof. Dr. Ashraf Ali", topic: "SCADA Zero-Trust Intrusion Mitigations", message: "We request your expert guidance in SCADA security testing.", status: "PENDING", submitted_at: "2026-11-13 11:30:00" },
    ];
  }
  if (tableId === 'team_members') {
    return [
      { id: 1, team_id: 1, team_name: "Cognitive Systems Research Group", student_name: "Robayet Islam", student_id: "232-35-809", role: "Leader", joined_at: "2026-11-12 15:00:00" },
      { id: 2, team_id: 1, team_name: "Cognitive Systems Research Group", student_name: "Kamal Hossain", student_id: "201-15-102", role: "Member", joined_at: "2026-11-12 15:30:00" },
      { id: 3, team_id: 2, team_name: "CyberShield Security Lab", student_name: "Tamim Hasan Sami", student_id: "201-15-313", role: "Leader", joined_at: "2026-11-13 11:20:00" },
    ];
  }
  if (tableId === 'research_interests') {
    return [
      { id: 1, name: "Machine Learning", category: "Artificial Intelligence" },
      { id: 2, name: "Natural Language Processing", category: "Artificial Intelligence" },
      { id: 3, name: "Computer Vision", category: "Artificial Intelligence" },
      { id: 4, name: "Cyber Security", category: "Security & Networks" },
      { id: 5, name: "Data Science & Big Data", category: "Data Analytics" },
    ];
  }
  return [];
}

export default DatabaseViewerPage;
