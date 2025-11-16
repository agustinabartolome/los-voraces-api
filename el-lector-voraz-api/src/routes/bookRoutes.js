import { Router } from "express";
import { getLibros, createLibro } from "../controller/bookController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getLibros
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createLibro
);

export default router;
