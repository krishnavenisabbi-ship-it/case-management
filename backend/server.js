import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import Case from "./models/Case.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect("mongodb://127.0.0.1:27017/case_management")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

// ===============================
// Routes
// ===============================

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Get All Cases
app.get("/api/cases", async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create New Case
app.post("/api/cases", async (req, res) => {
  try {
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===============================
// Server Start
// ===============================
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});