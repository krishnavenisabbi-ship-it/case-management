import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
import authMiddleware from "../middleware/authMiddleware.js";

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to Dashboard" });
});