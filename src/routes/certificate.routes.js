import { Router } from "express";
import {
  uploadCertificate,
  getCertificates,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificate.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkAdminPassword } from "../middlewares/authMiddleware.js";

const router = Router();

// Create - Upload Certificate
router.post(
  "/upload_certificate",
  checkAdminPassword,
  upload.single("certificateImage"),
  uploadCertificate,
);

// Read - Get Certificates
router.get("/get_certificate", getCertificates);

// Update Certificate
router.put(
  "/update_certificate/:id",
  checkAdminPassword,
  upload.single("certificateImage"),
  updateCertificate,
);

// Delete Certificate
router.delete("/delete_certificate/:id", checkAdminPassword, deleteCertificate);

export default router;
