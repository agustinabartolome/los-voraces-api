import { Router } from "express";
import { getUsuarios } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

// Solo ADMIN puede ver usuarios
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getUsuarios
);

export default router;
