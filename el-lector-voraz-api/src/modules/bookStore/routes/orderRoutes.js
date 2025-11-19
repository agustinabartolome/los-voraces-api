import { Router } from "express";
import {
  getOrders,
  getOrdersAndSupplier,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderAndSupplierById,
  getOrderDetailsById
} from "../controller/orderController.js";

import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = Router();


router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getOrdersAndSupplier
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getOrderAndSupplierById
)

router.get(
  "/:id/detalles",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getOrderDetailsById
)

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createOrder
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateOrder
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteOrder
);

export default router;
