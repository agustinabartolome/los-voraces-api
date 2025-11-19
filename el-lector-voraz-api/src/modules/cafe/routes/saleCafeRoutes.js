import { Router } from "express";
import {
  getSupplierCafe,
  getSupplierCafeById,
  searchSupplierCafe,
  createSupplierCafe,
  updateSupplierCafe,
  deleteSupplierCafe
} from "../controller/supplierCafeController.js";

const router = Router();

router.get("/", getSupplierCafe);
router.get("/search", searchSupplierCafe);
router.get("/:id", getSupplierCafeById);

router.post("/", createSupplierCafe);

router.put("/:id", updateSupplierCafe);

router.delete("/:id", deleteSupplierCafe);

export default router;

