import { Router } from "express";
import {
  uploadExperience,
  getExperiences,
} from "../controllers/experience.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//  Upload Experience
router.post(
  "/upload_experience",
  upload.single("certificateImage"),
  uploadExperience,
);
// Get Experience
router.get("/get_experience", getExperiences);

export default router;
