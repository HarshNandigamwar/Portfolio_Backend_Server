import { Router } from "express";
import {
  uploadCertificate,
  getCertificates,
} from "../controllers/certificate.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Upload Certificate
router.post(
  "/upload_certificate", 
  upload.single("certificateImage"),
  uploadCertificate,
);
// Get Certificates
router.get("/get_certificate", getCertificates);
export default router;
