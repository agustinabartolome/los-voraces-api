import { pool } from "../../../config/db.js";

export const getOrderCafe = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pedidos_cafeteria ORDER BY fecha DESC");
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

export const searchOrderCafe = async (req, res) => {
  const { fecha, categoria, producto } = req.query;

  try {
    const result = await pool.query(
      `SELECT pc.*, p.nombre AS producto 
       FROM pedidos_cafeteria pc
       JOIN productos_cafeteria p ON p.id = pc.producto_id
       WHERE ($1 IS NULL OR DATE(pc.fecha) = DATE($1))
       AND ($2 IS NULL OR pc.categoria ILIKE '%' || $2 || '%')
       AND ($3 IS NULL OR p.nombre ILIKE '%' || $3 || '%')`,
      [fecha || null, categoria || null, producto || null]
    );

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "Error al filtrar pedidos" });
  }
};

export const createOrderCafe = async (req, res) => {
  const { codigo_orden, categoria, producto_id, descripcion, precio, cantidad, total, proveedor_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO pedidos_cafeteria 
      (codigo_orden, categoria, producto_id, descripcion, precio, cantidad, total, proveedor_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [codigo_orden, categoria, producto_id, descripcion, precio, cantidad, total, proveedor_id]
    );

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Error al crear pedido" });
  }
};
