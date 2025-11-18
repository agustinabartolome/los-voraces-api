import { pool } from "../config/db.js";

export const getSupplierCafe = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proveedores_cafeteria ORDER BY id ASC");
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
};

export const getSupplierCafeById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM proveedores_cafeteria WHERE id=$1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Error al buscar proveedor" });
  }
};

export const searchSupplierCafe = async (req, res) => {
  const { categoria, nombre } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM proveedores_cafeteria 
       WHERE ($1 IS NULL OR categoria ILIKE '%' || $1 || '%')
       AND ($2 IS NULL OR nombre ILIKE '%' || $2 || '%')`,
      [categoria || null, nombre || null]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: "Error al filtrar proveedores" });
  }
};

export const createSupplierCafe = async (req, res) => {
  const { nombre, telefono, email, categoria, catalogo, codigo_proveedor } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO proveedores_cafeteria 
      (nombre, telefono, email, categoria, catalogo, codigo_proveedor) 
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, telefono, email, categoria, catalogo, codigo_proveedor]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Error al crear proveedor" });
  }
};

export const updateSupplierCafe = async (req, res) => {
  const { nombre, telefono, email, categoria, catalogo } = req.body;

  try {
    await pool.query(
      `UPDATE proveedores_cafeteria 
       SET nombre=$1, telefono=$2, email=$3, categoria=$4, catalogo=$5 
       WHERE id=$6`,
      [nombre, telefono, email, categoria, catalogo, req.params.id]
    );
    res.json({ message: "Proveedor actualizado" });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar proveedor" });
  }
};

export const deleteSupplierCafe = async (req, res) => {
  try {
    await pool.query("DELETE FROM proveedores_cafeteria WHERE id=$1", [req.params.id]);
    res.json({ message: "Proveedor eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar proveedor" });
  }
};
