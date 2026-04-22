import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const BASE_URL = "https://case-management-dkgs.onrender.com";

const emptyForm = {
  caseNumber: "",
  petitioner: "",
  respondent: "",
  type: "",
  advocate: "",
  phone: "",
  date: "",
  adjournmentDate: "",
  status: "Pending",
  notes: "",
  attachments: [],
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
};

const formatDisplayDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN");
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        content: reader.result,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const normalizeCaseForForm = (caseItem) => ({
  caseNumber: caseItem.caseNumber || "",
  petitioner: caseItem.petitioner || "",
  respondent: caseItem.respondent || "",
  type: caseItem.type || "",
  advocate: caseItem.advocate || "",
  phone: caseItem.phone || "",
  date: toInputDate(caseItem.date),
  adjournmentDate: toInputDate(caseItem.adjournmentDate || caseItem.date),
  status: caseItem.status || "Pending",
  notes: caseItem.notes || "",
  attachments: caseItem.attachments || [],
});

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("cases");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, authConfig());
      setCurrentUser(meResponse.data);
      localStorage.setItem("user", JSON.stringify(meResponse.data));

      await Promise.all([
        fetchCases(),
        meResponse.data.role === "admin" ? fetchUsers() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    const res = await axios.get(`${BASE_URL}/api/cases`, authConfig());
    setCases(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${BASE_URL}/api/admin/users`, authConfig());
    setUsers(res.data);
  };

  const filteredCases = useMemo(() => {
    const term = search.toLowerCase();
    return cases.filter((c) =>
      [
        c.caseNumber,
        c.petitioner,
        c.respondent,
        c.type,
        c.advocate,
        c.phone,
        c.status,
        c.notes,
        c.createdByName,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [cases, search]);

  const stats = useMemo(
    () => [
      { label: "Total Cases", value: cases.length },
      {
        label: "Pending",
        value: cases.filter((item) => item.status === "Pending").length,
      },
      {
        label: "Disposed",
        value: cases.filter((item) => item.status === "Disposed").length,
      },
      {
        label: "Uploads",
        value: cases.reduce(
          (count, item) => count + (item.attachments?.length || 0),
          0
        ),
      },
    ],
    [cases]
  );

  const updateFormField = (setter, field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttachmentSelect = async (event, setter) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const encodedFiles = await Promise.all(files.map(fileToDataUrl));
    setter((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...encodedFiles].slice(0, 5),
    }));

    event.target.value = "";
  };

  const removeAttachment = (setter, index) => {
    setter((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleCreateCase = async () => {
    if (!form.caseNumber || !form.adjournmentDate) {
      alert("Case number and adjournment date are required");
      return;
    }

    try {
      setSaving(true);
      await axios.post(
        `${BASE_URL}/api/cases`,
        {
          ...form,
          date: form.date || form.adjournmentDate,
        },
        authConfig()
      );
      setForm(emptyForm);
      await fetchCases();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Could not create case");
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (caseItem) => {
    setEditId(caseItem._id);
    setEditForm(normalizeCaseForForm(caseItem));
    setIsEditOpen(true);
  };

  const handleUpdateCase = async () => {
    if (!editId) return;

    try {
      setSaving(true);
      await axios.put(
        `${BASE_URL}/api/cases/${editId}`,
        {
          ...editForm,
          date: editForm.date || editForm.adjournmentDate,
        },
        authConfig()
      );
      setIsEditOpen(false);
      setEditId(null);
      await fetchCases();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Could not update case");
    } finally {
      setSaving(false);
    }
  };

  const deleteCase = async (id) => {
    if (!window.confirm("Delete this case?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/cases/${id}`, authConfig());
      await fetchCases();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await axios.put(
        `${BASE_URL}/api/admin/users/${userId}/role`,
        { role },
        authConfig()
      );
      await fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Role update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div>
          <div className="dashboard-brand">CMS</div>
          <div className="dashboard-user-card">
            <strong>{currentUser?.name || "User"}</strong>
            <span>{currentUser?.email}</span>
            <span className={`role-pill role-${currentUser?.role || "user"}`}>
              {currentUser?.role || "user"}
            </span>
          </div>

          <div className="dashboard-nav">
            <button
              className={activeTab === "cases" ? "nav-btn active" : "nav-btn"}
              onClick={() => setActiveTab("cases")}
            >
              Cases
            </button>
            {currentUser?.role === "admin" && (
              <button
                className={activeTab === "admin" ? "nav-btn active" : "nav-btn"}
                onClick={() => setActiveTab("admin")}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Manage cases, uploads, adjournments, and role-based access.</p>
          </div>
        </div>

        <section className="stats-grid">
          {stats.map((item) => (
            <article key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        {activeTab === "cases" && (
          <>
            <section className="panel-card">
              <div className="panel-head">
                <div>
                  <h2>Add Case</h2>
                  <p>Admins can see all cases. Users only see their own.</p>
                </div>
              </div>

              <div className="form-grid">
                <Field
                  label="Case Number"
                  value={form.caseNumber}
                  onChange={(value) => updateFormField(setForm, "caseNumber", value)}
                />
                <Field
                  label="Petitioner"
                  value={form.petitioner}
                  onChange={(value) => updateFormField(setForm, "petitioner", value)}
                />
                <Field
                  label="Respondent"
                  value={form.respondent}
                  onChange={(value) => updateFormField(setForm, "respondent", value)}
                />
                <Field
                  label="Type"
                  value={form.type}
                  onChange={(value) => updateFormField(setForm, "type", value)}
                />
                <Field
                  label="Advocate"
                  value={form.advocate}
                  onChange={(value) => updateFormField(setForm, "advocate", value)}
                />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(value) => updateFormField(setForm, "phone", value)}
                />
                <Field
                  label="Case Date"
                  type="date"
                  value={form.date}
                  onChange={(value) => updateFormField(setForm, "date", value)}
                />
                <Field
                  label="Adjournment Date"
                  type="date"
                  value={form.adjournmentDate}
                  onChange={(value) =>
                    updateFormField(setForm, "adjournmentDate", value)
                  }
                />
                <Field
                  label="Status"
                  type="select"
                  value={form.status}
                  onChange={(value) => updateFormField(setForm, "status", value)}
                  options={["Pending", "Disposed", "Adjourned"]}
                />
                <label className="field field-wide">
                  <span>Notes</span>
                  <textarea
                    className="dashboard-textarea"
                    value={form.notes}
                    onChange={(e) => updateFormField(setForm, "notes", e.target.value)}
                    rows={4}
                  />
                </label>
                <label className="field field-wide">
                  <span>File Upload</span>
                  <input
                    className="dashboard-input"
                    type="file"
                    multiple
                    onChange={(event) => handleAttachmentSelect(event, setForm)}
                  />
                  <AttachmentList
                    attachments={form.attachments}
                    onRemove={(index) => removeAttachment(setForm, index)}
                    editable
                  />
                </label>
              </div>

              <div className="panel-actions">
                <button className="primary-btn" onClick={handleCreateCase} disabled={saving}>
                  {saving ? "Saving..." : "Add Case"}
                </button>
              </div>
            </section>

            <section className="panel-card">
              <div className="panel-head panel-head-stack">
                <div>
                  <h2>Case Records</h2>
                  <p>Search by case number, party, advocate, phone, or notes.</p>
                </div>
                <input
                  className="dashboard-input"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Case Number</th>
                      <th>Petitioner</th>
                      <th>Respondent</th>
                      <th>Type</th>
                      <th>Advocate</th>
                      <th>Phone</th>
                      <th>Case Date</th>
                      <th>Adjournment</th>
                      <th>Status</th>
                      <th>Files</th>
                      <th>Owner</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((caseItem, index) => (
                      <tr key={caseItem._id}>
                        <td>{index + 1}</td>
                        <td>{caseItem.caseNumber || "-"}</td>
                        <td>{caseItem.petitioner || "-"}</td>
                        <td>{caseItem.respondent || "-"}</td>
                        <td>{caseItem.type || "-"}</td>
                        <td>{caseItem.advocate || "-"}</td>
                        <td>{caseItem.phone || "-"}</td>
                        <td>{formatDisplayDate(caseItem.date)}</td>
                        <td>{formatDisplayDate(caseItem.adjournmentDate)}</td>
                        <td>
                          <span className={`status-pill status-${(caseItem.status || "").toLowerCase()}`}>
                            {caseItem.status || "-"}
                          </span>
                        </td>
                        <td>
                          <AttachmentList attachments={caseItem.attachments || []} />
                        </td>
                        <td>{caseItem.createdByName || caseItem.createdByEmail || "-"}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="table-btn"
                              onClick={() => openEditModal(caseItem)}
                            >
                              Edit
                            </button>
                            <button
                              className="table-btn danger"
                              onClick={() => deleteCase(caseItem._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === "admin" && currentUser?.role === "admin" && (
          <section className="panel-card">
            <div className="panel-head">
              <div>
                <h2>Admin Panel</h2>
                <p>Review users and switch roles between admin and user.</p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name || "-"}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          className="dashboard-input role-select"
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                        >
                          <option value="admin">admin</option>
                          <option value="user">user</option>
                        </select>
                      </td>
                      <td>{formatDisplayDate(user.lastLoginAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {isEditOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Edit Case</h2>
                <p>Update case details and notify the advocate on adjournment changes.</p>
              </div>
              <button className="close-btn" onClick={() => setIsEditOpen(false)}>
                Close
              </button>
            </div>

            <div className="form-grid">
              <Field
                label="Case Number"
                value={editForm.caseNumber}
                onChange={(value) => updateFormField(setEditForm, "caseNumber", value)}
              />
              <Field
                label="Petitioner"
                value={editForm.petitioner}
                onChange={(value) => updateFormField(setEditForm, "petitioner", value)}
              />
              <Field
                label="Respondent"
                value={editForm.respondent}
                onChange={(value) => updateFormField(setEditForm, "respondent", value)}
              />
              <Field
                label="Type"
                value={editForm.type}
                onChange={(value) => updateFormField(setEditForm, "type", value)}
              />
              <Field
                label="Advocate"
                value={editForm.advocate}
                onChange={(value) => updateFormField(setEditForm, "advocate", value)}
              />
              <Field
                label="Phone"
                value={editForm.phone}
                onChange={(value) => updateFormField(setEditForm, "phone", value)}
              />
              <Field
                label="Case Date"
                type="date"
                value={editForm.date}
                onChange={(value) => updateFormField(setEditForm, "date", value)}
              />
              <Field
                label="Adjournment Date"
                type="date"
                value={editForm.adjournmentDate}
                onChange={(value) =>
                  updateFormField(setEditForm, "adjournmentDate", value)
                }
              />
              <Field
                label="Status"
                type="select"
                value={editForm.status}
                onChange={(value) => updateFormField(setEditForm, "status", value)}
                options={["Pending", "Disposed", "Adjourned"]}
              />
              <label className="field field-wide">
                <span>Notes</span>
                <textarea
                  className="dashboard-textarea"
                  value={editForm.notes}
                  onChange={(e) => updateFormField(setEditForm, "notes", e.target.value)}
                  rows={4}
                />
              </label>
              <label className="field field-wide">
                <span>Attachments</span>
                <input
                  className="dashboard-input"
                  type="file"
                  multiple
                  onChange={(event) => handleAttachmentSelect(event, setEditForm)}
                />
                <AttachmentList
                  attachments={editForm.attachments}
                  editable
                  onRemove={(index) => removeAttachment(setEditForm, index)}
                />
              </label>
            </div>

            <div className="panel-actions">
              <button className="secondary-btn" onClick={() => setIsEditOpen(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleUpdateCase} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", options = [] }) {
  return (
    <label className="field">
      <span>{label}</span>
      {type === "select" ? (
        <select className="dashboard-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="dashboard-input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function AttachmentList({ attachments = [], editable = false, onRemove }) {
  if (!attachments.length) {
    return <span className="attachment-empty">No files</span>;
  }

  return (
    <div className="attachment-list">
      {attachments.map((file, index) => (
        <div key={`${file.name}-${index}`} className="attachment-chip">
          <a href={file.content} download={file.name} target="_blank" rel="noreferrer">
            {file.name}
          </a>
          {editable && (
            <button type="button" onClick={() => onRemove(index)}>
              x
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
