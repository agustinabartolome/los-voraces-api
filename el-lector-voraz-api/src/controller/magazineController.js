import { pool } from "../config/db.js";

export const getMagazines = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM revistas ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("getMagazines error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createMagazine = async (req, res) => {
  try {
    const { titulo, categoria, precio, proveedor_id, stock } = req.body;

    const result = await pool.query(
      `INSERT INTO revistas (titulo, categoria, precio, proveedor_id, stock)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [titulo, categoria, precio, proveedor_id, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createMagazine error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateMagazine = async (req, res) => {
  const { id } = req.params;
  try {
    const { titulo, categoria, precio, proveedor_id, stock } = req.body;

    const result = await pool.query(
      `UPDATE revistas 
       SET titulo=$1, categoria=$2, precio=$3, proveedor_id=$4, stock=$5
       WHERE id=$6
       RETURNING *`,
      [titulo, categoria, precio, proveedor_id, stock, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Revista no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateMagazine error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteMagazine = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM revistas WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Revista no encontrada" });

    res.json({ message: "Revista eliminada" });
  } catch (error) {
    console.error("deleteMagazine error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateMagazineStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      "UPDATE revistas SET stock = stock + $1 WHERE id=$2 RETURNING *",
      [quantity, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Revista no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateMagazineStock error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
