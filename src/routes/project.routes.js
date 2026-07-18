import { Router } from "express";
import { uploadProject } from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/upload", upload.single("projectImage"), uploadProject);

export default router;
