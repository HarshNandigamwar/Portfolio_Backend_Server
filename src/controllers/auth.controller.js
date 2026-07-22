// import crypto from "crypto";
// import { generateToken } from "../utils/token.js";

// // Helper: constant-time string comparison to prevent timing attacks
// const safeCompare = (a, b) => {
//   const bufA = Buffer.from(String(a));
//   const bufB = Buffer.from(String(b));

//   if (bufA.length !== bufB.length) return false;

//   return crypto.timingSafeEqual(bufA, bufB);
// };

// // Admin Login Controller
// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email and password are required!" });
//     }

//     const isEmailValid = safeCompare(email, process.env.ADMIN_EMAIL);
//     const isPasswordValid = safeCompare(password, process.env.ADMIN_PASSWORD);

//     if (!isEmailValid || !isPasswordValid) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid email or password!" });
//     }

//     const token = generateToken();

//     res.cookie("adminToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful!",
//     });
//   } catch (error) {
//     console.error("Error in adminLogin:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// // Admin Logout Controller
// export const adminLogout = async (req, res) => {
//   try {
//     res.clearCookie("adminToken");
//     return res.status(200).json({
//       success: true,
//       message: "Logged out successfully!",
//     });
//   } catch (error) {
//     console.error("Error in adminLogout:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// // Check Auth Status Controller (useful for frontend to verify login on page load)
// export const checkAuthStatus = async (req, res) => {
//   // If this runs, checkAdminPassword middleware already validated the token
//   return res.status(200).json({
//     success: true,
//     message: "Authenticated",
//   });
// };

import crypto from "crypto";
import { generateToken } from "../utils/token.js";

// Helper: constant-time string comparison to prevent timing attacks
const safeCompare = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));

  if (bufA.length !== bufB.length) return false;

  return crypto.timingSafeEqual(bufA, bufB);
};

// Cookie Configuration Helper
// const getCookieOptions = () => {
//   const isProd = process.env.NODE_ENV === "production";
//   return {
//     httpOnly: true,
//     secure: isProd, 
//     sameSite: isProd ? "none" : "lax",
//     path: "/", // Available across all routes
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   };
// };

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    // Production (Vercel) par secure MUST be true (HTTPS required)
    secure: isProd ? true : false,
    // Cross-domain cookies (Vercel -> Backend) ke liye 'none' mandatory hai
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
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

    const token = generateToken();

    // Set cookie with updated options
    res.cookie("adminToken", token, getCookieOptions());

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

// Admin Logout Controller
export const adminLogout = async (req, res) => {
  try {
    // Clear cookie with exact same scope options
    const cookieOptions = getCookieOptions();
    delete cookieOptions.maxAge;

    res.clearCookie("adminToken", {
      ...cookieOptions,
      expires: new Date(0),
    });

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

// Check Auth Status Controller
export const checkAuthStatus = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated",
  });
};
