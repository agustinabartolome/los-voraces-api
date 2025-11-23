import { Router } from "express";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById
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

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getSupplierById
)

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
