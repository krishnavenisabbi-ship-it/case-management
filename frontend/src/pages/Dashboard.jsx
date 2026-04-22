import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://case-management-dkgs.onrender.com";

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    caseNumber: "",
    petitioner: "",
    respondent: "",
    type: "",
    advocate: "",
    phone: "",
    date: "",
    status: "Pending",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchCases();
  }, []);

  const fetchCases = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${BASE_URL}/api/cases`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDisplayDate = (date) => {
    if (!date) return "No Date";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "Invalid Date";

    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const handleSubmit = async () => {
    if (!form.caseNumber) {
      alert("Enter Case Number");
      return;
    }

    if (!form.date) {
      alert("Please select a date");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (editId) {
        await axios.put(
          `${BASE_URL}/api/cases/${editId}`,
          { ...form, date: form.date },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditId(null);
      } else {
        await axios.post(
          `${BASE_URL}/api/cases`,
          { ...form, date: form.date },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchCases();
      setForm({
        caseNumber: "",
        petitioner: "",
        respondent: "",
        type: "",
        advocate: "",
        phone: "",
        date: "",
        status: "Pending",
      });
    } catch {
      alert("Error saving case");
    }
  };

  const editCase = (c) => {
    if (!c.date) return;

    const d = new Date(c.date);
    if (Number.isNaN(d.getTime())) return;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    setForm({ ...c, date: `${yyyy}-${mm}-${dd}` });
    setEditId(c._id);
  };

  const deleteCase = async (id) => {
    if (!window.confirm("Delete this case?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${BASE_URL}/api/cases/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCases();
    } catch {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const filteredCases = cases.filter(
    (c) =>
      c.caseNumber?.includes(search) ||
      c.petitioner?.toLowerCase().includes(search.toLowerCase()) ||
      c.respondent?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase()) ||
      c.advocate?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "220px", background: "#111", color: "white", padding: "20px" }}>
        <h2>CMS</h2>
        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>

      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>
        <h2>Dashboard</h2>

        <div style={cardStyle}>
          <h3>{editId ? "Edit Case" : "Add Case"}</h3>

          <div style={gridStyle}>
            {input("Case Number", form.caseNumber, (v) => setForm({ ...form, caseNumber: v }))}
            {input("Petitioner", form.petitioner, (v) => setForm({ ...form, petitioner: v }))}
            {input("Respondent", form.respondent, (v) => setForm({ ...form, respondent: v }))}
            {input("Type", form.type, (v) => setForm({ ...form, type: v }))}
            {input("Advocate", form.advocate, (v) => setForm({ ...form, advocate: v }))}
            {input("Phone", form.phone, (v) => setForm({ ...form, phone: v }))}

            <div style={fieldStyle}>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                style={inputStyle}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <select
                style={inputStyle}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Pending</option>
                <option>Disposed</option>
              </select>
            </div>
          </div>

          <div style={actionsRowStyle}>
            <button onClick={handleSubmit} style={submitBtn(editId)}>
              {editId ? "Update" : "Add Case"}
            </button>
          </div>
        </div>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, marginBottom: "10px" }}
        />

        <div style={cardStyle}>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Case Number</th>
                <th style={thStyle}>Petitioner</th>
                <th style={thStyle}>Respondent</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Advocate</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCases.map((c, i) => (
                <tr key={c._id}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{c.caseNumber || "-"}</td>
                  <td style={tdStyle}>{c.petitioner || "-"}</td>
                  <td style={tdStyle}>{c.respondent || "-"}</td>
                  <td style={tdStyle}>{c.type || "-"}</td>
                  <td style={tdStyle}>{c.advocate || "-"}</td>
                  <td style={tdStyle}>{c.phone || "-"}</td>
                  <td style={tdStyle}>{formatDisplayDate(c.date)}</td>
                  <td style={tdStyle}>{c.status || "-"}</td>
                  <td style={tdStyle}>
                    <div style={actionCellStyle}>
                      <button onClick={() => editCase(c)} style={tableActionBtn}>
                        Edit
                      </button>
                      <button onClick={() => deleteCase(c._id)} style={tableActionBtn}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const input = (label, value, onChange) => (
  <div style={fieldStyle}>
    <label style={labelStyle}>{label}</label>
    <input style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const cardStyle = {
  background: "white",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: "16px",
  alignItems: "start",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  minWidth: 0,
};

const labelStyle = {
  fontSize: "16px",
  lineHeight: 1.25,
};

const inputStyle = {
  width: "100%",
  height: "44px",
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  background: "white",
  boxSizing: "border-box",
  fontSize: "16px",
};

const actionsRowStyle = {
  marginTop: "20px",
};

const tableWrapperStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  minWidth: "1100px",
  borderCollapse: "collapse",
  border: "1px solid #dbe3ea",
  background: "#ffffff",
};

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  whiteSpace: "nowrap",
  border: "1px solid #dbe3ea",
  background: "#f8fafc",
  fontWeight: 700,
};

const tdStyle = {
  textAlign: "left",
  padding: "12px 16px",
  verticalAlign: "top",
  whiteSpace: "nowrap",
  border: "1px solid #e5e7eb",
};

const actionCellStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const tableActionBtn = {
  padding: "6px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  background: "#fff",
  cursor: "pointer",
};

const logoutBtn = {
  marginTop: "20px",
  padding: "10px",
  width: "100%",
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
};

const submitBtn = (editId) => ({
  padding: "10px",
  background: editId ? "green" : "blue",
  color: "white",
  border: "none",
  borderRadius: "6px",
});
