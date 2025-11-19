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
router.delete("/:id", deleteSupplierCafe);
router.put("/:id", updateSupplierCafe);

export default router;
