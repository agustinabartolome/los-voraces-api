import pool from "../config/db.js";

export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, rol_id FROM usuarios");
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
