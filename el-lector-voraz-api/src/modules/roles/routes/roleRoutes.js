import { Router } from "express";
import { getRoles, getRoleById } from "../controller/roleController.js"
import authMiddleware from "../../../middleware/authMiddleware.js";

const router = Router()

router.get("/", getRoles);
router.get(
    "/:id", 
    authMiddleware,
    getRoleById);

export default router;