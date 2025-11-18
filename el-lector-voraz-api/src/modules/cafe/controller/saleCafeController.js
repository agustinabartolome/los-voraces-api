import { pool } from "../../../config/db.js";

export const getSalesCafe = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ventas_cafeteria ORDER BY fecha DESC");
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

export const searchSalesCafe = async (req, res) => {
  const { categoria, nombre } = req.query;

  try {
    const result = await pool.query(
      `SELECT v.*, p.nombre AS producto
       FROM ventas_cafeteria v
       JOIN productos_cafeteria p ON p.id = v.producto_id
       WHERE ($1 IS NULL OR v.categoria ILIKE '%' || $1 || '%')
       AND ($2 IS NULL OR p.nombre ILIKE '%' || $2 || '%')`,
      [categoria || null, nombre || null]
    );

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "Error al filtrar ventas" });
  }
};

export const createSalesCafe = async (req, res) => {
  const { codigo_venta, producto_id, descripcion, categoria, precio, cantidad, total } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO ventas_cafeteria 
      (codigo_venta, producto_id, descripcion, categoria, precio, cantidad, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [codigo_venta, producto_id, descripcion, categoria, precio, cantidad, total]
    );

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Error al registrar venta" });
  }
};
