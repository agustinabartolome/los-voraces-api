import { pool } from "../config/db.js";

export const getItems = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM articulos_escolares ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("getItems error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createItem = async (req, res) => {
  try {
    const { nombre, marca, precio, proveedor_id, stock } = req.body;

    const result = await pool.query(
      `INSERT INTO articulos_escolares (nombre, marca, precio, proveedor_id, stock)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [nombre, marca, precio, proveedor_id, stock]
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
    const { nombre, marca, precio, proveedor_id, stock } = req.body;

    const result = await pool.query(
      `UPDATE articulos_escolares 
       SET nombre=$1, marca=$2, precio=$3, proveedor_id=$4, stock=$5
       WHERE id=$6
       RETURNING *`,
      [nombre, marca, precio, proveedor_id, stock, id]
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
