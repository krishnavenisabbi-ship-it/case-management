import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// ======================
// Health Check Route
// ======================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ======================
// API Routes
// ======================
app.use("/api", authRoutes);

// Temporary route (replace later with DB model)
app.get("/api/cases", (req, res) => {
  res.json([]);
});

// ======================
// MongoDB Connection
// ======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB Connected ✅");
})
.catch((err) => {
  console.error("MongoDB Connection Error ❌:", err);
});

// ======================
// Handle Unknown Routes (Fixes 404 issue)
// ======================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found ❌",
  });
});

// ======================
// Server Start
// ======================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});