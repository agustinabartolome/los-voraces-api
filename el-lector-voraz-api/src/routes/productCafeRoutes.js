import { Router } from "express";
import {
  getProductsCafe,
  searchProductsCafe,
  createProductCafe
} from "../controller/productCafeController.js";

const router = Router();

router.get("/", getProductsCafe);
router.get("/search", searchProductsCafe);
router.post("/", createProductCafe);

export default router;
