import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Dummy data
  const cases = [
    { id: "#001", name: "Ravi Kumar", status: "Active", date: "20 Apr 2026" },
    { id: "#002", name: "Sita Devi", status: "Closed", date: "-" },
    { id: "#003", name: "Arjun Singh", status: "Active", date: "25 Apr 2026" },
  ];

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === "Active").length,
    closed: cases.filter(c => c.status === "Closed").length,
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h1>Case Management</h1>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* TITLE */}
      <h2>Dashboard</h2>

      {/* STATS */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px",
        marginBottom: "30px"
      }}>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <p>Total Cases</p>
          <h3>{stats.total}</h3>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <p>Active Cases</p>
          <h3>{stats.active}</h3>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <p>Closed Cases</p>
          <h3>{stats.closed}</h3>
        </div>

      </div>

      {/* TABLE */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Client Name</th>
            <th>Status</th>
            <th>Next Hearing</th>
          </tr>
        </thead>

        <tbody>
          {cases.map((c, i) => (
            <tr key={i}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.status}</td>
              <td>{c.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}