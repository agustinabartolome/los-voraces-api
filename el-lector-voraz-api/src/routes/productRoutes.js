import { Router } from "express";
import {
  getLibros,
  createLibro,
  getRevistas,
  createRevista,
  getArticulos,
  createArticulo
} from "../controller/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

// =================== LIBROS ===================
router.get(
  "/libros",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getLibros
);

router.post(
  "/libros",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createLibro
);

// =================== REVISTAS ===================
router.get(
  "/revistas",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getRevistas
);

router.post(
  "/revistas",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createRevista
);

// =================== ARTÍCULOS ===================
router.get(
  "/articulos",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getArticulos
);

router.post(
  "/articulos",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createArticulo
);

export default router;

