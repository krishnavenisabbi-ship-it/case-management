import { useState } from "react";

export default function Dashboard() {
  const [cases, setCases] = useState([]);

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

  const [editIndex, setEditIndex] = useState(null);

  // ADD / UPDATE
  const handleSubmit = () => {
    if (!form.caseNumber) {
      alert("Enter Case Number");
      return;
    }

    if (editIndex !== null) {
      const updated = [...cases];
      updated[editIndex] = { ...form };
      setCases(updated);
      setEditIndex(null);
    } else {
      setCases((prev) => [...prev, { ...form }]);
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
      status: "Pending",
    });
  };

  const editCase = (index) => {
    setForm({ ...cases[index] });
    setEditIndex(index);
  };

  const deleteCase = (index) => {
    setCases((prev) => prev.filter((_, i) => i !== index));
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
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>

        <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

        {/* FORM */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          marginBottom: "20px"
        }}>
          <h3>{editIndex !== null ? "Edit Case" : "Add Case"}</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "15px",
            marginTop: "10px"
          }}>

            <input style={inputStyle} placeholder="Case Number"
              value={form.caseNumber}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, caseNumber: e.target.value }))
              }
            />

            <input style={inputStyle} placeholder="Petitioner"
              value={form.petitioner}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, petitioner: e.target.value }))
              }
            />

            <input style={inputStyle} placeholder="Respondent"
              value={form.respondent}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, respondent: e.target.value }))
              }
            />

            <input style={inputStyle} placeholder="Case Type"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, type: e.target.value }))
              }
            />

            <input style={inputStyle} placeholder="Advocate"
              value={form.advocate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, advocate: e.target.value }))
              }
            />

            <input style={inputStyle} placeholder="Year"
              value={form.year}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, year: e.target.value }))
              }
            />

            <input style={inputStyle} placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
            />

            <input style={inputStyle} placeholder="Adjournment Date"
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
            />

            <select style={inputStyle}
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option>Pending</option>
              <option>Disposed</option>
            </select>

          </div>

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: editIndex !== null ? "green" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
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
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#eee" }}>
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
              {cases.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
                    No cases added
                  </td>
                </tr>
              ) : (
                cases.map((c, i) => (
                  <tr key={i}>
                    <td style={cell}>{i + 1}</td>
                    <td style={cell}>{c.caseNumber}</td>
                    <td style={cell}>{c.petitioner}</td>
                    <td style={cell}>{c.respondent}</td>
                    <td style={cell}>{c.type}</td>
                    <td style={cell}>{c.advocate}</td>
                    <td style={cell}>{c.year}</td>
                    <td style={cell}>{c.phone}</td>
                    <td style={cell}>{c.date}</td>
                    <td style={cell}>{c.status}</td>

                    <td style={cell}>
                      <button
                        type="button"
                        onClick={() => editCase(i)}
                        style={editBtn}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCase(i)}
                        style={deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// STYLES
const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  width: "100%"
};

const cell = {
  padding: "10px",
  textAlign: "center"
};

const editBtn = {
  marginRight: "8px",
  padding: "5px 10px",
  background: "#f59e0b",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const deleteBtn = {
  padding: "5px 10px",
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};