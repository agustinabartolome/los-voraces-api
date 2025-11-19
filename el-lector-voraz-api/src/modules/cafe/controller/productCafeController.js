import db from "../../../config/db.js";
import {
  getAllProductsCafeQuery,
  getProductCafeByIdQuery,
  searchProductsCafeQuery,
  createProductCafeQuery,
  updateProductCafeQuery,
  deleteProductCafeQuery,
  updateProductCafeStockQuery
} from "../queries/productCafeQueries.js";

export const getProductsCafe = async (req, res) => {
  try {
    const result = await db.query(getAllProductsCafeQuery);
    res.json(result.rows);
  } catch (err) {
    console.error("getProductsCafe error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getProductCafeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(getProductCafeByIdQuery, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(result.rows[0]);

  } catch (err) {
    console.error("getProductCafeById error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const searchProductsCafe = async (req, res) => {
  const { categoria, subcategoria, nombre } = req.query;

  try {
    const result = await db.query(searchProductsCafeQuery, [
      categoria || null,
      subcategoria || null,
      nombre || null
    ]);

    res.json(result.rows);

  } catch (err) {
    console.error("searchProductsCafe error:", err);
    res.status(500).json({ error: "Error al buscar productos" });
  }
};

export const createProductCafe = async (req, res) => {
  const {
    nombre, descripcion, categoria, subcategoria,
    precio, codigo_producto, proveedor_id, stock
  } = req.body;

  if (!nombre || !categoria || !precio || !codigo_producto) {
    return res.status(400).json({
      error: "nombre, categoria, precio y codigo_producto son obligatorios"
    });
  }

  if (typeof precio !== "number") {
    return res.status(400).json({ error: "precio debe ser un número" });
  }

  try {
    const result = await db.query(createProductCafeQuery, [
      nombre,
      descripcion,
      categoria,
      subcategoria,
      precio,
      codigo_producto,
      proveedor_id || null,
      stock || 0
    ]);

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("createProductCafe error:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProductCafe = async (req, res) => {
  const { id } = req.params;

  const {
    nombre, descripcion, categoria, subcategoria,
    precio, codigo_producto, proveedor_id, stock
  } = req.body;

  try {
    const result = await db.query(updateProductCafeQuery, [
      nombre,
      descripcion,
      categoria,
      subcategoria,
      precio,
      codigo_producto,
      proveedor_id || null,
      stock,
      id
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(result.rows[0]);

  } catch (err) {
    console.error("updateProductCafe error:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const deleteProductCafe = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(deleteProductCafeQuery, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado" });

  } catch (err) {
    console.error("deleteProductCafe error:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

export const updateProductCafeStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== "number") {
    return res.status(400).json({ error: "quantity debe ser un número" });
  }

  try {
    const result = await db.query(updateProductCafeStockQuery, [
      quantity,
      id
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(result.rows[0]);

  } catch (err) {
    console.error("updateProductCafeStock error:", err);
    res.status(500).json({ error: "Error al actualizar stock" });
  }
};
