import pool from "../../../config/db.js";
import {
    getAllMagazinesQuery,
    createMagazineQuery,
    updateMagazineQuery,
    deleteMagazineQuery
} from "../queries/magazineQueries.js";

export const getMagazines = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 10; 
    const offset = (page - 1) * limit;

    const magazinesResult = await pool.query(
      `${getAllMagazinesQuery} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query(`SELECT COUNT(*) FROM revistas`);
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      page,
      limit,
      total,
      totalPages,
      data: magazinesResult.rows
    });

  } catch (err) {
    console.error("getMagazines error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getMagazineById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT *
      FROM revistas
      WHERE id = $1
      `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Revista no encontrada" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("getMagazineById error:", err);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};

export const getMagazineByFilter = async (req, res) => {
  const { titulo, editorial, proveedor_id, precioMin, precioMax } = req.query;

  let query = "SELECT * FROM revistas WHERE 1=1";
  const params = [];
  let index = 1;

  if (titulo) {
    query += ` AND titulo ILIKE $${index++}`;
    params.push(`%${titulo}%`);
  }

  if (editorial) {
    query += ` AND editorial ILIKE $${index++}`;
    params.push(`%${editorial}%`);
  }

  if (proveedor_id) {
    if (isNaN(proveedor_id)) {
      return res.status(400).json({ error: "proveedor_id debe ser numérico" });
    }
    query += ` AND proveedor_id = $${index++}`;
    params.push(proveedor_id);
  }

  if (precioMin) {
    if (isNaN(precioMin)) {
      return res.status(400).json({ error: "precioMin debe ser numérico" });
    }
    query += ` AND precio >= $${index++}`;
    params.push(precioMin);
  }

  if (precioMax) {
    if (isNaN(precioMax)) {
      return res.status(400).json({ error: "precioMax debe ser numérico" });
    }
    query += ` AND precio <= $${index++}`;
    params.push(precioMax);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (err) {
    console.error("getMagazinesByFilter error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const createMagazine = async (req, res) => {
  try {
    const { titulo, precio, editorial, stock, proveedor_id } = req.body;

    const result = await pool.query(createMagazineQuery, [
      titulo, precio, editorial, stock, proveedor_id
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createMagazine error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateMagazine = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, precio, editorial, stock, proveedor_id } = req.body;

    const result = await pool.query(updateMagazineQuery, [
      titulo, precio, editorial, stock, proveedor_id, id
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Revista no encontrada" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateMagazine error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteMagazine = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(deleteMagazineQuery, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Revista no encontrada" });

    res.json({ message: "Revista eliminada" });
  } catch (err) {
    console.error("deleteMagazine error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateMagazineStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const result = await db.query(updateMagazineStockQuery, [quantity, id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Revista no encontrada" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateMagazineStock error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
