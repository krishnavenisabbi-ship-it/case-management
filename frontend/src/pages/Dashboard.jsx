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

  useEffect(() => {
    if (!token) window.location.href = "/";
  }, []);

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

  // ✅ SAVE FORMAT (YYYY-MM-DD for DB)
  const getFormattedDate = () => {
    if (!form.year || !form.month || !form.day) return "";
    return `${form.year}-${String(form.month).padStart(2,"0")}-${String(form.day).padStart(2,"0")}`;
  };

  // ✅ DISPLAY FORMAT (DD-MM-YYYY for UI)
  const formatDisplayDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
  };

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

  // ✅ FIX EDIT MODE DATE
  const editCase = (c) => {
    if (!c.date) return;

    const d = new Date(c.date);

    setForm({
      ...c,
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    });

    setEditId(c._id);
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

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

        {/* FORM */}
        <div style={cardStyle}>
          <h3>{editId ? "Edit Case" : "Add Case"}</h3>

          <div style={gridStyle}>
            {input("Case Number", form.caseNumber, v=>setForm({...form, caseNumber:v}))}
            {input("Petitioner", form.petitioner, v=>setForm({...form, petitioner:v}))}
            {input("Respondent", form.respondent, v=>setForm({...form, respondent:v}))}
            {input("Type", form.type, v=>setForm({...form, type:v}))}
            {input("Advocate", form.advocate, v=>setForm({...form, advocate:v}))}
            {input("Phone", form.phone, v=>setForm({...form, phone:v}))}

            {/* 📅 DATE DROPDOWN */}
            <div>
              <label>Date</label>

              <div style={{ display:"flex", gap:"10px" }}>
                <select value={form.day} onChange={(e)=>setForm({...form, day:e.target.value})}>
                  <option value="">Day</option>
                  {[...Array(31)].map((_,i)=>(
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>

                <select value={form.month} onChange={(e)=>setForm({...form, month:e.target.value})}>
                  <option value="">Month</option>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=>(
                    <option key={i} value={i+1}>{m}</option>
                  ))}
                </select>

                <select value={form.year} onChange={(e)=>setForm({...form, year:e.target.value})}>
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
                  <td>{formatDisplayDate(c.date)}</td>
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
    <input value={value} onChange={(e)=>onChange(e.target.value)} />
  </div>
);

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