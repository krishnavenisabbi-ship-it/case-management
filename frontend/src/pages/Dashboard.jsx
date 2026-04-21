import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://case-management-dkgs.onrender.com";

export default function Dashboard() {

  const token = localStorage.getItem("token");

  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    caseNumber: "",
    petitioner: "",
    respondent: "",
    type: "",
    advocate: "",
    year: "",
    phone: "",
    date: "",
    status: "Pending",
  });

  const [editId, setEditId] = useState(null);

  // 🔐 PROTECT DASHBOARD
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  // FETCH CASES
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ADD / UPDATE
  const handleSubmit = async () => {
    if (!form.caseNumber) {
      alert("Enter Case Number");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/cases/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditId(null);
      } else {
        await axios.post(`${BASE_URL}/api/cases`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchCases();

      setForm({
        caseNumber: "",
        petitioner: "",
        respondent: "",
        type: "",
        advocate: "",
        year: "",
        phone: "",
        date: "",
        status: "Pending",
      });

    } catch (err) {
      alert("Error saving case");
    }
  };

  // EDIT
  const editCase = (c) => {
    setForm(c);
    setEditId(c._id);
  };

  // DELETE
  const deleteCase = async (id) => {
    if (!window.confirm("Delete this case?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/cases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCases();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 🔓 LOGOUT FUNCTION
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  // SEARCH FILTER
  const filteredCases = cases.filter((c) =>
    c.caseNumber?.includes(search) ||
    c.petitioner?.toLowerCase().includes(search.toLowerCase())
  );

  // STATS
  const total = cases.length;
  const pending = cases.filter(c => c.status === "Pending").length;
  const disposed = cases.filter(c => c.status === "Disposed").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px",
        background: "#111",
        color: "white",
        padding: "20px"
      }}>
        <h2>⚖️ CMS</h2>
        <p>Dashboard</p>
        <p>Add Case</p>

        {/* 🔓 LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>

        <h2>Dashboard</h2>

        {/* STATS */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={statCard}>Total: {total}</div>
          <div style={statCard}>Pending: {pending}</div>
          <div style={statCard}>Disposed: {disposed}</div>
        </div>

        {/* FORM */}
        <div style={cardStyle}>
          <h3>{editId ? "Edit Case" : "Add Case"}</h3>

          <div style={gridStyle}>
            {input("Case Number", form.caseNumber, v => setForm({...form, caseNumber:v}))}
            {input("Petitioner", form.petitioner, v => setForm({...form, petitioner:v}))}
            {input("Respondent", form.respondent, v => setForm({...form, respondent:v}))}
            {input("Type", form.type, v => setForm({...form, type:v}))}
            {input("Advocate", form.advocate, v => setForm({...form, advocate:v}))}
            {input("Year", form.year, v => setForm({...form, year:v}))}
            {input("Phone", form.phone, v => setForm({...form, phone:v}))}
            {input("Date", form.date, v => setForm({...form, date:v}))}

            <select
              value={form.status}
              onChange={(e)=>setForm({...form, status:e.target.value})}
              style={inputStyle}
            >
              <option>Pending</option>
              <option>Disposed</option>
            </select>
          </div>

          <button onClick={handleSubmit} style={submitBtn(editId)}>
            {editId ? "Update" : "Add Case"}
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={{ padding:"10px", width:"100%", marginBottom:"10px" }}
        />

        {/* TABLE */}
        <div style={cardStyle}>
          <table width="100%">
            <thead>
              <tr>
                <th>#</th>
                <th>Case</th>
                <th>Petitioner</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c,i)=>(
                <tr key={c._id}>
                  <td>{i+1}</td>
                  <td>{c.caseNumber}</td>
                  <td>{c.petitioner}</td>
                  <td>{c.status}</td>
                  <td>
                    <button onClick={()=>editCase(c)}>Edit</button>
                    <button onClick={()=>deleteCase(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// UI helpers
const input = (label, value, onChange) => (
  <div>
    <label>{label}</label>
    <input value={value} onChange={(e)=>onChange(e.target.value)} style={inputStyle}/>
  </div>
);

const inputStyle = {
  padding:"8px",
  border:"1px solid #ccc",
  borderRadius:"5px",
  width:"100%"
};

const cardStyle = {
  background:"white",
  padding:"20px",
  marginBottom:"20px",
  borderRadius:"10px"
};

const gridStyle = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
  gap:"10px"
};

const statCard = {
  background:"white",
  padding:"15px",
  borderRadius:"10px",
  fontWeight:"bold"
};

const submitBtn = (editId) => ({
  marginTop:"10px",
  padding:"10px",
  background: editId ? "green" : "blue",
  color:"white",
  border:"none",
  borderRadius:"6px"
});