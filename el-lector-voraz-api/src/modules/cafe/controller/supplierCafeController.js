import { pool } from "../../../config/db.js";
import {
  getAllSupplierCafeQuery,
  getSupplierCafeByIdQuery,
  searchSupplierCafeQuery,
  createSupplierCafeQuery,
  updateSupplierCafeQuery,
  deleteSupplierCafeQuery
} from "../queries/supplierCafeQueries.js";

export const getSupplierCafe = async (req, res) => {
  try {
    const { rows } = await pool.query(getAllSupplierCafeQuery);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
};

export const getSupplierCafeById = async (req, res) => {
  try {
    const { rows } = await pool.query(getSupplierCafeByIdQuery, [req.params.id]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Proveedor no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener proveedor" });
  }
};

export const searchSupplierCafe = async (req, res) => {
  const { categoria, nombre } = req.query;

  try {
    const { rows } = await pool.query(searchSupplierCafeQuery, [
      categoria || null,
      nombre || null
    ]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al filtrar proveedores" });
  }
};

export const createSupplierCafe = async (req, res) => {
  const { nombre, telefono, email, categoria, catalogo, codigo_proveedor } = req.body;

  if (!nombre || !codigo_proveedor)
    return res.status(400).json({ error: "Nombre y código del proveedor son obligatorios" });

  try {
    const { rows } = await pool.query(createSupplierCafeQuery, [
      nombre,
      telefono,
      email,
      categoria,
      catalogo,
      codigo_proveedor
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al crear proveedor" });
  }
};

export const updateSupplierCafe = async (req, res) => {
  const { nombre, telefono, email, categoria, catalogo } = req.body;

  try {
    const { rows } = await pool.query(updateSupplierCafeQuery, [
      nombre,
      telefono,
      email,
      categoria,
      catalogo,
      req.params.id
    ]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Proveedor no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar proveedor" });
  }
};

export const deleteSupplierCafe = async (req, res) => {
  try {
    const { rows } = await pool.query(deleteSupplierCafeQuery, [req.params.id]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Proveedor no encontrado" });

    res.json({ message: "Proveedor eliminado", proveedor: rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar proveedor" });
  }
};
