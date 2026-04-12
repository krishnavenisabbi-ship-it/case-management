import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:10000/api/register", // change after deploy
        formData
      );

      setMessage("Registration successful ✅");
      console.log(res.data);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong ❌"
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

// Simple styling
const styles = {
  container: {
    width: "300px",
    margin: "50px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Register;