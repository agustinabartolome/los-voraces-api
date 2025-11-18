import { Router } from "express";
import { getRoles } from "../controller/roleController.js"

const router = Router()

router.get("/", getRoles);

export default router;