import { Router } from "express";
import {
  uploadProject,
  getProjects,
  updateProject,
  deleteProject,
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

//Update project
router.put(
  "/update_project/:id",
  checkAdminPassword,
  upload.single("projectImage"),
  updateProject,
);

// Delete Project
router.delete("/delete_project/:id", checkAdminPassword, deleteProject);

export default router;
