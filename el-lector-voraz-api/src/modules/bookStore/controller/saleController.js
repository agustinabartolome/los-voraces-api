import { pool } from "../../../config/db.js";


export const getSales = async (req, res) => {
  try {
    let query = `
      SELECT v.id, v.usuario_id, v.fecha, v.total FROM ventas v
    `;
    const { search, fecha, tipo_producto, categoria } = req.query;
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (search && search.trim() != '') {
      conditions.push(`
        EXISTS (
        SELECT 1 FROM detalle_ventas dv
        LEFT JOIN libros l on dv.producto_id = l.id AND dv.tipo_producto = 'libro'
        LEFT JOIN revistas r ON dv.producto_id = r.id AND dv.tipo_producto = 'revista'
        LEFT JOIN articulos_escolares ae ON dv.producto_id = ae.id AND dv.tipo_producto = 'articulo_escolar'
          WHERE dv.venta_id = v.id AND (
            l.titulo ILIKE $${paramIndex} OR
            r.nombre ILIKE $${paramIndex} OR
            ae.nombre ILIKE $${paramIndex}
          )
        )`);

        params.push(`%${search}%`);
        paramIndex++;

    } else {
      if (fecha) {
        conditions.push(`DATE(v.fecha) = $${paramIndex}`);
        params.push(fecha);
        paramIndex++;
      }

      if (tipo_producto) {
        conditions.push(`
          EXISTS (
            SELECT 1 FROM detalle_ventas dv
            WHERE dv.venta_id = v.id AND dv.tipo_producto ILIKE $${paramIndex}
          )
        `);
        params.push(`%${tipo_producto}%`);
        paramIndex++;
      }

      if (categoria) {
        conditions.push(`
            EXISTS (
              SELECT 1 FROM detalle_ventas dv
                LEFT JOIN libros l ON dv.producto_id = l.id AND dv.tipo_producto = 'libro'
                LEFT JOIN revistas r ON dv.producto_id = r.id AND dv.tipo_producto = 'revista'
                LEFT JOIN articulos_escolares ae ON dv.producto_id = ae.id AND dv.tipo_producto = 'articulo_escolar'
              WHERE
                dv.venta_id = v.id AND (
                    l.genero ILIKE $${paramIndex} OR
                    r.categoria ILIKE $${paramIndex} OR
                    ae.seccion ILIKE $${paramIndex}
                  )
              )
        `);
        params.push(`%${categoria}%`);
        paramIndex++;
      }
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += " ORDER BY v.fecha DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("getSales error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getSaleById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM ventas WHERE id = $1", [id])

    if (result.rows.length == 0) {
      return res.status(404).json({ error: "Venta no encontrada"})
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("getSaleById error: ", error)
    res.status(500).json({ error: "Error interno del servidor"})
  }
}


export const getSaleDetailsById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
    SELECT 
      dv.tipo_producto, 
      dv.producto_id, 
      dv.cantidad, 
      dv.precio_unitario, 
      dv.subtotal,
        CASE
          WHEN dv.tipo_producto = 'libro' THEN l.titulo
          WHEN dv.tipo_producto = 'revista' THEN r.nombre
          WHEN dv.tipo_producto = 'articulo_escolar' THEN ae.nombre
          ELSE 'Producto Desconocido'
        END AS nombre_producto
      FROM detalle_ventas dv
      LEFT JOIN libros l ON dv.producto_id = l.id AND dv.tipo_producto = 'libro'
      LEFT JOIN revistas r ON dv.producto_id = r.id AND dv.tipo_producto = 'revista'
      LEFT JOIN articulos_escolares ae ON dv.producto_id = ae.id AND dv.tipo_producto = 'articulo_escolar'
      WHERE dv.venta_id = $1;
    `;

    const result = await pool.query(query, [id])

    res.json(result.rows);

  } catch (error) {
    console.error("getSaleDetailsById error: ", error);
    res.status(500).json({error: "Error interno del servidor"})
  }
}

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

