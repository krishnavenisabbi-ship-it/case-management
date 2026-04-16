import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

/* ================== DATABASE ================== */
console.log("Connecting to MongoDB...");

mongoose.connect("mongodb://127.0.0.1:27017/casemanagement");

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected ✅");
});



/* ================== MODEL ================== */
const caseSchema = new mongoose.Schema({
  caseNumber: String,
  petitioner: String,
  respondent: String,
  type: String,
  advocate: String,
  year: String,
  phone: String,
  date: String,
  status: String
}, { timestamps: true });

const Case = mongoose.model("Case", caseSchema);

/* ================== ROUTES */

// ROOT
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// GET
app.get("/cases", async (req, res) => {
  try {
    const data = await Case.find().sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

// ADD
app.post("/cases", async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    res.json(newCase);
  } catch {
    res.status(500).json({ error: "Failed to add case" });
  }
});

// DELETE
app.delete("/cases/:id", async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

// UPDATE
app.put("/cases/:id", async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

/* ================== SERVER ================== */
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});