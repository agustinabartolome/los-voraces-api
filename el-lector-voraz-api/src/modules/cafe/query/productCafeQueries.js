export const getAllProductsCafeQuery = `
  SELECT id, nombre, descripcion, categoria, subcategoria,
         precio, codigo_producto, proveedor_id, stock
  FROM productos_cafeteria
  ORDER BY id ASC
`;

export const getProductCafeByIdQuery = `
  SELECT *
  FROM productos_cafeteria
  WHERE id = $1
`;

export const searchProductsCafeQuery = `
  SELECT *
  FROM productos_cafeteria
  WHERE ($1 IS NULL OR categoria ILIKE '%' || $1 || '%')
    AND ($2 IS NULL OR subcategoria ILIKE '%' || $2 || '%')
    AND ($3 IS NULL OR nombre ILIKE '%' || $3 || '%')
`;

export const createProductCafeQuery = `
  INSERT INTO productos_cafeteria
    (nombre, descripcion, categoria, subcategoria,
     precio, codigo_producto, proveedor_id, stock)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  RETURNING *
`;

export const updateProductCafeQuery = `
  UPDATE productos_cafeteria SET
    nombre=$1, descripcion=$2, categoria=$3, subcategoria=$4,
    precio=$5, codigo_producto=$6, proveedor_id=$7, stock=$8
  WHERE id=$9
  RETURNING *
`;

export const deleteProductCafeQuery = `
  DELETE FROM productos_cafeteria
  WHERE id=$1
  RETURNING *
`;

export const updateProductCafeStockQuery = `
  UPDATE productos_cafeteria
  SET stock = stock + $1
  WHERE id = $2
  RETURNING *
`;
