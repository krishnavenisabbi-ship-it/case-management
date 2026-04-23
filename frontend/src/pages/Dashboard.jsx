import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { INDIA_STATE_DISTRICTS, INDIA_STATES } from "../data/indiaLocations";
import "./Dashboard.css";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://case-management-dkgs.onrender.com";

const emptyForm = {
  state: "",
  district: "",
  courtName: "",
  caseType: "",
  caseNumber: "",
  petitioner: "",
  respondent: "",
  filingDate: "",
  adjournmentDate: "",
  stepOfAdjournment: "",
  otherSideAdvocateName: "",
  phone: "",
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
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
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
  state: caseItem.state || "",
  district: caseItem.district || "",
  courtName: caseItem.courtName || "",
  caseType: caseItem.caseType || caseItem.type || "",
  caseNumber: caseItem.caseNumber || "",
  petitioner: caseItem.petitioner || "",
  respondent: caseItem.respondent || "",
  filingDate: toInputDate(caseItem.filingDate || caseItem.date),
  adjournmentDate: toInputDate(caseItem.adjournmentDate),
  stepOfAdjournment: caseItem.stepOfAdjournment || "",
  otherSideAdvocateName:
    caseItem.otherSideAdvocateName || caseItem.advocate || "",
  phone: caseItem.phone || "",
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
      setActiveTab(meResponse.data.role === "admin" ? "admin" : "cases");
      localStorage.setItem("user", JSON.stringify(meResponse.data));

      await Promise.all([
        meResponse.data.role === "admin" ? Promise.resolve() : fetchCases(),
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
    return cases.filter((caseItem) =>
      [
        caseItem.state,
        caseItem.district,
        caseItem.courtName,
        caseItem.caseType || caseItem.type,
        caseItem.caseNumber,
        caseItem.petitioner,
        caseItem.respondent,
        caseItem.stepOfAdjournment,
        caseItem.otherSideAdvocateName || caseItem.advocate,
        caseItem.phone,
        caseItem.status,
        caseItem.notes,
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
    setter((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "state") {
        next.district = "";
      }
      return next;
    });
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
    if (!form.caseNumber || !form.state || !form.district || !form.adjournmentDate) {
      alert("State, district, case number, and adjournment date are required");
      return;
    }

    try {
      setSaving(true);
      await axios.post(`${BASE_URL}/api/cases`, form, authConfig());
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
      await axios.put(`${BASE_URL}/api/cases/${editId}`, editForm, authConfig());
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

  const updateUserLoginAccess = async (userId, loginEnabled) => {
    try {
      await axios.put(
        `${BASE_URL}/api/admin/users/${userId}/login-access`,
        { loginEnabled },
        authConfig()
      );
      await fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login access update failed");
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
            <p>Case columns are arranged in your requested order.</p>
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

        {currentUser?.role === "admin" && (
          <section className="panel-card">
            <div className="panel-head">
              <div>
                <h2>Admin Access Control</h2>
                <p>
                  This admin account can only allow or block user logins. Case data is
                  hidden from admin view.
                </p>
              </div>
            </div>
          </section>
        )}

        {currentUser?.role !== "admin" && activeTab === "cases" && (
          <>
            <section className="panel-card">
              <div className="panel-head">
                <div>
                  <h2>Add Case</h2>
                  <p>Fill the case details in the same order used by the table.</p>
                </div>
              </div>

              <CaseForm
                form={form}
                setForm={setForm}
                onAttachmentSelect={handleAttachmentSelect}
                onAttachmentRemove={removeAttachment}
              />

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
                  <p>Search by state, district, court, case number, party, or phone.</p>
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
                      <th>State</th>
                      <th>District</th>
                      <th>Court Name</th>
                      <th>Case Type</th>
                      <th>Case Number</th>
                      <th>Petitioner Name</th>
                      <th>Respondent Name</th>
                      <th>Case Filing Date</th>
                      <th>Adjournment Date</th>
                      <th>Step of Adjournment</th>
                      <th>Other Side Advocate Name</th>
                      <th>Phone Number</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Attachments</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((caseItem) => (
                      <tr key={caseItem._id}>
                        <td>{caseItem.state || "-"}</td>
                        <td>{caseItem.district || "-"}</td>
                        <td>{caseItem.courtName || "-"}</td>
                        <td>{caseItem.caseType || caseItem.type || "-"}</td>
                        <td>{caseItem.caseNumber || "-"}</td>
                        <td>{caseItem.petitioner || "-"}</td>
                        <td>{caseItem.respondent || "-"}</td>
                        <td>{formatDisplayDate(caseItem.filingDate || caseItem.date)}</td>
                        <td>{formatDisplayDate(caseItem.adjournmentDate)}</td>
                        <td>{caseItem.stepOfAdjournment || "-"}</td>
                        <td>{caseItem.otherSideAdvocateName || caseItem.advocate || "-"}</td>
                        <td>{caseItem.phone || "-"}</td>
                        <td>
                          <span className={`status-pill status-${(caseItem.status || "").toLowerCase()}`}>
                            {caseItem.status || "-"}
                          </span>
                        </td>
                        <td>{caseItem.notes || "-"}</td>
                        <td>
                          <AttachmentList attachments={caseItem.attachments || []} />
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="table-btn" onClick={() => openEditModal(caseItem)}>
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
                <p>Control role and login access for users.</p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Login Access</th>
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
                      <td>
                        <select
                          className="dashboard-input role-select"
                          value={user.loginEnabled ? "enabled" : "disabled"}
                          onChange={(e) =>
                            updateUserLoginAccess(user._id, e.target.value === "enabled")
                          }
                        >
                          <option value="enabled">enabled</option>
                          <option value="disabled">disabled</option>
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
                <p>Update case details in the same order as the dashboard table.</p>
              </div>
              <button className="close-btn" onClick={() => setIsEditOpen(false)}>
                Close
              </button>
            </div>

            <CaseForm
              form={editForm}
              setForm={setEditForm}
              onAttachmentSelect={handleAttachmentSelect}
              onAttachmentRemove={removeAttachment}
            />

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

function CaseForm({ form, setForm, onAttachmentSelect, onAttachmentRemove }) {
  const districtOptions = INDIA_STATE_DISTRICTS[form.state] || [];

  return (
    <div className="form-grid">
      <Field
        label="State"
        type="select"
        value={form.state}
        onChange={(value) =>
          setForm((prev) => ({ ...prev, state: value, district: "" }))
        }
        options={INDIA_STATES}
        placeholder="Select State"
      />
      <Field
        label="District"
        type="select"
        value={form.district}
        onChange={(value) => setForm((prev) => ({ ...prev, district: value }))}
        options={districtOptions}
        placeholder={form.state ? "Select District" : "Select State First"}
        disabled={!form.state}
      />
      <Field
        label="Court Name"
        value={form.courtName}
        onChange={(value) => setForm((prev) => ({ ...prev, courtName: value }))}
      />
      <Field
        label="Case Type"
        value={form.caseType}
        onChange={(value) => setForm((prev) => ({ ...prev, caseType: value }))}
      />
      <Field
        label="Case Number"
        value={form.caseNumber}
        onChange={(value) => setForm((prev) => ({ ...prev, caseNumber: value }))}
      />
      <Field
        label="Petitioner Name"
        value={form.petitioner}
        onChange={(value) => setForm((prev) => ({ ...prev, petitioner: value }))}
      />
      <Field
        label="Respondent Name"
        value={form.respondent}
        onChange={(value) => setForm((prev) => ({ ...prev, respondent: value }))}
      />
      <Field
        label="Case Filing Date"
        type="date"
        value={form.filingDate}
        onChange={(value) => setForm((prev) => ({ ...prev, filingDate: value }))}
      />
      <Field
        label="Adjournment Date"
        type="date"
        value={form.adjournmentDate}
        onChange={(value) => setForm((prev) => ({ ...prev, adjournmentDate: value }))}
      />
      <Field
        label="Step of Adjournment"
        value={form.stepOfAdjournment}
        onChange={(value) =>
          setForm((prev) => ({ ...prev, stepOfAdjournment: value }))
        }
      />
      <Field
        label="Other Side Advocate Name"
        value={form.otherSideAdvocateName}
        onChange={(value) =>
          setForm((prev) => ({ ...prev, otherSideAdvocateName: value }))
        }
      />
      <Field
        label="Phone Number"
        value={form.phone}
        onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
      />
      <Field
        label="Status"
        type="select"
        value={form.status}
        onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
        options={["Pending", "Disposed"]}
      />
      <label className="field field-wide">
        <span>Notes</span>
        <textarea
          className="dashboard-textarea"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          rows={4}
        />
      </label>
      <label className="field field-wide">
        <span>Attachments</span>
        <input
          className="dashboard-input"
          type="file"
          multiple
          onChange={(event) => onAttachmentSelect(event, setForm)}
        />
        <AttachmentList
          attachments={form.attachments}
          onRemove={(index) => onAttachmentRemove(setForm, index)}
          editable
        />
      </label>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  options = [],
  placeholder = "Select",
  disabled = false,
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {type === "select" ? (
        <select
          className="dashboard-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
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
