import { Router } from "express";
import {
  getSales,
  getSaleById,
  getSaleDetailsById,
  createSale,
  updateSale,
  deleteSale
} from "../controller/saleController.js";

import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = Router();


router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getSales
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empelado_libreria"),
  getSaleById
)

router.get(
  "/:id/detalles",
  authMiddleware,
  roleMiddleware("admin", "empelado_libreria"),
  getSaleDetailsById
)

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createSale
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateSale
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSale
);

export default router;
