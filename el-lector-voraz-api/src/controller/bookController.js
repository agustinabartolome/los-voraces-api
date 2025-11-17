import { pool } from "../config/db.js";

export const getBooks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, titulo, isbn, precio, autor, editorial, genero, seccion, proveedor_id, stock
      FROM libros
      ORDER BY id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("getBooks error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getBooksByFilter = async (req, res) => {
  const { titulo, autor, editorial, isbn, genero } = req.query;

  let query = "SELECT * FROM libros WHERE 1=1";
  const params = [];
  let index = 1;

  if (titulo) {
    query += ` AND titulo ILIKE $${index++}`;
    params.push(`%${titulo}%`);
  }

  if (autor) {
    query += ` AND autor ILIKE $${index++}`;
    params.push(`%${autor}%`);
  }

  if (editorial) {
    query += ` AND editorial ILIKE $${index++}`;
    params.push(`%${editorial}%`);
  }

  if (isbn) {
    query += ` AND isbn = $${index++}`;
    params.push(isbn);
  }

  if (genero) {
    query += ` AND genero ILIKE $${index++}`;
    params.push(`%${genero}%`);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("getBooksByFilter error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createBook = async (req, res) => {
  try {
    const {
      titulo,
      isbn,
      precio,
      autor,
      editorial,
      genero,
      seccion,
      proveedor_id,
      stock,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO libros 
      (titulo, isbn, precio, autor, editorial, genero, seccion, proveedor_id, stock)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        titulo,
        isbn,
        precio,
        autor,
        editorial,
        genero,
        seccion,
        proveedor_id,
        stock,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateBook = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      titulo,
      isbn,
      precio,
      autor,
      editorial,
      genero,
      seccion,
      proveedor_id,
      stock,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE libros SET
        titulo=$1, isbn=$2, precio=$3, autor=$4,
        editorial=$5, genero=$6, seccion=$7,
        proveedor_id=$8, stock=$9
      WHERE id=$10
      RETURNING *
      `,
      [
        titulo,
        isbn,
        precio,
        autor,
        editorial,
        genero,
        seccion,
        proveedor_id,
        stock,
        id,
      ]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Libro no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM libros WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Libro no encontrado" });

    res.json({ message: "Libro eliminado" });
  } catch (error) {
    console.error("deleteBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateBookStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE libros
      SET stock = stock + $1
      WHERE id = $2
      RETURNING *
      `,
      [quantity, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Libro no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateBookStock error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
