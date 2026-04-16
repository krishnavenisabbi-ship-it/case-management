import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {

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

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const res = await axios.get("http://localhost:5000/cases");
    setCases(res.data);
  };

  // ADD / UPDATE
  const handleSubmit = async () => {
    if (!form.caseNumber) {
      alert("Enter Case Number");
      return;
    }

    if (editId) {
      await axios.put(`http://localhost:5000/cases/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/cases", form);
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
  };

  // EDIT
  const editCase = (c) => {
    setForm({ ...c });
    setEditId(c._id);
  };

  // DELETE
  const deleteCase = async (id) => {
    if (!window.confirm("Delete this case?")) return;
    await axios.delete(`http://localhost:5000/cases/${id}`);
    fetchCases();
  };

  // SEARCH
  const filteredCases = cases.filter((c) =>
    c.caseNumber?.includes(search) ||
    c.petitioner?.toLowerCase().includes(search.toLowerCase())
  );

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
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>

        <h2>Dashboard</h2>

        {/* FORM */}
        <div style={cardStyle}>
          <h3>{editId ? "Edit Case" : "Add Case"}</h3>

          <div style={gridStyle}>
            {renderInput("Case Number", form.caseNumber, (v)=>setForm({...form, caseNumber:v}))}
            {renderInput("Petitioner", form.petitioner, (v)=>setForm({...form, petitioner:v}))}
            {renderInput("Respondent", form.respondent, (v)=>setForm({...form, respondent:v}))}
            {renderInput("Case Type", form.type, (v)=>setForm({...form, type:v}))}
            {renderInput("Advocate", form.advocate, (v)=>setForm({...form, advocate:v}))}
            {renderInput("Year", form.year, (v)=>setForm({...form, year:v}))}
            {renderInput("Phone", form.phone, (v)=>setForm({...form, phone:v}))}
            {renderInput("Adjournment Date", form.date, (v)=>setForm({...form, date:v}))}

            <div>
              <label>Status</label>
              <select
                style={inputStyle}
                value={form.status}
                onChange={(e)=>setForm({...form, status:e.target.value})}
              >
                <option>Pending</option>
                <option>Disposed</option>
              </select>
            </div>
          </div>

          <button onClick={handleSubmit} style={submitBtn(editId)}>
            {editId ? "Update Case" : "+ Add Case"}
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
                {["S.No","Case Number","Petitioner","Respondent","Type","Advocate","Year","Phone","Date","Status","Action"]
                  .map((h,i)=>(<th key={i}>{h}</th>))}
              </tr>
            </thead>

            <tbody>
              {filteredCases.map((c,i)=>(
                <tr key={c._id}>
                  <td>{i+1}</td>
                  <td>{c.caseNumber}</td>
                  <td>{c.petitioner}</td>
                  <td>{c.respondent}</td>
                  <td>{c.type}</td>
                  <td>{c.advocate}</td>
                  <td>{c.year}</td>
                  <td>{c.phone}</td>
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

// ---------- HELPERS ----------
const renderInput = (label, value, onChange) => (
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

const submitBtn = () => ({
  marginTop:"10px",
  padding:"10px",
  background:"blue",
  color:"white",
  border:"none"
});