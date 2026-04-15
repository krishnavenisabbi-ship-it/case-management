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
    status: "Pending"
  });

  const [editIndex, setEditIndex] = useState(null);

  // ✅ ADD / UPDATE
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

    // reset form
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px"
          }}
        >
          <h3>{editIndex !== null ? "Edit Case" : "Add Case"}</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px"
          }}>

            {/* FIXED INPUTS */}
            <input
              placeholder="Case Number"
              value={form.caseNumber}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  caseNumber: e.target.value
                }))
              }
            />

            <input
              placeholder="Petitioner"
              value={form.petitioner}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  petitioner: e.target.value
                }))
              }
            />

            <input
              placeholder="Respondent"
              value={form.respondent}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  respondent: e.target.value
                }))
              }
            />

            <input
              placeholder="Case Type"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value
                }))
              }
            />

            <input
              placeholder="Advocate"
              value={form.advocate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  advocate: e.target.value
                }))
              }
            />

            <input
              placeholder="Year"
              value={form.year}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  year: e.target.value
                }))
              }
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value
                }))
              }
            />

            <input
              placeholder="Adjournment Date"
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  date: e.target.value
                }))
              }
            />

          </div>

          <div style={{ marginTop: "10px" }}>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value
                }))
              }
            >
              <option>Pending</option>
              <option>Disposed</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "15px",
              padding: "10px",
              background: editIndex !== null ? "green" : "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            {editIndex !== null ? "Update Case" : "+ Add Case"}
          </button>
        </form>

        {/* TABLE */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <table width="100%">
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
                  <td colSpan="11" style={{ textAlign: "center" }}>
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
                    <td>{c.status}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() => editCase(i)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCase(i)}
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