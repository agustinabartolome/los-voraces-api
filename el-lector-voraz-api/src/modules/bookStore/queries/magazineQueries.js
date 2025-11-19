export const getAllMagazinesQuery = `
  SELECT id, nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero
  FROM revistas
  ORDER BY id ASC
`;

export const getMagazineByIdQuery = `
  SELECT *
  FROM revistas
  WHERE id = $1
`;

export const createMagazineQuery = `
  INSERT INTO revistas (
    nombre, categoria, precio, proveedor_id, stock, issn, edicion, numero
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  RETURNING *
`;

export const updateMagazineQuery = `
  UPDATE revistas SET
    nombre=$1, categoria=$2, precio=$3,
    proveedor_id=$4, stock=$5, issn=$6,
    edicion=$7, numero=$8
  WHERE id=$9
  RETURNING *
`;

export const deleteMagazineQuery = `
  DELETE FROM revistas
  WHERE id=$1
  RETURNING *
`;

export const updateMagazineStockQuery = `
  UPDATE revistas
  SET stock = stock + $1
  WHERE id = $2
  RETURNING *
`;
