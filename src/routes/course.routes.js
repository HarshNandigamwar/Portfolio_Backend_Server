import { Router } from "express";
import { uploadCourse, getCourses } from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//Upload Course Route
router.post("/upload_course", upload.single("certificateImage"), uploadCourse);

//Get Course Route
router.get("/get_course", getCourses) ;

export default router;
