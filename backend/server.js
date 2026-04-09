import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test routes
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// IMPORTANT: Start server first
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// Then connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
  });