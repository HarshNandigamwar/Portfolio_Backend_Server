import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  checkAuthStatus,
} from "../controllers/auth.controller.js";
import { checkAdminPassword } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/check_auth", checkAdminPassword, checkAuthStatus);

export default router;