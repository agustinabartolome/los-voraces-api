import { Router } from "express";
import {
  getProductsCafe,
  getProductCafeById,
  searchProductsCafe,
  createProductCafe,
  updateProductCafe,
  deleteProductCafe,
  updateProductCafeStock
} from "../controller/productCafeController.js";

import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_cafeteria"),
  getProductsCafe
);

router.get(
  "/search",
  authMiddleware,
  roleMiddleware("admin", "empleado_cafeteria"),
  searchProductsCafe
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_cafeteria"),
  getProductCafeById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_cafeteria"),
  createProductCafe
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_cafeteria"),
  updateProductCafe
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProductCafe
);

router.patch(
  "/stock/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_cafeteria"),
  updateProductCafeStock
);

export default router;
