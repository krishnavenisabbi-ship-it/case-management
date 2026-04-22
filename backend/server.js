import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

import Case from "./models/Case.js";
import User from "./models/User.js";
import { requireAdmin, verifyToken } from "./middleware/auth.js";

const app = express();
const PRIMARY_ADMIN_EMAIL = "krishnavenisabbi@gmail.com";

const allowedOrigins = [
  "https://yourcase.in",
  "https://www.yourcase.in",
  "https://case-management-alpha.vercel.app",
  "https://case-management-dkgs.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "15mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Error", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Backend running");
});

const getAdminEmails = () =>
  Array.from(
    new Set(
      [PRIMARY_ADMIN_EMAIL, ...(process.env.ADMIN_EMAILS || "").split(",")]
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
    )
  );

const normalizeAttachments = (attachments = [], actorEmail = "") =>
  attachments
    .filter((file) => file?.name && file?.content)
    .map((file) => ({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: Number(file.size) || 0,
      content: file.content,
      uploadedAt: new Date(),
      uploadedBy: actorEmail,
    }));

const buildCasePayload = (body, actor) => ({
  caseNumber: body.caseNumber || "",
  petitioner: body.petitioner || "",
  respondent: body.respondent || "",
  type: body.type || "",
  advocate: body.advocate || "",
  phone: body.phone || "",
  date: body.date || "",
  adjournmentDate: body.adjournmentDate || body.date || "",
  status: body.status || "Pending",
  notes: body.notes || "",
  attachments: normalizeAttachments(body.attachments, actor.email),
  createdByEmail: actor.email,
  createdByName: actor.name || actor.email,
});

const formatSmsDate = (value) => {
  if (!value) return "not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sendAdjournmentSms = async ({ phone, caseNumber, adjournmentDate }) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from || !phone || !adjournmentDate) {
    return;
  }

  const message = `Case ${caseNumber}: adjournment date is ${formatSmsDate(
    adjournmentDate
  )}.`;

  const body = new URLSearchParams({
    To: phone,
    From: from,
    Body: message,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString(
          "base64"
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "SMS send failed");
  }
};

const canManageCase = (currentUser, caseItem) =>
  currentUser?.role === "admin" || caseItem.createdByEmail === currentUser?.email;

const withUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

app.post("/api/auth/google", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret missing" });
    }

    const normalizedEmail = email.toLowerCase();
    const defaultRole = getAdminEmails().includes(normalizedEmail) ? "admin" : "user";

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        name: name || normalizedEmail,
        role: defaultRole,
        lastLoginAt: new Date(),
      });
    } else {
      user.name = name || user.name || normalizedEmail;
      if (getAdminEmails().includes(normalizedEmail)) {
        user.role = "admin";
      }
      user.lastLoginAt = new Date();
      await user.save();
    }

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Auth failed" });
  }
});

app.get("/api/auth/me", verifyToken, withUser, async (req, res) => {
  res.json({
    id: req.currentUser._id,
    email: req.currentUser.email,
    name: req.currentUser.name,
    role: req.currentUser.role,
  });
});

app.get("/api/cases", verifyToken, withUser, async (req, res) => {
  try {
    const query =
      req.currentUser.role === "admin"
        ? {}
        : { createdByEmail: req.currentUser.email };

    const cases = await Case.find(query).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/cases", verifyToken, withUser, async (req, res) => {
  try {
    const newCase = new Case(buildCasePayload(req.body, req.currentUser));
    const savedCase = await newCase.save();

    if (savedCase.phone && savedCase.adjournmentDate) {
      try {
        await sendAdjournmentSms({
          phone: savedCase.phone,
          caseNumber: savedCase.caseNumber,
          adjournmentDate: savedCase.adjournmentDate,
        });
      } catch (smsError) {
        console.error("SMS error:", smsError.message);
      }
    }

    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/cases/:id", verifyToken, withUser, async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.id);

    if (!existingCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (!canManageCase(req.currentUser, existingCase)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const attachments =
      req.body.attachments?.length > 0
        ? normalizeAttachments(req.body.attachments, req.currentUser.email)
        : existingCase.attachments;

    existingCase.caseNumber = req.body.caseNumber || "";
    existingCase.petitioner = req.body.petitioner || "";
    existingCase.respondent = req.body.respondent || "";
    existingCase.type = req.body.type || "";
    existingCase.advocate = req.body.advocate || "";
    existingCase.phone = req.body.phone || "";
    existingCase.date = req.body.date || "";
    existingCase.adjournmentDate = req.body.adjournmentDate || req.body.date || "";
    existingCase.status = req.body.status || "Pending";
    existingCase.notes = req.body.notes || "";
    existingCase.attachments = attachments;

    const wasAdjournmentChanged =
      existingCase.isModified("adjournmentDate") || existingCase.isModified("phone");

    const updated = await existingCase.save();

    if (wasAdjournmentChanged && updated.phone && updated.adjournmentDate) {
      try {
        await sendAdjournmentSms({
          phone: updated.phone,
          caseNumber: updated.caseNumber,
          adjournmentDate: updated.adjournmentDate,
        });
      } catch (smsError) {
        console.error("SMS error:", smsError.message);
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/cases/:id", verifyToken, withUser, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (!canManageCase(req.currentUser, caseItem)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/admin/users", verifyToken, withUser, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put(
  "/api/admin/users/:id/role",
  verifyToken,
  withUser,
  requireAdmin,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const existingUser = await User.findById(req.params.id);

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (
        existingUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL &&
        role !== "admin"
      ) {
        return res.status(400).json({ message: "Primary admin role is locked" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      );

      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
