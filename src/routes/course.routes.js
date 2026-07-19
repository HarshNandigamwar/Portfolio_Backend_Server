import { Router } from "express";
import { uploadCourse } from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/upload", upload.single("certificateImage"), uploadCourse);

export default router;
