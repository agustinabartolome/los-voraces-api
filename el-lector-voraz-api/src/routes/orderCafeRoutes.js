import { Router } from "express";
import {
  getOrderCafe,
  searchOrderCafe,
  createOrderCafe
} from "../controller/orderCafeController.js";

const router = Router();

router.get("/", getOrderCafe);
router.get("/search", searchOrderCafe);
router.post("/", createOrderCafe);

export default router;
