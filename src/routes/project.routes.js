import { Router } from "express";
import {
  uploadProject,
  getProjects,
} from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkAdminPassword } from "../middlewares/authMiddleware.js";

const router = Router();

//Upload project
router.post(
  "/upload_project",
  checkAdminPassword,
  upload.single("projectImage"),
  uploadProject,
);

//Get project
router.get("/get_project", getProjects);

export default router;
