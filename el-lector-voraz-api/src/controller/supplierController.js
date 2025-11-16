import { pool } from "../config/db.js";

export const getSuppliers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proveedores ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("getSuppliers error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const { nombre, telefono, email, direccion } = req.body;

    const result = await pool.query(
      `INSERT INTO proveedores (nombre, telefono, email, direccion)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [nombre, telefono, email, direccion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createSupplier error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const { nombre, telefono, email, direccion } = req.body;

    const result = await pool.query(
      `UPDATE proveedores 
       SET nombre=$1, telefono=$2, email=$3, direccion=$4
       WHERE id=$5
       RETURNING *`,
      [nombre, telefono, email, direccion, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Proveedor no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateSupplier error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM proveedores WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Proveedor no encontrado" });

    res.json({ message: "Proveedor eliminado" });
  } catch (error) {
    console.error("deleteSupplier error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};