import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import Case from "./models/Case.js";

const app = express();

// Middleware
app.use(cors({
  origin: "app.use(cors({
  origin: "https://case-management-frontend.vercel.app"
}));
}));
app.use(express.json());

// ===============================
// MongoDB Connection (CORRECT)
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.log("MongoDB Error ❌", err);
    process.exit(1);
  });

// ===============================
// Routes
// ===============================

// Test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// Get all cases
app.get("/api/cases", async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add case
app.post("/api/cases", async (req, res) => {
  try {
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update case
app.put("/api/cases/:id", async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete case
app.delete("/api/cases/:id", async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===============================
// Server Start
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});