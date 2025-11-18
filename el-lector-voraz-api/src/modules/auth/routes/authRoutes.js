import { Router } from "express";
import { registrar, login, perfil } from "../controller/authController.js";
import authMiddleware from "../../../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registrar);
router.post("/login", login);
// router.get("/perfil", authMiddleware, perfil);

export default router;
