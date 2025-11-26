import pool from "../../../config/db.js";
import {
    getAllMagazinesQuery,
    createMagazineQuery,
    updateMagazineQuery,
    deleteMagazineQuery
} from "../queries/magazineQueries.js";

export const getMagazines = async (req, res) => {
  try {
    const { search, nombre, categoria, issn } = req.query;

    let query = "SELECT * FROM revistas"
    const conditions = [];
    const params = [];

    if (search && search.trim() != '') {
      conditions.push(`(
        nombre ILIKE $1 OR
        categoria ILIKE $1 OR
        issn ILIKE $1
        )`)
        
        params.push(`%${search}%`)

    } else {
      let paramIndex = 1;
      if (nombre) {
        conditions.push(`nombre ILIKE $${paramIndex}`);
        params.push(`%${nombre}%`)
        paramIndex++
      }
      if (categoria) {
        conditions.push(`categoria ILIKE $${paramIndex}`)
        params.push(`%${categoria}%`)
        paramIndex++
      }
      if (issn) {
        conditions.push(`issn ILIKE $${paramIndex}`)
        params.push(`%${issn}%`)
        paramIndex++
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')} `
    }

    query += " ORDER BY nombre ASC"

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("getMagazines error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getMagazinesPages = async (req, res) => {
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

export const createMagazine = async (req, res) => {
  try {
    const { nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero } = req.body;

    const result = await pool.query(createMagazineQuery, [
      nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero
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
    const { nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero } = req.body;

    const result = await pool.query(updateMagazineQuery, [
      nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero, id
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
