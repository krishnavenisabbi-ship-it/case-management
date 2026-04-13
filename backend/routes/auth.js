import express from "express";

const router = express.Router();

// Register route
router.post("/register", (req, res) => {
  res.json({ message: "Register working ✅" });
});

// Login route
router.post("/login", (req, res) => {
  res.json({ message: "Login working ✅" });
});

export default router;