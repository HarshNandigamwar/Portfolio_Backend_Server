import { Router } from "express";
import {
  uploadCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkAdminPassword } from "../middlewares/authMiddleware.js";

const router = Router();

// Create - Upload Course
router.post(
  "/upload_course",
  checkAdminPassword,
  upload.single("certificateImage"),
  uploadCourse,
);

// Read - Get Course
router.get("/get_course", getCourses);

// Update Course
router.put(
  "/update_course/:id",
  checkAdminPassword,
  upload.single("certificateImage"),
  updateCourse,
);

// Delete Certificate
router.delete("/delete_course/:id", checkAdminPassword, deleteCourse);

export default router;
