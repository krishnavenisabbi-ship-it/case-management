import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    courtName: {
      type: String,
      required: true,
      trim: true,
    },
    hearingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Adjourned"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);

export default Case;
