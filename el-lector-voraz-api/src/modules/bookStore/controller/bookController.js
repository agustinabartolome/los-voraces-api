import db from "../../config/db.js";
import {
    getAllBooksQuery,
    getBookByIdQuery,
    createBookQuery,
    updateBookQuery,
    deleteBookQuery,
    updateBookStockQuery
} from "../queries/bookQueries.js";

export const getBooks = async (req, res) => {
  try {
    const result = await db.query(getAllBooksQuery);
    res.json(result.rows);
  } catch (err) {
    console.error("getBooks error:", err);
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
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("getBooksByFilter error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const createBook = async (req, res) => {
  try {
    const {
      titulo, isbn, precio, autor,
      editorial, genero, seccion,
      proveedor_id, stock
    } = req.body;

    const result = await db.query(createBookQuery, [
      titulo, isbn, precio, autor,
      editorial, genero, seccion,
      proveedor_id, stock
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createBook error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo, isbn, precio, autor,
      editorial, genero, seccion,
      proveedor_id, stock
    } = req.body;

    const result = await db.query(updateBookQuery, [
      titulo, isbn, precio, autor,
      editorial, genero, seccion,
      proveedor_id, stock, id
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Libro no encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateBook error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(deleteBookQuery, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Libro no encontrado" });

    res.json({ message: "Libro eliminado" });
  } catch (err) {
    console.error("deleteBook error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateBookStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const result = await db.query(updateBookStockQuery, [quantity, id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Libro no encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateBookStock error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
