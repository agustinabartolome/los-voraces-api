import { Router } from "express";
import { getItems, createItem } from "../controller/schoolItemController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getItems
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createItem
);

export default router;
