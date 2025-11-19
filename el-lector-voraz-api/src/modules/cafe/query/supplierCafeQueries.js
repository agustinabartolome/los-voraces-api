
export const getAllSupplierCafeQuery = `
  SELECT id, nombre, telefono, email, categoria, catalogo, codigo_proveedor, created_at
  FROM proveedores_cafeteria
  ORDER BY id ASC
`;

export const getSupplierCafeByIdQuery = `
  SELECT *
  FROM proveedores_cafeteria
  WHERE id = $1
`;

export const searchSupplierCafeQuery = `
  SELECT *
  FROM proveedores_cafeteria
  WHERE ($1 IS NULL OR categoria ILIKE '%' || $1 || '%')
    AND ($2 IS NULL OR nombre ILIKE '%' || $2 || '%')
`;

export const createSupplierCafeQuery = `
  INSERT INTO proveedores_cafeteria 
    (nombre, telefono, email, categoria, catalogo, codigo_proveedor)
  VALUES ($1,$2,$3,$4,$5,$6)
  RETURNING *
`;

export const updateSupplierCafeQuery = `
  UPDATE proveedores_cafeteria
  SET nombre=$1, telefono=$2, email=$3, categoria=$4, catalogo=$5
  WHERE id=$6
  RETURNING *
`;

export const deleteSupplierCafeQuery = `
  DELETE FROM proveedores_cafeteria
  WHERE id=$1
  RETURNING *
`;
