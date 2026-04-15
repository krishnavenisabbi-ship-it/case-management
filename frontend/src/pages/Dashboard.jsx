"use client"; // REQUIRED if you are using Next.js App Router

import { useState } from "react";

export default function Dashboard() {
  const initialFormState = {
    caseNumber: "",
    petitioner: "",
    respondent: "",
    type: "",
    advocate: "",
    year: "",
    phone: "",
    date: "",
    status: "Pending",
  };

  const [cases, setCases] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editIndex, setEditIndex] = useState(null);

  // ✅ SINGLE HANDLER FOR ALL INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ ADD / UPDATE CASE
  const handleSubmit = () => {
    // 1. Validation
    if (!form.caseNumber.trim()) {
      alert("Case Number is required!");
      return;
    }

    // 2. Update or Add
    if (editIndex !== null) {
      const updated = [...cases];
      updated[editIndex] = { ...form };
      setCases(updated);
      setEditIndex(null);
    } else {
      setCases((prev) => [...prev, { ...form }]);
    }

    // 3. Reset Form
    setForm(initialFormState);
  };

  // ✅ EDIT
  const editCase = (index) => {
    setForm({ ...cases[index] });
    setEditIndex(index);
  };

  // ✅ DELETE
  const deleteCase = (index) => {
    setCases((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#111",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>⚖️ CMS</h2>
        <p>Dashboard</p>
        <p>Add Case</p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>
        <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

        {/* FORM */}
        <div
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h3>{editIndex !== null ? "Edit Case" : "Add Case"}</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
            }}
          >
            <input
              name="caseNumber"
              placeholder="Case Number"
              value={form.caseNumber}
              onChange={handleChange}
            />
            <input
              name="petitioner"
              placeholder="Petitioner"
              value={form.petitioner}
              onChange={handleChange}
            />
            <input
              name="respondent"
              placeholder="Respondent"
              value={form.respondent}
              onChange={handleChange}
            />
            <input
              name="type"
              placeholder="Case Type"
              value={form.type}
              onChange={handleChange}
            />
            <input
              name="advocate"
              placeholder="Advocate"
              value={form.advocate}
              onChange={handleChange}
            />
            <input
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              name="date"
              placeholder="Adjournment Date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Disposed">Disposed</option>
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
            }}
          >
            {editIndex !== null ? "Update Case" : "+ Add Case"}
          </button>
        </div>

        {/* TABLE */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
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
              {cases.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No cases added
                  </td>
                </tr>
              ) : (
                cases.map((c, i) => (
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
                    <td
                      style={{
                        color: c.status === "Pending" ? "orange" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {c.status}
                    </td>

                    <td>
                      <button
                        onClick={() => editCase(i)}
                        style={{
                          marginRight: "5px",
                          background: "#f59e0b",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCase(i)}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
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