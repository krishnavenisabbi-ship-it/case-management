import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import Case from "./models/Case.js";

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection (FIXED)
mongoose.connect("mongodb://krishnavenisabbi_db_user:Sweety1985@ac-ptxplbx-shard-00-00.uf8w4gl.mongodb.net:27017,ac-ptxplbx-shard-00-01.uf8w4gl.mongodb.net:27017,ac-ptxplbx-shard-00-02.uf8w4gl.mongodb.net:27017/case_management?ssl=true&replicaSet=atlas-9gcdmz-shard-0&retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));
// Routes
app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/api/cases", async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/cases", async (req, res) => {
  try {
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});