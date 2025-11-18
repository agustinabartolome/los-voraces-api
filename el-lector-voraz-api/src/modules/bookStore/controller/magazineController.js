import { pool } from "../../../config/db.js"; 


export const getMagazines = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero
      FROM revistas
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("getMagazines error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getMagazineByFilter = async (req, res) => {
  const { nombre, issn, numero } = req.query;

  let query = "SELECT * FROM revistas WHERE 1=1";
  const params = [];
  let index = 1;

  if (nombre) {
    query += ` AND nombre ILIKE $${index++}`;
    params.push(`%${nombre}%`);
  }

  if (issn) {
    query += ` AND issn = $${index++}`;
    params.push(issn);
  }

  if (numero) {
    query += ` AND numero = $${index++}`;
    params.push(numero);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("getMagazineByFilter error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const createMagazine = async (req, res) => {
  try {
    const { nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero } = req.body;

    const result = await pool.query(
      `INSERT INTO revistas (nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero]
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
    const { nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero } = req.body;

    const result = await pool.query(
      `UPDATE revistas 
       SET nombre=$1, categoria=$2, precio=$3, proveedor_id=$4, stock=$5, issn=$6, edicion=$7, numero=$8
       WHERE id=$9
       RETURNING *`,
      [nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero, id]
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
