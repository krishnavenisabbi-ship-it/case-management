import { useState } from "react";

export default function Dashboard() {

  const [cases, setCases] = useState([
    {
      caseNumber: "2024-001",
      petitioner: "Ravi Kumar",
      respondent: "State",
      type: "Civil",
      advocate: "Sharma",
      year: "2024",
      phone: "9876543210",
      date: "20 Apr 2026",
      status: "Pending"
    }
  ]);

  const [form, setForm] = useState({
    caseNumber: "",
    petitioner: "",
    respondent: "",
    type: "",
    advocate: "",
    year: "",
    phone: "",
    date: "",
    status: "Pending"
  });

  // ADD CASE
  const addCase = () => {
    setCases([...cases, form]);
    setForm({
      caseNumber: "",
      petitioner: "",
      respondent: "",
      type: "",
      advocate: "",
      year: "",
      phone: "",
      date: "",
      status: "Pending"
    });
  };

  // DELETE CASE
  const deleteCase = (index) => {
    const updated = cases.filter((_, i) => i !== index);
    setCases(updated);
  };

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
        <p>Clients</p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>

        <h2>Dashboard</h2>

        {/* ADD FORM */}
        <div style={{ background: "white", padding: "15px", marginBottom: "20px" }}>
          <h3>Add Case</h3>

          <input placeholder="Case Number" onChange={(e) => setForm({...form, caseNumber: e.target.value})} />
          <input placeholder="Petitioner" onChange={(e) => setForm({...form, petitioner: e.target.value})} />
          <input placeholder="Respondent" onChange={(e) => setForm({...form, respondent: e.target.value})} />
          <input placeholder="Case Type" onChange={(e) => setForm({...form, type: e.target.value})} />
          <input placeholder="Advocate" onChange={(e) => setForm({...form, advocate: e.target.value})} />
          <input placeholder="Year" onChange={(e) => setForm({...form, year: e.target.value})} />
          <input placeholder="Phone" onChange={(e) => setForm({...form, phone: e.target.value})} />
          <input placeholder="Adjournment Date" onChange={(e) => setForm({...form, date: e.target.value})} />

          <select onChange={(e) => setForm({...form, status: e.target.value})}>
            <option>Pending</option>
            <option>Disposed</option>
          </select>

          <button onClick={addCase}>Add Case</button>
        </div>

        {/* TABLE */}
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Case Number</th>
              <th>Petitioner</th>
              <th>Respondent</th>
              <th>Type</th>
              <th>Advocate</th>
              <th>Year</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {cases.map((c, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{c.caseNumber}</td>
                <td>{c.petitioner}</td>
                <td>{c.respondent}</td>
                <td>{c.type}</td>
                <td>{c.advocate}</td>
                <td>{c.year}</td>
                <td>{c.phone}</td>
                <td>{c.date}</td>
                <td style={{ color: c.status === "Pending" ? "orange" : "green" }}>
                  {c.status}
                </td>
                <td>
                  <button onClick={() => deleteCase(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}