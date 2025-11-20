import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/routes/authRoutes.js";
import bookRoutes from "./modules/bookStore/routes/bookRoutes.js";
import magazineRoutes from "./modules/bookStore/routes/magazineRoutes.js";
import schoolItemRoutes from "./modules/bookStore/routes/schoolItemRoutes.js";
import roleRoutes from "./modules/roles/routes/roleRoutes.js";
import orderRoutes from "./modules/bookStore/routes/orderRoutes.js";
import supplierRoutes from "./modules/bookStore/routes/supplierRoutes.js"

import productCafeRoutes from "./modules/cafe/routes/productCafeRoutes.js";
import supplierCafeRoutes from "./modules/cafe/routes/supplierCafeRoutes.js";

dotenv.config();

import "./config/db.js"; 

const app = express();

app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/libros", bookRoutes);
app.use("/revistas", magazineRoutes);
app.use("/articulos", schoolItemRoutes);
app.use("/roles", roleRoutes);
app.use("/pedidos", orderRoutes)
app.use("/proveedores", supplierRoutes)

app.use("/cafeteria/productos", productCafeRoutes);
app.use("/cafeteria/proveedores", supplierCafeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
