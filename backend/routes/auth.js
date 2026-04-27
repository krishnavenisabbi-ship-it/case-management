import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


// ✅ REGISTER (basic placeholder)
router.post("/register", (req, res) => {
  res.json({ message: "Register working ✅" });
});


// ✅ LOGIN (basic placeholder)
router.post("/login", (req, res) => {
  res.json({ message: "Login working ✅" });
});


// ✅ GOOGLE LOGIN (MAIN)
router.post("/google", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 🔍 Check if user exists
    let user = await User.findOne({ email });

    // ➕ Create if not exists
    if (!user) {
      user = new User({
        email,
        name,
        role: "user",
        loginEnabled: true,
      });
      await user.save();
    }

    // 🔐 Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Send token + user
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone || "",
        loginEnabled: user.loginEnabled,
      },
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
});


// ✅ UPDATE USER DETAILS (PROTECTED)
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    );

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone || "",
      loginEnabled: user.loginEnabled,
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

// ✅ GET CURRENT USER (IMPORTANT)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone || "",
      loginEnabled: user.loginEnabled,
    });

  } catch (error) {
    console.error("Me route error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});
export default router;