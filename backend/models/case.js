import mongoose from "mongoose";

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

export default mongoose.model("Case", caseSchema);