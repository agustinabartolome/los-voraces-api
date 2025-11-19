import { Router } from "express";
import {
  getBooks,
  getBooksByFilter,
  createBook,
  updateBook,
  deleteBook,
  updateBookStock,
  getBookById
} from "../controller/bookController.js";

import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = Router();


router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getBooks
);


router.get(
  "/buscar",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getBooksByFilter
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  getBookById
)

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  createBook
);


router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateBook
);


router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteBook
);


router.patch(
  "/stock/:id",
  authMiddleware,
  roleMiddleware("admin", "empleado_libreria"),
  updateBookStock
);

export default router;
