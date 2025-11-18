import { pool } from "../../../config/db.js";

export const getProductsCafe = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos_cafeteria ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const searchProductsCafe = async (req, res) => {
  const { categoria, subcategoria, nombre } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM productos_cafeteria
       WHERE ($1 IS NULL OR categoria ILIKE '%' || $1 || '%')
       AND ($2 IS NULL OR subcategoria ILIKE '%' || $2 || '%')
       AND ($3 IS NULL OR nombre ILIKE '%' || $3 || '%')`,
      [categoria || null, subcategoria || null, nombre || null]
    );

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "Error al buscar producto" });
  }
};

export const createProductCafe = async (req, res) => {
  const { nombre, descripcion, categoria, subcategoria, precio, codigo_producto, proveedor_id, stock } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO productos_cafeteria 
      (nombre, descripcion, categoria, subcategoria, precio, codigo_producto, proveedor_id, stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [nombre, descripcion, categoria, subcategoria, precio, codigo_producto, proveedor_id, stock]
    );

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Error al crear producto" });
  }
};
