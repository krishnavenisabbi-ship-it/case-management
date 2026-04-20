import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

import Case from "./models/Case.js";
import { verifyToken } from "./middleware/auth.js";

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
const allowedOrigins = [
  "https://yourcase.in",                 // your custom domain (if any)
  "https://case-management-dkgs.onrender.com", // your frontend URL
  "http://localhost:5173"               // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

// ===============================
// MONGODB CONNECTION
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Error ❌", err);
    process.exit(1);
  });

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ===============================
// AUTH ROUTE (NO TOKEN REQUIRED)
// ===============================
app.post("/api/auth/google", (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing on server" });
    }

    const token = jwt.sign(
      { email, name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Auth failed" });
  }
});

// ===============================
// PROTECTED ROUTES
// ===============================

// GET ALL CASES
app.get("/api/cases", verifyToken, async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE CASE
app.post("/api/cases", verifyToken, async (req, res) => {
  try {
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE CASE
app.put("/api/cases/:id", verifyToken, async (req, res) => {
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

// DELETE CASE
app.delete("/api/cases/:id", verifyToken, async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});