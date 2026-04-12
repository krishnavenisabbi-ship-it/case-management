import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Scale, Plus, Search, MoreVertical, Edit, Trash2, Link2,
  Briefcase, Clock, CheckCircle, Bell, LogOut, X, ChevronDown
} from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL || "";

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div
      className="bg-white border border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-150"
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-plex text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
            {label}
          </p>
          <p className="font-outfit text-3xl font-black">{value}</p>
        </div>
        <div className={`w-10 h-10 flex items-center justify-center ${accent || "bg-black"}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cls =
    status === "Open"
      ? "bg-[#002FA7] text-white"
      : "bg-black text-white";
  return (
    <span className={`${cls} px-2 py-1 text-xs font-bold uppercase tracking-wider inline-block`} data-testid="case-status-badge">
      {status}
    </span>
  );
}

function CaseModal({ isOpen, onClose, onSubmit, editData }) {
  const [form, setForm] = useState({
    case_number: "", petitioner_name: "", respondent_name: "",
    court_name: "", court_place: "", adjournment_date: "",
    step: "", status: "Open", client_email: "", client_phone: ""
  });

  useEffect(() => {
    if (editData) setForm({ ...editData });
    else setForm({
      case_number: "", petitioner_name: "", respondent_name: "",
      court_name: "", court_place: "", adjournment_date: "",
      step: "", status: "Open", client_email: "", client_phone: ""
    });
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fields = [
    { name: "case_number", label: "Case Number", placeholder: "CIV/2024/001", required: true },
    { name: "petitioner_name", label: "Petitioner Name", placeholder: "Enter petitioner name", required: true },
    { name: "respondent_name", label: "Respondent Name", placeholder: "Enter respondent name", required: true },
    { name: "court_name", label: "Court Name", placeholder: "e.g. High Court", required: true },
    { name: "court_place", label: "Place of Court", placeholder: "e.g. Chennai", required: true },
    { name: "adjournment_date", label: "Adjournment Date", type: "date", required: true },
    { name: "step", label: "Step", placeholder: "e.g. Hearing, Arguments", required: true },
    { name: "client_email", label: "Client Email (for notifications)", placeholder: "client@example.com" },
    { name: "client_phone", label: "Client Phone (for SMS)", placeholder: "+91XXXXXXXXXX" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" data-testid="case-modal">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-slide-in">
        <div className="sticky top-0 bg-white border-b border-black p-6 flex items-center justify-between z-10">
          <h2 className="font-outfit text-xl font-bold">{editData ? "Edit Case" : "Add New Case"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 transition-colors" data-testid="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block font-plex text-xs font-bold uppercase tracking-[0.15em] text-gray-600 mb-1.5">
                {f.label}
              </label>
              <input
                name={f.name}
                type={f.type || "text"}
                value={form[f.name] || ""}
                onChange={handleChange}
                placeholder={f.placeholder}
                required={f.required}
                data-testid={`input-${f.name}`}
                className="w-full border border-black bg-white px-3 py-2.5 text-sm font-plex focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>
          ))}
          <div>
            <label className="block font-plex text-xs font-bold uppercase tracking-[0.15em] text-gray-600 mb-1.5">
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                data-testid="input-status"
                className="w-full border border-black bg-white px-3 py-2.5 text-sm font-plex appearance-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 pointer-events-none text-gray-500" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              data-testid="save-case-btn"
              className="flex-1 bg-black text-white px-6 py-3 font-plex font-semibold text-sm hover:bg-black/90 transition-colors"
            >
              {editData ? "Update Case" : "Create Case"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-black text-black font-plex font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DropdownMenu({ caseItem, onEdit, onDelete, onCopyLink }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-1.5 hover:bg-gray-100 transition-colors" data-testid={`actions-btn-${caseItem.case_id}`}>
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-40">
            <button
              onClick={() => { onEdit(caseItem); setOpen(false); }}
              data-testid={`edit-btn-${caseItem.case_id}`}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-plex hover:bg-gray-50 transition-colors text-left"
            >
              <Edit className="w-4 h-4" /> Edit Case
            </button>
            <button
              onClick={() => { onCopyLink(caseItem); setOpen(false); }}
              data-testid={`share-btn-${caseItem.case_id}`}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-plex hover:bg-gray-50 transition-colors text-left"
            >
              <Link2 className="w-4 h-4" /> Copy Public Link
            </button>
            <button
              onClick={() => { onDelete(caseItem.case_id); setOpen(false); }}
              data-testid={`delete-btn-${caseItem.case_id}`}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-plex hover:bg-gray-50 text-red-600 transition-colors text-left"
            >
              <Trash2 className="w-4 h-4" /> Delete Case
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ total_cases: 0, open_cases: 0, closed_cases: 0, upcoming_adjournments: 0 });
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUser = useCallback(async () => {
    if (location.state?.user) { setUser(location.state.user); return; }
    try {
      const res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
      if (!res.ok) throw new Error();
      setUser(await res.json());
    } catch { navigate("/login", { replace: true }); }
  }, [navigate, location.state]);

  const fetchCases = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/cases`, { credentials: "include" });
      if (res.ok) setCases(await res.json());
    } catch {}
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/stats`, { credentials: "include" });
      if (res.ok) setStats(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchUser();
    fetchCases();
    fetchStats();
  }, [fetchUser, fetchCases, fetchStats]);

  const handleSaveCase = async (form) => {
    const isEdit = !!editData;
    const url = isEdit ? `${API}/api/cases/${editData.case_id}` : `${API}/api/cases`;
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModalOpen(false);
        setEditData(null);
        fetchCases();
        fetchStats();
        showToast(isEdit ? "Case updated" : "Case created");
      }
    } catch { showToast("Failed to save case", "error"); }
  };

  const handleDelete = async (caseId) => {
    if (!confirm("Delete this case?")) return;
    try {
      const res = await fetch(`${API}/api/cases/${caseId}`, { method: "DELETE", credentials: "include" });
      if (res.ok) { fetchCases(); fetchStats(); showToast("Case deleted"); }
    } catch { showToast("Failed to delete", "error"); }
  };

  const handleCopyLink = (item) => {
    const url = `${window.location.origin}/case/${item.share_token}`;
    navigator.clipboard.writeText(url);
    showToast("Public link copied to clipboard!");
  };

  const handleLogout = async () => {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    navigate("/login", { replace: true });
  };

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.case_number?.toLowerCase().includes(q) ||
      c.petitioner_name?.toLowerCase().includes(q) ||
      c.respondent_name?.toLowerCase().includes(q) ||
      c.court_name?.toLowerCase().includes(q) ||
      c.court_place?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white" data-testid="dashboard-page">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 text-sm font-plex font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border border-black ${toast.type === "error" ? "bg-red-50 text-red-800" : "bg-white text-black"}`} data-testid="toast-message">
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-black bg-white sticky top-0 z-40" data-testid="dashboard-header">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-outfit text-lg font-black tracking-tight hidden sm:block" data-testid="dashboard-title">
              CASE MANAGEMENT SYSTEM
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                {user.picture && (
                  <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-black" />
                )}
                <span className="font-plex text-sm font-medium hidden sm:inline" data-testid="user-name">{user.name}</span>
              </div>
            )}
            <button onClick={handleLogout} data-testid="logout-btn" className="flex items-center gap-2 px-4 py-2 border border-black text-sm font-plex font-medium hover:bg-black hover:text-white transition-colors duration-150">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10" data-testid="stats-grid">
          <StatCard label="Total Cases" value={stats.total_cases} icon={Briefcase} accent="bg-black" />
          <StatCard label="Open Cases" value={stats.open_cases} icon={Clock} accent="bg-[#002FA7]" />
          <StatCard label="Closed Cases" value={stats.closed_cases} icon={CheckCircle} accent="bg-black" />
          <StatCard label="Upcoming Hearings" value={stats.upcoming_adjournments} icon={Bell} accent="bg-[#002FA7]" />
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-outfit text-2xl font-bold tracking-tight">Cases</h2>
            <p className="font-plex text-sm text-gray-500">{filtered.length} case{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cases..."
                data-testid="search-input"
                className="w-full sm:w-64 border border-black pl-9 pr-3 py-2 text-sm font-plex focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>
            <button
              onClick={() => { setEditData(null); setModalOpen(true); }}
              data-testid="add-case-btn"
              className="flex items-center gap-2 bg-black text-white px-5 py-2 font-plex font-semibold text-sm hover:bg-black/90 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Case
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-black" data-testid="cases-table">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-black">
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">S.No</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Case Number</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Petitioner</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Respondent</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Court</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Place</th>
                <th className="px-4 py-3 text-right font-plex text-xs font-bold uppercase tracking-wider text-black">Adjournment</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Step</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Status</th>
                <th className="px-4 py-3 text-right font-plex text-xs font-bold uppercase tracking-wider text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-16 text-center font-plex text-sm text-gray-400">
                    {cases.length === 0 ? "No cases yet. Click 'Add Case' to get started." : "No matching cases found."}
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.case_id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors" data-testid={`case-row-${c.case_id}`}>
                    <td className="px-4 py-3 text-sm font-plex text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold" data-testid={`case-number-${c.case_id}`}>{c.case_number}</td>
                    <td className="px-4 py-3 text-sm font-plex">{c.petitioner_name}</td>
                    <td className="px-4 py-3 text-sm font-plex">{c.respondent_name}</td>
                    <td className="px-4 py-3 text-sm font-plex">{c.court_name}</td>
                    <td className="px-4 py-3 text-sm font-plex">{c.court_place}</td>
                    <td className="px-4 py-3 text-sm font-mono text-right">{c.adjournment_date}</td>
                    <td className="px-4 py-3 text-sm font-plex">{c.step}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu
                        caseItem={c}
                        onEdit={(item) => { setEditData(item); setModalOpen(true); }}
                        onDelete={handleDelete}
                        onCopyLink={handleCopyLink}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Notification Info */}
        <div className="mt-8 p-5 border border-dashed border-gray-300 bg-gray-50">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-plex text-sm font-semibold text-gray-700">Adjournment Notifications</p>
              <p className="font-plex text-xs text-gray-500 mt-1">
                Email and SMS notifications for adjournment dates are currently in mock mode.
                They will be activated once real email/SMS services are configured.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Case Modal (Slide-in Sheet) */}
      <CaseModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSubmit={handleSaveCase}
        editData={editData}
      />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
