import { pool } from "../../../config/db.js";

export const getSuppliers = async (req, res) => {
  try {
    const { search, nombre, categoria, } = req.query;

    let query = "SELECT * FROM proveedores";
    const conditions = [];
    const params = [];

    if (search && search.trim() != '') {
      conditions.push(`(
        nombre ILIKE $1 OR
        categoria ILIKE $1
        )`);

      params.push(`%${search}%`)

    } else {
      let paramIndex = 1;
      if (nombre) {
        conditions.push(`nombre ILIKE $${paramIndex}`)
        params.push(`%${nombre}%`);
        paramIndex++
      }
      if (categoria) {
        conditions.push(`categoria ILIKE $${paramIndex}`)
        params.push(`%${categoria}%`);
        paramIndex++
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.length > 0}`
    }

    query +=  " ORDER BY nombre ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("getSuppliers error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const createSupplier = async (req, res) => {
  try {
    const { nombre, telefono, email, direccion, categoria } = req.body;

    const result = await pool.query(
      `INSERT INTO proveedores (nombre, telefono, email, direccion, categoria)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [nombre, telefono, email, direccion, categoria]
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
    const { nombre, telefono, email, direccion, categoria } = req.body;

    const result = await pool.query(
      `UPDATE proveedores 
       SET nombre=$1, telefono=$2, email=$3, direccion=$4, categoria=$5
       WHERE id=$6
       RETURNING *`,
      [nombre, telefono, email, direccion, categoria, id]
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
