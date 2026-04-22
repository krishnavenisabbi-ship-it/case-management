import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    size: Number,
    content: String,
    uploadedAt: Date,
    uploadedBy: String,
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    caseNumber: String,
    petitioner: String,
    respondent: String,
    type: String,
    advocate: String,
    phone: String,
    date: String,
    adjournmentDate: String,
    status: String,
    notes: String,
    createdByEmail: String,
    createdByName: String,
    attachments: [attachmentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);
