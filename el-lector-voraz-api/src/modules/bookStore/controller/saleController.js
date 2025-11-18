import { pool } from "../../../config/db.js";


export const getSales = async (req, res) => {
  try {
    let query = `
      SELECT v.*, dv.tipo_producto, dv.producto_id, dv.cantidad, dv.precio_unitario, dv.subtotal, dv.categoria
      FROM ventas v
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
      WHERE 1=1
    `;
    const params = [];

    if (req.query.producto_id) {
      params.push(req.query.producto_id);
      query += ` AND dv.producto_id=$${params.length}`;
    }

    if (req.query.categoria) {
      params.push(req.query.categoria);
      query += ` AND dv.categoria=$${params.length}`;
    }

    if (req.query.fecha) {
      params.push(req.query.fecha);
      query += ` AND DATE(v.fecha)=$${params.length}`;
    }

    query += " ORDER BY v.id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("getSales error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const createSale = async (req, res) => {
  const { usuario_id, total, detalle } = req.body;

  try {
    const resultSale = await pool.query(
      "INSERT INTO ventas (usuario_id, total) VALUES ($1, $2) RETURNING *",
      [usuario_id, total]
    );

    const ventaId = resultSale.rows[0].id;

    for (const item of detalle) {
      await pool.query(
        `INSERT INTO detalle_ventas 
         (venta_id, tipo_producto, producto_id, cantidad, precio_unitario, subtotal, categoria)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          ventaId,
          item.tipo_producto,
          item.producto_id,
          item.cantidad,
          item.precio_unitario,
          item.subtotal,
          item.categoria,
        ]
      );
    }

    res.status(201).json({ sale: resultSale.rows[0], detalle });
  } catch (error) {
    console.error("createSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateSale = async (req, res) => {
  const { id } = req.params;
  const { usuario_id, total } = req.body;

  try {
    const result = await pool.query(
      "UPDATE ventas SET usuario_id=$1, total=$2 WHERE id=$3 RETURNING *",
      [usuario_id, total, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Venta no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const deleteSale = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM detalle_ventas WHERE venta_id=$1", [id]);

    const result = await pool.query(
      "DELETE FROM ventas WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Venta no encontrada" });

    res.json({ message: "Venta eliminada" });
  } catch (error) {
    console.error("deleteSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

