import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Verify JWT Token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token (id + role)
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Attach full user from DB
export const withUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // ✅ IMPORTANT FIX

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    console.error("User fetch error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Check Admin Role (use DB role for accuracy)
export const requireAdmin = (req, res, next) => {
  if (!req.currentUser || req.currentUser.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};