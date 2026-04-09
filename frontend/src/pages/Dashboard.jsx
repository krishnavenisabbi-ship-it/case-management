import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [cases, setCases] = useState([]);

  const fetchCases = async () => {
    try {
      axios.get("https://case-management-dkgs.onrender.com/api/cases")
      setCases(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div>
      <h1>Dashboard Working ✅</h1>
      {cases.map((c) => (
        <p key={c._id}>{c.title}</p>
      ))}
    </div>
  );
}

export default Dashboard;