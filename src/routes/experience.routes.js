import { Router } from "express";
import { uploadExperience } from "../controllers/experience.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//  Upload Experience
router.post("/upload", upload.single("certificateImage"), uploadExperience);

export default router;
