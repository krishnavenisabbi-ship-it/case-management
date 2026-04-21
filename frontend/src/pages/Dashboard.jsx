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
    phone: "",
    day: "",
    month: "",
    year: "",
    status: "Pending",
  });

  const [editId, setEditId] = useState(null);

  // 🔐 Protect route
  useEffect(() => {
    if (!token) window.location.href = "/";
  }, []);

  // Fetch cases
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

  // Convert dropdown to date
  const getFormattedDate = () => {
    if (!form.year || !form.month || !form.day) return "";
    return `${form.year}-${String(form.month).padStart(2,"0")}-${String(form.day).padStart(2,"0")}`;
  };

  // Submit
  const handleSubmit = async () => {
    if (!form.caseNumber) {
      alert("Enter Case Number");
      return;
    }

    const formattedDate = getFormattedDate();

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/cases/${editId}`, {
          ...form,
          date: formattedDate
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditId(null);
      } else {
        await axios.post(`${BASE_URL}/api/cases`, {
          ...form,
          date: formattedDate
        }, {
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
        phone: "",
        day: "",
        month: "",
        year: "",
        status: "Pending",
      });

    } catch {
      alert("Error saving case");
    }
  };

  // Edit
  const editCase = (c) => {
    let d = new Date(c.date);

    setForm({
      ...c,
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    });

    setEditId(c._id);
  };

  // Delete
  const deleteCase = async (id) => {
    if (!window.confirm("Delete this case?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/cases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCases();
    } catch {
      alert("Delete failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Filter
  const filteredCases = cases.filter(c =>
    c.caseNumber?.includes(search) ||
    c.petitioner?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div style={{ width: "220px", background: "#111", color: "white", padding: "20px" }}>
        <h2>⚖️ CMS</h2>

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>

        <h2>Dashboard</h2>

        {/* Form */}
        <div style={cardStyle}>
          <h3>{editId ? "Edit Case" : "Add Case"}</h3>

          <div style={gridStyle}>
            {input("Case Number", form.caseNumber, v=>setForm({...form, caseNumber:v}))}
            {input("Petitioner", form.petitioner, v=>setForm({...form, petitioner:v}))}
            {input("Respondent", form.respondent, v=>setForm({...form, respondent:v}))}
            {input("Type", form.type, v=>setForm({...form, type:v}))}
            {input("Advocate", form.advocate, v=>setForm({...form, advocate:v}))}
            {input("Phone", form.phone, v=>setForm({...form, phone:v}))}

            {/* 📅 CUSTOM DATE DROPDOWN */}
            <div>
              <label>Date</label>

              <div style={{ display:"flex", gap:"10px" }}>
                <select value={form.day} onChange={(e)=>setForm({...form, day:e.target.value})} style={inputStyle}>
                  <option value="">Day</option>
                  {[...Array(31)].map((_,i)=>(
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>

                <select value={form.month} onChange={(e)=>setForm({...form, month:e.target.value})} style={inputStyle}>
                  <option value="">Month</option>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=>(
                    <option key={i} value={i+1}>{m}</option>
                  ))}
                </select>

                <select value={form.year} onChange={(e)=>setForm({...form, year:e.target.value})} style={inputStyle}>
                  <option value="">Year</option>
                  {Array.from({length: 10}, (_,i)=>2024+i).map(y=>(
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

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

        {/* Search */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={{ padding:"10px", width:"100%", marginBottom:"10px" }}
        />

        {/* Table */}
        <div style={cardStyle}>
          <table width="100%">
            <thead>
              <tr>
                <th>#</th>
                <th>Case</th>
                <th>Petitioner</th>
                <th>Date</th>
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
                  <td>{c.date}</td>
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

// helpers
const input = (label,value,onChange)=>(
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

const logoutBtn = {
  marginTop:"20px",
  padding:"10px",
  width:"100%",
  background:"red",
  color:"white",
  border:"none",
  borderRadius:"5px"
};

const submitBtn = (editId)=>({
  marginTop:"10px",
  padding:"10px",
  background: editId ? "green" : "blue",
  color:"white",
  border:"none",
  borderRadius:"6px"
});