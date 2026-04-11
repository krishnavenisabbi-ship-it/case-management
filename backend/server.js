import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

// Port (important for Render)
const PORT = process.env.PORT || 10000;

app.get("/api/cases", (req, res) => {
  res.json([]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});