import { Router } from "express";
import { uploadCertificate } from "../controllers/certificate.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/upload", upload.single("certificateImage"), uploadCertificate);

export default router;
