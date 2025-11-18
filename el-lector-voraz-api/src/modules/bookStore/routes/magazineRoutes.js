import { Router } from "express";
import {
  getMagazines,
  createMagazine,
  getMagazineByFilter,
  updateMagazine,
  deleteMagazine,
  updateMagazineStock
} from "../controller/magazineController.js";

import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = Router();


router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getMagazines
);


router.get(
  "/buscar",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getMagazineByFilter
);


router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createMagazine
);


router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateMagazine
);


router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteMagazine
);


router.patch(
  "/stock/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateMagazineStock
);

export default router;
