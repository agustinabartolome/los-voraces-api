import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import magazineRoutes from "./routes/magazineRoutes.js";
import schoolItemRoutes from "./routes/schoolItemRoutes.js";

dotenv.config();

import "./config/db.js"; 

const app = express();

app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/libros", bookRoutes);
app.use("/revistas", magazineRoutes);
app.use("/articulos", schoolItemRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
