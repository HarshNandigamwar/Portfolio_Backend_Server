import crypto from "crypto";

// Generate a signed token containing an expiry timestamp
// Format: base64(payload).signature
export const generateToken = () => {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // valid for 24 hours

  const payload = JSON.stringify({ role: "admin", expiresAt });
  const payloadBase64 = Buffer.from(payload).toString("base64");

  const signature = crypto
    .createHmac("sha256", process.env.TOKEN_SECRET)
    .update(payloadBase64)
    .digest("hex");

  return `${payloadBase64}.${signature}`;
};

// Verify a token's signature and expiry
export const verifyToken = (token) => {
  try {
    const [payloadBase64, signature] = token.split(".");

    if (!payloadBase64 || !signature) return false;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.TOKEN_SECRET)
      .update(payloadBase64)
      .digest("hex");

    // Signature length must match before timingSafeEqual, else it throws
    if (signature.length !== expectedSignature.length) return false;

    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );

    if (!isValidSignature) return false;

    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());

    if (Date.now() > payload.expiresAt) return false;

    return true;
  } catch (error) {
    return false;
  }
};