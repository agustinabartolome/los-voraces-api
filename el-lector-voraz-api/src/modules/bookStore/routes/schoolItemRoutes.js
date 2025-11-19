import { Router } from "express";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  updateItemStock,
  getSchoolItemById
} from "../controller/schoolItemController.js";

import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getItems
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getSchoolItemById
)

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createItem
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateItem
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  deleteItem
);

router.patch(
  "/stock/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateItemStock
);

export default router;
