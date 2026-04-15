import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const cases = [
    { id: "#001", name: "Ravi Kumar", status: "Active", date: "20 Apr 2026" },
    { id: "#002", name: "Sita Devi", status: "Closed", date: "-" },
    { id: "#003", name: "Arjun Singh", status: "Active", date: "25 Apr 2026" },
  ];

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{
        background: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <h2>Case Management</h2>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
          style={{
            padding: "8px 15px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "30px" }}>

        <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

        {/* CARDS */}
        <div style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <div style={cardStyle}>
            <p>Total Cases</p>
            <h2>{cases.length}</h2>
          </div>

          <div style={cardStyle}>
            <p>Active</p>
            <h2>{cases.filter(c => c.status === "Active").length}</h2>
          </div>

          <div style={cardStyle}>
            <p>Closed</p>
            <h2>{cases.filter(c => c.status === "Closed").length}</h2>
          </div>
        </div>

        {/* TABLE */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px"
        }}>
          <table width="100%">
            <thead>
              <tr style={{ background: "#eee" }}>
                <th>Case ID</th>
                <th>Client</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c, i) => (
                <tr key={i}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td style={{ color: c.status === "Active" ? "green" : "red" }}>
                    {c.status}
                  </td>
                  <td>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  flex: 1,
  textAlign: "center",
};