import { Router } from "express";
import {
  uploadCertificate,
  getCertificates,
  updateCertificate,
} from "../controllers/certificate.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkAdminPassword } from "../middlewares/authMiddleware.js";

const router = Router();

// Upload Certificate
router.post(
  "/upload_certificate",
  checkAdminPassword,
  upload.single("certificateImage"),
  uploadCertificate,
);
// Update Certificate
router.put(
  "/update_certificate/:id",
  checkAdminPassword,
  upload.single("certificateImage"),
  updateCertificate,
);
// Get Certificates
router.get("/get_certificate", getCertificates);
export default router;
