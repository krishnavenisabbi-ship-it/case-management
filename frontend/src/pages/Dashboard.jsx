import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/cases")
      .then((res) => {
        setCases(res.data);
      })
      .catch((err) => {
        console.log("Error fetching cases:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome to Dashboard 🎉</h1>

      {/* Advocate Name Added Here */}
      <h2 style={{ color: "darkblue" }}>Advocate: Mani ⚖️</h2>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h2>Case Details</h2>

      {cases.length === 0 ? (
        <p>No cases available</p>
      ) : (
        cases.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h3>{item.title}</h3>
            <p><strong>Case Number:</strong> {item.caseNumber}</p>
            <p><strong>Client:</strong> {item.clientName}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p>{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;