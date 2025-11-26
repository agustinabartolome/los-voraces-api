import { pool } from "../../../config/db.js";

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

export const getOrdersAndSupplier = async (req, res) => {
  try {
    let query = `
      SELECT 
        oc.*, 
        p.nombre AS nombre_proveedor 
      FROM ordenes_compra oc
      LEFT JOIN proveedores p ON oc.proveedor_id = p.id
    `;
    const { search, estado, nombre_proveedor, tipo_producto, categoria } = req.query;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search && search.trim() != '') {
      conditions.push(`(oc.estado ILIKE $${paramIndex} OR p.nombre ILIKE $${paramIndex})`);
      params.push(`%${search}%`)
      paramIndex++

      conditions.push(`
        EXISTS (
          SELECT 1 FROM detalle_ordenes d
          LEFT JOIN libros l ON d.producto_id = l.id AND d.tipo_producto = 'libro'
          LEFT JOIN revistas r on d.producto_id = r.id AND d.tipo_producto = 'revista'
          LEFT JOIN articulos_escolares ae ON d.producto_id = ae.id AND d.tipo_producto = 'articulo_escolar'
          WHERE d.orden_id = oc.id AND (
            l.titulo ILIKE $${paramIndex} OR
            r.nombre ILIKE $${paramIndex} OR
            ae.nombre ILIKE $${paramIndex}
          )
        )`)

        params.push(`%${search}%`)
        paramIndex++

    } else {
      if (estado) {
        conditions.push(`oc.estado ILIKE $${paramIndex}`);
        params.push(`%${estado}%`)
        paramIndex++
      }
      if (nombre_proveedor) {
        conditions.push(`p.nombre ILIKE $${paramIndex}`);
        params.push(`%${nombre_proveedor}%`)
        paramIndex++
      }
      if (tipo_producto) {
        conditions.push(`
          EXISTS (SELECT 1 FROM detalle_ordenes d 
          WHERE d.orden_id = oc.id AND d.tipo_producto ILIKE $${paramIndex};)
          `);
        params.push(`%${tipo_producto}%`)
        paramIndex++
      }
      if (categoria) {
        conditions.push(`
          EXISTS (SELECT 1 FROM detalle_ordenes d 
           LEFT JOIN libros l ON d.producto_id = l.id AND d.tipo_producto = 'libro'
            LEFT JOIN revistas r ON d.producto_id = r.id AND d.tipo_producto = 'revista'
            LEFT JOIN articulos_escolares ae ON d.producto_id = ae.id AND d.tipo_producto = 'articulo_escolar'
            WHERE d.orden_id = oc.id AND (
              l.genero ILIKE $${paramIndex} OR
                r.categoria ILIKE $${paramIndex} OR
                ae.seccion ILIKE $${paramIndex}
              )
            )
          `);
        params.push(`%${categoria}%`)
        paramIndex++
      }
    }

    if (conditions.length > 0) {
      const joiner = search ? ' OR ' : ' AND '; query += ` WHERE ${conditions.join(joiner)}`;
    }

    query += ` ORDER BY oc.fecha DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows)
  } catch (err) {
    console.error("getOrders error: ", err);
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

export const getOrderAndSupplierById = async (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT
    oc.*,
    p.nombre AS nombre_proveedor
  FROM ordenes_compra oc
  LEFT JOIN proveedores p ON oc.proveedor_id = p.id
  WHERE oc.id = $1
`
  try {
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(result.rows[0])

  } catch (err) {
    console.error("getOrderById error: ", err);
    res.status(500).json({
      error: "Error interno del servidor"
    })
  }

}

export const getOrderDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
    SELECT 
        d.id, 
        d.orden_id,
        d.cantidad, 
        d.precio_unitario,
        d.tipo_producto,
        d.producto_id,
        CASE
          WHEN d.tipo_producto = 'libro' THEN l.titulo
          WHEN d.tipo_producto = 'revista' THEN r.nombre
          WHEN d.tipo_producto = 'articulo_escolar' THEN ae.nombre
          ELSE 'Producto Desconocido'
        END as nombre_producto -- Creamos un nuevo campo 'nombre_producto'
      FROM detalle_ordenes d
      LEFT JOIN libros l ON d.producto_id = l.id AND d.tipo_producto = 'libro'
      LEFT JOIN revistas r ON d.producto_id = r.id AND d.tipo_producto = 'revista'
      LEFT JOIN articulos_escolares ae ON d.producto_id = ae.id AND d.tipo_producto = 'articulo_escolar'
      WHERE d.orden_id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Detalles de orden no encontrados" });
    }

    res.json(result.rows);

  } catch (err) {
    console.error("getOrderDetailsById error:", err);
    res.status(500).json({
      error: "Error interno del servidor"
    });
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
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ error: "El campo 'estado' es requerido"})
  }

  try {
    const result = await pool.query(
      `UPDATE ordenes_compra SET estado=$1 WHERE id=$2 RETURNING *`,
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

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
