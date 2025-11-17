import { pool } from "../config/db.js";

export const getOrders = async (req, res) => {
  try {
    let query = `
      SELECT oc.*, do.tipo_producto, do.producto_id, do.cantidad, do.precio_unitario, do.categoria
      FROM ordenes_compra oc
      LEFT JOIN detalle_ordenes do ON oc.id = do.orden_id
      WHERE 1=1
    `;
    const params = [];

    if (req.query.producto_id) {
      params.push(req.query.producto_id);
      query += ` AND do.producto_id=$${params.length}`;
    }

    if (req.query.categoria) {
      params.push(req.query.categoria);
      query += ` AND do.categoria=$${params.length}`;
    }

    if (req.query.fecha) {
      params.push(req.query.fecha);
      query += ` AND DATE(oc.fecha)=$${params.length}`;
    }

    query += " ORDER BY oc.id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("getOrders error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const createOrder = async (req, res) => {
  const { proveedor_id, estado, detalle } = req.body;

  try {
    const resultOrder = await pool.query(
      "INSERT INTO ordenes_compra (proveedor_id, estado) VALUES ($1, $2) RETURNING *",
      [proveedor_id, estado || "pendiente"]
    );

    const orderId = resultOrder.rows[0].id;

    for (const item of detalle) {
      await pool.query(
        `INSERT INTO detalle_ordenes (orden_id, tipo_producto, producto_id, cantidad, precio_unitario, categoria)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [orderId, item.tipo_producto, item.producto_id, item.cantidad, item.precio_unitario, item.categoria]
      );
    }

    res.status(201).json({ order: resultOrder.rows[0], detalle });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { proveedor_id, estado } = req.body;

  try {
    const result = await pool.query(
      `UPDATE ordenes_compra SET proveedor_id=$1, estado=$2 WHERE id=$3 RETURNING *`,
      [proveedor_id, estado, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Orden no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateOrder error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM detalle_ordenes WHERE orden_id=$1", [id]);

    const result = await pool.query(
      "DELETE FROM ordenes_compra WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Orden no encontrada" });

    res.json({ message: "Orden eliminada" });
  } catch (error) {
    console.error("deleteOrder error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
