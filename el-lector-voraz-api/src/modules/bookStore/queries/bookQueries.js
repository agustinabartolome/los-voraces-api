
export const getAllBooksQuery = `
  SELECT id, titulo, isbn, precio, autor, editorial, genero, seccion, proveedor_id, stock
  FROM libros
  ORDER BY id ASC
`;

export const getBookByIdQuery = `
  SELECT *
  FROM libros
  WHERE id = $1
`;

export const createBookQuery = `
  INSERT INTO libros (
    titulo, isbn, precio, autor, editorial, genero, seccion, proveedor_id, stock
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
  RETURNING *
`;

export const updateBookQuery = `
  UPDATE libros SET
    titulo=$1, isbn=$2, precio=$3, autor=$4,
    editorial=$5, genero=$6, seccion=$7,
    proveedor_id=$8, stock=$9
  WHERE id=$10
  RETURNING *
`;

export const deleteBookQuery = `
  DELETE FROM libros WHERE id=$1 RETURNING *
`;

export const updateBookStockQuery = `
  UPDATE libros
  SET stock = stock + $1
  WHERE id = $2
  RETURNING *
`;
