
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

import Case from "./models/Case.js";
import User from "./models/User.js";

import { verifyToken, withUser, requireAdmin } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://yourcase.in",
  "https://www.yourcase.in",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.options("*", cors()); // handle preflight requests
const PRIMARY_ADMIN_EMAIL = "krishnavenisabbi@gmail.com";
const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Error", err);
    process.exit(1);
  });
app.use("/api/auth", authRoutes);
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

const isPrivilegedEmail = (email = "") => getAdminEmails().includes(email.toLowerCase());

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
  state: body.state || "",
  district: body.district || "",
  courtName: body.courtName || "",
  caseType: body.caseType || body.type || "",
  caseNumber: body.caseNumber || "",
  clientName: body.clientName || "",
  petitioner: body.petitioner || "",
  respondent: body.respondent || "",
  filingDate: body.filingDate || body.date || "",
  stepOfAdjournment: body.stepOfAdjournment || "",
  otherSideAdvocateName: body.otherSideAdvocateName || body.advocate || "",
  type: body.caseType || body.type || "",
  advocate: body.otherSideAdvocateName || body.advocate || "",
  phone: body.phone || "",
  date: body.filingDate || body.date || "",
  adjournmentDate: body.adjournmentDate || body.date || "",
  status: body.status || "Pending",
  notes: body.notes || "",
  attachments: normalizeAttachments(body.attachments, actor.email),
  createdByEmail: actor.email,
  createdByName: actor.name || actor.email,
});

const getTimeParts = (date = new Date(), timeZone = APP_TIMEZONE) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
};

const getDateKeyInTimeZone = (date = new Date(), timeZone = APP_TIMEZONE) => {
  const { year, month, day } = getTimeParts(date, timeZone);
  return `${year}-${month}-${day}`;
};

const addDaysToDateKey = (dateKey, days) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day + days));
  return utcDate.toISOString().slice(0, 10);
};

const normalizeDateKey = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
};

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

const sendSmsMessage = async ({ phone, message }) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from || !phone || !message) {
    return false;
  }

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

  return true;
};

const buildClientReminderMessage = (caseItem) => {
  const advocateName = caseItem.createdByName || "your advocate";
  const clientName = caseItem.clientName || caseItem.petitioner || "Client";
  return `${clientName}, your case ${caseItem.caseNumber} is adjourned tomorrow (${formatSmsDate(
    caseItem.adjournmentDate
  )}). Advocate: ${advocateName}.`;
};

const buildAdvocateReminderMessage = (advocateName, casesForAdvocate) => {
  const count = casesForAdvocate.length;
  const caseList = casesForAdvocate
    .slice(0, 5)
    .map((caseItem) => caseItem.caseNumber)
    .filter(Boolean)
    .join(", ");
  const suffix =
    count > 5 && caseList
      ? ` and ${count - 5} more`
      : "";

  return `${advocateName || "Advocate"}, tomorrow you have ${count} case${
    count === 1 ? "" : "s"
  } to attend (${formatSmsDate(casesForAdvocate[0]?.adjournmentDate)}).${
    caseList ? ` Cases: ${caseList}${suffix}.` : ""
  }`;
};

let lastReminderRunDateKey = "";
let reminderJobRunning = false;

const runReminderJob = async () => {
  if (reminderJobRunning) {
    return;
  }

  const nowParts = getTimeParts(new Date());
  const todayDateKey = `${nowParts.year}-${nowParts.month}-${nowParts.day}`;
  const currentHour = Number(nowParts.hour);
  const currentMinute = Number(nowParts.minute);

  if (currentHour !== 17 || currentMinute > 10 || lastReminderRunDateKey === todayDateKey) {
    return;
  }

  reminderJobRunning = true;

  try {
    const targetAdjournmentDateKey = addDaysToDateKey(todayDateKey, 1);
    const tomorrowCases = await Case.find({
      adjournmentDate: targetAdjournmentDateKey,
      status: { $ne: "Disposed" },
    }).lean();

    const normalizedTomorrowCases = tomorrowCases.filter(
      (caseItem) => normalizeDateKey(caseItem.adjournmentDate) === targetAdjournmentDateKey
    );

    for (const caseItem of normalizedTomorrowCases) {
      if (
        caseItem.phone &&
        caseItem.clientReminderDateKey !== targetAdjournmentDateKey
      ) {
        try {
          await sendSmsMessage({
            phone: caseItem.phone,
            message: buildClientReminderMessage(caseItem),
          });

          await Case.findByIdAndUpdate(caseItem._id, {
            clientReminderDateKey: targetAdjournmentDateKey,
          });
        } catch (smsError) {
          console.error(
            `Client SMS error for case ${caseItem.caseNumber}:`,
            smsError.message
          );
        }
      }
    }

    const advocateEmails = [
      ...new Set(
        normalizedTomorrowCases.map((caseItem) => caseItem.createdByEmail).filter(Boolean)
      ),
    ];

    const advocateUsers = await User.find({ email: { $in: advocateEmails } }).lean();
    const advocateUserMap = new Map(
      advocateUsers.map((user) => [user.email?.toLowerCase(), user])
    );

    const advocateGroups = normalizedTomorrowCases.reduce((groups, caseItem) => {
      const emailKey = caseItem.createdByEmail?.toLowerCase();
      if (!emailKey || caseItem.advocateReminderDateKey === targetAdjournmentDateKey) {
        return groups;
      }

      const user = advocateUserMap.get(emailKey);
      if (!user?.phone) {
        return groups;
      }

      if (!groups.has(emailKey)) {
        groups.set(emailKey, {
          user,
          cases: [],
        });
      }

      groups.get(emailKey).cases.push(caseItem);
      return groups;
    }, new Map());

    for (const [emailKey, group] of advocateGroups.entries()) {
      try {
        await sendSmsMessage({
          phone: group.user.phone,
          message: buildAdvocateReminderMessage(group.user.name, group.cases),
        });

        await Case.updateMany(
          {
            _id: { $in: group.cases.map((caseItem) => caseItem._id) },
          },
          {
            $set: { advocateReminderDateKey: targetAdjournmentDateKey },
          }
        );
      } catch (smsError) {
        console.error(`Advocate SMS error for ${emailKey}:`, smsError.message);
      }
    }

    lastReminderRunDateKey = todayDateKey;
  } catch (error) {
    console.error("Reminder job failed:", error.message);
  } finally {
    reminderJobRunning = false;
  }
};

const canManageCase = (currentUser, caseItem) =>
  currentUser?.role !== "admin" && caseItem.createdByEmail === currentUser?.email;

const requireCaseUser = (req, res, next) => {
  if (req.currentUser?.role === "admin") {
    return res.status(403).json({ message: "Admins cannot access case data" });
  }

  next();
};
 
app.get("/api/cases", verifyToken, withUser, async (req, res) => {
  try {
    if (req.currentUser.role === "admin") {
      return res.json([]);
    }

    const cases = await Case.find({ createdByEmail: req.currentUser.email }).sort({
      createdAt: -1,
    });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/cases", verifyToken, withUser, requireCaseUser, async (req, res) => {
  try {
    const newCase = new Case(buildCasePayload(req.body, req.currentUser));
    const savedCase = await newCase.save();

    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/cases/:id", verifyToken, withUser, requireCaseUser, async (req, res) => {
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
    existingCase.state = req.body.state || "";
    existingCase.district = req.body.district || "";
    existingCase.courtName = req.body.courtName || "";
    existingCase.caseType = req.body.caseType || req.body.type || "";
    existingCase.clientName = req.body.clientName || "";
    existingCase.petitioner = req.body.petitioner || "";
    existingCase.respondent = req.body.respondent || "";
    existingCase.filingDate = req.body.filingDate || req.body.date || "";
    existingCase.stepOfAdjournment = req.body.stepOfAdjournment || "";
    existingCase.otherSideAdvocateName =
      req.body.otherSideAdvocateName || req.body.advocate || "";
    existingCase.type = req.body.caseType || req.body.type || "";
    existingCase.advocate = req.body.otherSideAdvocateName || req.body.advocate || "";
    existingCase.phone = req.body.phone || "";
    existingCase.date = req.body.filingDate || req.body.date || "";
    existingCase.adjournmentDate = req.body.adjournmentDate || req.body.date || "";
    existingCase.status = req.body.status || "Pending";
    existingCase.notes = req.body.notes || "";
    existingCase.attachments = attachments;

    const updated = await existingCase.save();

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/cases/:id", verifyToken, withUser, requireCaseUser, async (req, res) => {
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

app.put(
  "/api/admin/users/:id/login-access",
  verifyToken,
  withUser,
  requireAdmin,
  async (req, res) => {
    try {
      const { loginEnabled } = req.body;
      const existingUser = await User.findById(req.params.id);

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (
        existingUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL &&
        loginEnabled !== true
      ) {
        return res.status(400).json({ message: "Primary admin access is locked" });
      }

      existingUser.loginEnabled = Boolean(loginEnabled);
      await existingUser.save();

      res.json(existingUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(runReminderJob, 60 * 1000);
runReminderJob();
