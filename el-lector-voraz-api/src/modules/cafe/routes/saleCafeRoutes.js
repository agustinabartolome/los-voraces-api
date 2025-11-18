import { Router } from "express";
import {
  getSalesCafe,
  searchSalesCafe,
  createSalesCafe
} from "../controller/salesCafeController.js";

const router = Router();

router.get("/", getSalesCafe);
router.get("/search", searchSalesCafe);
router.post("/", createSalesCafe);

export default router;
