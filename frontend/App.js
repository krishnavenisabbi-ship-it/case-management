
// Frontend - App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({
    petitioner: "",
    respondent: "",
    court: "",
    adjournmentDate: "",
    step: "",
    status: "Pending",
  });

  const fetchCases = async () => {
    const res = await axios.get("http://localhost:5000/cases");
    setCases(res.data);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const addCase = async () => {
    await axios.post("http://localhost:5000/cases", form);
    fetchCases();
  };

  const deleteCase = async (id) => {
    await axios.delete(`http://localhost:5000/cases/${id}`);
    fetchCases();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Court Management System</h2>
      <input placeholder="Petitioner" onChange={(e)=>setForm({...form, petitioner:e.target.value})} />
      <input placeholder="Respondent" onChange={(e)=>setForm({...form, respondent:e.target.value})} />
      <input placeholder="Court" onChange={(e)=>setForm({...form, court:e.target.value})} />
      <input type="date" onChange={(e)=>setForm({...form, adjournmentDate:e.target.value})} />
      <input placeholder="Step" onChange={(e)=>setForm({...form, step:e.target.value})} />
      <select onChange={(e)=>setForm({...form, status:e.target.value})}>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Closed</option>
      </select>
      <button onClick={addCase}>Add Case</button>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Petitioner</th>
            <th>Respondent</th>
            <th>Court</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(c => (
            <tr key={c._id}>
              <td>{c.petitioner}</td>
              <td>{c.respondent}</td>
              <td>{c.court}</td>
              <td>{c.adjournmentDate}</td>
              <td>{c.status}</td>
              <td>
                <button onClick={()=>deleteCase(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
