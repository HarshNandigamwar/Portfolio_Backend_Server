import { verifyToken } from "../utils/token.js";

// Manually parse cookies from the raw header (no external package needed)
const parseCookies = (cookieHeader = "") => {
  const cookies = {};
  cookieHeader.split(";").forEach((pair) => {
    const [key, ...valueParts] = pair.trim().split("=");
    if (key) cookies[key] = decodeURIComponent(valueParts.join("="));
  });
  return cookies;
};

export const checkAdminPassword = (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.adminToken;

  if (!token || !verifyToken(token)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized! Please login again.",
    });
  }

  next();
};