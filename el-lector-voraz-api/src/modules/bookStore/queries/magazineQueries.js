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
    proveedor_id=$4, issn=$5,
    edicion=$6, numero=$7
  WHERE id=$8
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
