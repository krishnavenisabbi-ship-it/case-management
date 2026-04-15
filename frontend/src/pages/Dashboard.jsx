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

  const [editIndex, setEditIndex] = useState(null);

  // ADD or UPDATE
  const handleSubmit = () => {
    if (!form.caseNumber) return alert("Enter Case Number");

    if (editIndex !== null) {
      const updated = [...cases];
      updated[editIndex] = form;
      setCases(updated);
      setEditIndex(null);
    } else {
      setCases([...cases, form]);
    }

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

  // EDIT CASE
  const editCase = (index) => {
    setForm(cases[index]);
    setEditIndex(index);
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
      <div style={{ flex: 1, background: "#f5f5f5", padding: "20px" }}>

        <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

        {/* FORM */}
        <div style={{
          background: "white",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
        }}>
          <h3>{editIndex !== null ? "Edit Case" : "Add Case"}</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px"
          }}>
            <input placeholder="Case Number" value={form.caseNumber} onChange={(e) => setForm({...form, caseNumber: e.target.value})} />
            <input placeholder="Petitioner" value={form.petitioner} onChange={(e) => setForm({...form, petitioner: e.target.value})} />
            <input placeholder="Respondent" value={form.respondent} onChange={(e) => setForm({...form, respondent: e.target.value})} />
            <input placeholder="Case Type" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} />

            <input placeholder="Advocate" value={form.advocate} onChange={(e) => setForm({...form, advocate: e.target.value})} />
            <input placeholder="Year" value={form.year} onChange={(e) => setForm({...form, year: e.target.value})} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
            <input placeholder="Adjournment Date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
          </div>

          <div style={{ marginTop: "10px" }}>
            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
              <option>Pending</option>
              <option>Disposed</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            style={{
              marginTop: "15px",
              padding: "10px 18px",
              background: editIndex !== null ? "#16a34a" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {editIndex !== null ? "Update Case" : "+ Add Case"}
          </button>
        </div>

        {/* TABLE */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
        }}>
          <table width="100%">
            <thead>
              <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
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
                  <td style={{ padding: "10px" }}>{i + 1}</td>
                  <td style={{ padding: "10px" }}>{c.caseNumber}</td>
                  <td style={{ padding: "10px" }}>{c.petitioner}</td>
                  <td style={{ padding: "10px" }}>{c.respondent}</td>
                  <td style={{ padding: "10px" }}>{c.type}</td>
                  <td style={{ padding: "10px" }}>{c.advocate}</td>
                  <td style={{ padding: "10px" }}>{c.year}</td>
                  <td style={{ padding: "10px" }}>{c.phone}</td>
                  <td style={{ padding: "10px" }}>{c.date}</td>
                  <td style={{ padding: "10px", color: c.status === "Pending" ? "orange" : "green" }}>
                    {c.status}
                  </td>

                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => editCase(i)}
                      style={{
                        marginRight: "5px",
                        padding: "6px 10px",
                        background: "#f59e0b",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCase(i)}
                      style={{
                        padding: "6px 10px",
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
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