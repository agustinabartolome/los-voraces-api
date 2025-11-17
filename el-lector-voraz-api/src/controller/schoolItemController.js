import { pool } from "../config/db.js";


export const getItems = async (req, res) => {
  try {
    const { codigo, seccion, marca, nombre } = req.query;

    let query = `SELECT * FROM articulos_escolares WHERE 1=1`;
    const params = [];

    if (codigo) {
      params.push(`%${codigo}%`);
      query += ` AND codigo ILIKE $${params.length}`;
    }

    if (seccion) {
      params.push(`%${seccion}%`);
      query += ` AND seccion ILIKE $${params.length}`;
    }

    if (marca) {
      params.push(`%${marca}%`);
      query += ` AND marca ILIKE $${params.length}`;
    }

    if (nombre) {
      params.push(`%${nombre}%`);
      query += ` AND nombre ILIKE $${params.length}`;
    }

    query += ` ORDER BY id ASC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error("getItems error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const createItem = async (req, res) => {
  try {
    const { nombre, marca, precio, proveedor_id, stock, seccion, codigo } = req.body;

    const result = await pool.query(
      `INSERT INTO articulos_escolares (nombre, marca, precio, proveedor_id, stock, seccion, codigo)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [nombre, marca, precio, proveedor_id, stock, seccion, codigo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createItem error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateItem = async (req, res) => {
  const { id } = req.params;

  try {
    const { nombre, marca, precio, proveedor_id, stock, seccion, codigo } = req.body;

    const result = await pool.query(
      `UPDATE articulos_escolares 
       SET nombre=$1, marca=$2, precio=$3, proveedor_id=$4, stock=$5, seccion=$6, codigo=$7
       WHERE id=$8
       RETURNING *`,
      [nombre, marca, precio, proveedor_id, stock, seccion, codigo, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Artículo no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateItem error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM articulos_escolares WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Artículo no encontrado" });

    res.json({ message: "Artículo eliminado" });
  } catch (error) {
    console.error("deleteItem error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateItemStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      "UPDATE articulos_escolares SET stock = stock + $1 WHERE id=$2 RETURNING *",
      [quantity, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Artículo no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateItemStock error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
