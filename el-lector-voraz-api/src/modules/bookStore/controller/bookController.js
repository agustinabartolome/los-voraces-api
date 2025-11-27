import db from "../../../config/db.js";
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
    const { search, titulo, autor, editorial, isbn, genero } = req.query;

    let query = "SELECT * FROM libros";
    const conditions= [];
    const params = [];
    
    if (search && search.trim() != '') {
      conditions.push(`(
        titulo ILIKE $1 OR
        autor ILIKE $1 OR
        editorial  ILIKE $1 OR
        isbn ILIKE $1 OR
        genero ILIKE $1 
        )`)

      params.push(`%${search}%`)

    } else {
      let paramIndex = 1;
      if (titulo) {
        conditions.push(`titulo ILIKE $${paramIndex}`);
        params.push(`%${titulo}%`)
        paramIndex++
      }
      if (autor) {
        conditions.push(`autor ILIKE $${paramIndex}`);
        params.push(`%${autor}%`)
        paramIndex++
      }
      if (editorial) {
        conditions.push(`editorial ILIKE $${paramIndex}`);
        params.push(`%${editorial}%`)
        paramIndex++
      }
      if (isbn) {
        conditions.push(`isbn ILIKE $${paramIndex}`);
        params.push(`%${isbn}%`)
        paramIndex++
      }
      if (genero) {
        conditions.push(`genero ILIKE $${paramIndex}`);
        params.push(`%${genero}%`)
        paramIndex++
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += " ORDER BY titulo ASC";

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("getBooks error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query(getBookByIdQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("getBookById error:", err);
    res.status(500).json({
      error: "Error interno del servidor"
    });
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
      proveedor_id
    } = req.body;

    const result = await db.query(updateBookQuery, [
      titulo, isbn, precio, autor,
      editorial, genero, seccion,
      proveedor_id, id
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
  const { cantidad } = req.body;

  if(typeof cantidad != 'number') {
    return res.status(400).json({error: "La cantidad debe ser un numero"})
  }

  let updateQuery = `
    UPDATE libros
    SET stock = stock + $1
    WHERE id = $2
  `

  if(cantidad < 0){
    updateQuery += ` AND stock >= ABS($1)`;
  }

  updateQuery += ` RETURNING *`

  try {
    const result = await db.query(updateQuery, [cantidad, id]);

    if (result.rows.length === 0) {
      const errorMessage = cantidad < 0 ? "Stock insuficente" : "Libro no encontrado";
      const errorCode = cantidad < 0 ? 409:404;

      return res.status(errorCode).json({ error: errorMessage });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateBookStock error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
