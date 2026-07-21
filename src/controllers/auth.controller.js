import { generateToken } from "../utils/token.js";
import crypto from "crypto";

// Helper: constant-time string comparison to prevent timing attacks
const safeCompare = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));

  // Lengths must match for timingSafeEqual, so pad/reject early if different
  if (bufA.length !== bufB.length) return false;

  return crypto.timingSafeEqual(bufA, bufB);
};

// Admin Login Controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required!" });
    }

    const isEmailValid = safeCompare(email, process.env.ADMIN_EMAIL);
    const isPasswordValid = safeCompare(password, process.env.ADMIN_PASSWORD);

    if (!isEmailValid || !isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password!" });
    }

    // Generate a signed token valid for 24 hours
    const token = generateToken();

    // Send token as an httpOnly cookie (safer than storing in localStorage)
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Admin Logout Controller (bonus — clears the cookie)
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error("Error in adminLogout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};