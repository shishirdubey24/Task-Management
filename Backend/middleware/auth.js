/* eslint-disable no-undef */
/* middleware/auth.js */
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    // ✅ Check Authorization header first (for Bearer token)
    const authHeader = req.headers.authorization;
    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "test_secret_key"
    );

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
