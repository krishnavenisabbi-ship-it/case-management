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
        <div style={cardStyle}>
          <h3>{editIndex !== null ? "Edit Case" : "Add Case"}</h3>

          <div style={gridStyle}>

            {renderInput("Case Number", form.caseNumber, (val) =>
              setForm((prev) => ({ ...prev, caseNumber: val }))
            )}

            {renderInput("Petitioner", form.petitioner, (val) =>
              setForm((prev) => ({ ...prev, petitioner: val }))
            )}

            {renderInput("Respondent", form.respondent, (val) =>
              setForm((prev) => ({ ...prev, respondent: val }))
            )}

            {renderInput("Case Type", form.type, (val) =>
              setForm((prev) => ({ ...prev, type: val }))
            )}

            {renderInput("Advocate", form.advocate, (val) =>
              setForm((prev) => ({ ...prev, advocate: val }))
            )}

            {renderInput("Year", form.year, (val) =>
              setForm((prev) => ({ ...prev, year: val }))
            )}

            {renderInput("Phone", form.phone, (val) =>
              setForm((prev) => ({ ...prev, phone: val }))
            )}

            {renderInput("Adjournment Date", form.date, (val) =>
              setForm((prev) => ({ ...prev, date: val }))
            )}

            {/* STATUS */}
            <div>
              <label style={labelStyle}>Status</label>
              <select
                style={inputStyle}
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option>Pending</option>
                <option>Disposed</option>
              </select>
            </div>

          </div>

          <button
            type="button"
            onClick={handleSubmit}
            style={submitBtn(editIndex)}
          >
            {editIndex !== null ? "Update Case" : "+ Add Case"}
          </button>
        </div>

        {/* TABLE */}
        <div style={cardStyle}>
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#eee" }}>
                {["S.No", "Case Number", "Petitioner", "Respondent", "Type", "Advocate", "Year", "Phone", "Date", "Status", "Action"]
                  .map((h, i) => (
                    <th key={i} style={headerCell}>{h}</th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "15px" }}>
                    No cases added
                  </td>
                </tr>
              ) : (
                cases.map((c, i) => (
                  <tr
                    key={i}
                    style={{ cursor: "pointer" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#f9fafb"}
                    onMouseOut={(e) => e.currentTarget.style.background = "white"}
                  >
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
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button onClick={() => editCase(i)} style={editBtn}>Edit</button>
                        <button onClick={() => deleteCase(i)} style={deleteBtn}>Delete</button>
                      </div>
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

/* ---------- REUSABLE INPUT ---------- */
const renderInput = (label, value, onChange) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

/* ---------- STYLES ---------- */
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  marginBottom: "20px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px",
  marginTop: "10px"
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  width: "100%",
};

const labelStyle = {
  fontSize: "12px",
  color: "#6b7280"
};

const cell = {
  padding: "10px",
  textAlign: "center"
};

const headerCell = {
  padding: "10px",
  textAlign: "center"
};

const editBtn = {
  background: "#f59e0b",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

const submitBtn = (editIndex) => ({
  marginTop: "15px",
  padding: "10px 20px",
  background: editIndex !== null ? "green" : "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
});