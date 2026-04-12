import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, Ban, CheckCircle, ArrowLeft, Search } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/users`, { credentials: "include" });
      if (res.status === 403) {
        navigate("/dashboard", { replace: true });
        return;
      }
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch {}
    setLoading(false);
  }, [navigate]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleBlock = async (userId) => {
    if (!confirm("Block this user? They will be logged out immediately and cannot sign in.")) return;
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}/block`, {
        method: "PUT", credentials: "include"
      });
      if (res.ok) { fetchUsers(); showToast("User blocked"); }
      else { const d = await res.json(); showToast(d.detail || "Failed", "error"); }
    } catch { showToast("Failed to block user", "error"); }
  };

  const handleUnblock = async (userId) => {
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}/unblock`, {
        method: "PUT", credentials: "include"
      });
      if (res.ok) { fetchUsers(); showToast("User unblocked"); }
    } catch { showToast("Failed to unblock user", "error"); }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="admin-page">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 text-sm font-plex font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border border-black ${toast.type === "error" ? "bg-red-50 text-red-800" : "bg-white text-black"}`} data-testid="admin-toast">
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-black bg-white sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-outfit text-lg font-black tracking-tight" data-testid="admin-title">
              ADMIN PANEL
            </h1>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            data-testid="back-to-dashboard-btn"
            className="flex items-center gap-2 px-4 py-2 border border-black text-sm font-plex font-medium hover:bg-black hover:text-white transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-plex text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Total Users</p>
            <p className="font-outfit text-3xl font-black" data-testid="stat-total-users">{users.length}</p>
          </div>
          <div className="bg-white border border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-plex text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Active Users</p>
            <p className="font-outfit text-3xl font-black text-[#002FA7]" data-testid="stat-active-users">{users.filter(u => !u.blocked).length}</p>
          </div>
          <div className="bg-white border border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-plex text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Blocked Users</p>
            <p className="font-outfit text-3xl font-black text-red-600" data-testid="stat-blocked-users">{users.filter(u => u.blocked).length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-outfit text-2xl font-bold tracking-tight">Users</h2>
            <p className="font-plex text-sm text-gray-500">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              data-testid="admin-search-input"
              className="w-64 border border-black pl-9 pr-3 py-2 text-sm font-plex focus:ring-2 focus:ring-black focus:ring-offset-2"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto border border-black" data-testid="admin-users-table">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-black">
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">S.No</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">User</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Email</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Role</th>
                <th className="px-4 py-3 text-right font-plex text-xs font-bold uppercase tracking-wider text-black">Cases</th>
                <th className="px-4 py-3 text-left font-plex text-xs font-bold uppercase tracking-wider text-black">Status</th>
                <th className="px-4 py-3 text-right font-plex text-xs font-bold uppercase tracking-wider text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center font-plex text-sm text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u.user_id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors" data-testid={`user-row-${u.user_id}`}>
                    <td className="px-4 py-3 text-sm font-plex text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.picture ? (
                          <img src={u.picture} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <span className="text-sm font-plex font-medium">{u.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.role === "admin" ? (
                        <span className="bg-[#002FA7] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider inline-block" data-testid={`role-badge-${u.user_id}`}>Admin</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs font-bold uppercase tracking-wider inline-block border border-gray-300" data-testid={`role-badge-${u.user_id}`}>User</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-right">{u.case_count || 0}</td>
                    <td className="px-4 py-3">
                      {u.blocked ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold uppercase tracking-wider inline-block border border-red-300" data-testid={`status-badge-${u.user_id}`}>Blocked</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold uppercase tracking-wider inline-block border border-green-300" data-testid={`status-badge-${u.user_id}`}>Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.role === "admin" ? (
                        <span className="text-xs text-gray-400 font-plex">Protected</span>
                      ) : u.blocked ? (
                        <button
                          onClick={() => handleUnblock(u.user_id)}
                          data-testid={`unblock-btn-${u.user_id}`}
                          className="flex items-center gap-1.5 ml-auto px-3 py-1.5 text-sm font-plex font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(u.user_id)}
                          data-testid={`block-btn-${u.user_id}`}
                          className="flex items-center gap-1.5 ml-auto px-3 py-1.5 text-sm font-plex font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" /> Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
