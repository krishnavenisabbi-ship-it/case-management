import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    loginEnabled: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
