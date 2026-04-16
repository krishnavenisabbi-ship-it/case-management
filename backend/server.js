import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("Connecting to MongoDB...");

// ✅ USE ENV VARIABLE (ATLAS)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));

// MODEL
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

// ROUTES
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.get("/cases", async (req, res) => {
  const data = await Case.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post("/cases", async (req, res) => {
  const newCase = new Case(req.body);
  await newCase.save();
  res.json(newCase);
});

app.put("/cases/:id", async (req, res) => {
  const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/cases/:id", async (req, res) => {
  await Case.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ⚠️ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));