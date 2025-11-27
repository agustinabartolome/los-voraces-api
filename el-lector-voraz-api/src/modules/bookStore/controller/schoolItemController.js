import { pool } from "../../../config/db.js";


export const getItems = async (req, res) => {
  try {
    const { search, codigo, seccion, marca, nombre } = req.query;

    let query = `SELECT * FROM articulos_escolares`;
    const conditions = [];
    const params = [];

    if (search && search.trim() != ''){
      conditions.push(`(
        nombre ILIKE $1 OR
        marca  ILIKE $1 OR
        seccion  ILIKE $1 OR
        codigo ILIKE $1
        )`)

        params.push(`%${search}%`)

    } else {
      let paramIndex = 1;
      if (nombre) {
        conditions.push(`nombre ILIKE $${paramIndex}`)
        params.push(`%${nombre}%`)
        paramIndex++
      }
      if (marca) {
        conditions.push(`marca ILIKE $${paramIndex}`)
        params.push(`%${marca}%`)
        paramIndex++
      }
      if (seccion) {
        conditions.push(`seccion ILIKE $${paramIndex}`)
        params.push(`%${seccion}%`)
        paramIndex++
      }
      if (codigo) {
        conditions.push(`codigo ILIKE $${paramIndex}`)
        params.push(`%${codigo}%`)
        paramIndex++
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += ` ORDER BY id ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("getItems error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getSchoolItemById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT *
      FROM articulos_escolares
      WHERE id = $1
      `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Articulo no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("getSchoolItemById error:", err);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};


export const createItem = async (req, res) => {
  try {
    const { nombre, marca, precio, proveedor_id, stock, seccion, codigo } = req.body;

    const result = await pool.query(
      `INSERT INTO articulos_escolares (nombre, marca, precio, proveedor_id, stock, seccion, codigo)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [nombre, marca, precio, proveedor_id, stock, seccion, codigo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createItem error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, marca, precio, proveedor_id, seccion, codigo } = req.body;

    const query = `
      UPDATE articulos_escolares 
       SET nombre=$1, marca=$2, precio=$3, proveedor_id=$4, seccion=$5, codigo=$6
       WHERE id=$7
       RETURNING *
       `

    const result = await pool.query(query, [nombre, marca, precio, proveedor_id, seccion, codigo, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Artículo no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateItem error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM articulos_escolares WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Artículo no encontrado" });

    res.json({ message: "Artículo eliminado" });
  } catch (error) {
    console.error("deleteItem error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const updateItemStock = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  if(typeof cantidad != 'number') {
    return res.status(400).json({error: "La cantidad debe ser un numero"})
  }

  let updateQuery = `
    UPDATE articulos_escolares
    SET stock = stock + $1
    WHERE id = $2
  `

  if(cantidad < 0){
    updateQuery += ` AND stock >= ABS($1)`;
  }

  updateQuery += ` RETURNING *`

  try {
    const result = await pool.query(updateQuery, [cantidad, id]);

    if (result.rows.length === 0){
      const errorMessage = cantidad < 0 ? "Stock insuficente" : "Libro no encontrado";
      const errorCode = cantidad < 0 ? 409:404;

      return res.status(errorCode).json({ error: errorMessage });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateItemStock error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
