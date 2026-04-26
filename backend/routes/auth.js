import express from "express";
import User from "../models/User.js";   // ✅ IMPORT MODEL
import verifyToken from "../middleware/authMiddleware.js"; // ✅ AUTH

const router = express.Router();

// Register route
router.post("/register", (req, res) => {
  res.json({ message: "Register working ✅" });
});

// Login route
router.post("/login", (req, res) => {
  res.json({ message: "Login working ✅" });
});

// ✅ UPDATE USER DETAILS (PROTECTED)
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id, // ✅ comes from middleware
      { name, phone },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;