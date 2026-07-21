import { Router } from "express";
import {
  uploadExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
} from "../controllers/experience.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkAdminPassword } from "../middlewares/authMiddleware.js";

const router = Router();

//  Upload Experience
router.post(
  "/upload_experience",
  checkAdminPassword,
  upload.single("certificateImage"),
  uploadExperience,
);

// Get Experience
router.get("/get_experience", getExperiences);

// Update Experience
router.put(
  "/update_experience/:id",
  checkAdminPassword,
  upload.single("certificateImage"),
  updateExperience,
);

// Delete Experience
router.delete("/delete_experience/:id", checkAdminPassword, deleteExperience);

export default router;
