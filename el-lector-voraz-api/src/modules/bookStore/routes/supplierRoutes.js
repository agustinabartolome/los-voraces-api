import { Router } from "express";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../controller/supplierController.js";

import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = Router();


router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getSuppliers
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createSupplier
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateSupplier
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSupplier
);

export default router;
