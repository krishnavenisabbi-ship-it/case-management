import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "Registered successfully ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const token = jwt.sign({ id: user._id }, "secretkey", {
      expiresIn: "1d",
    });

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

export default router;