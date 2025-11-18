import { pool } from "../../../config/db.js";

export const getRoles = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM roles");

        if (result.rows.length === 0) {
            return res.status(404).json({message: "No se encontraron roles"});
        }

        res.json(result.rows)

    } catch (err) {
        console.error("Error al obtener los roles: ", err);
        res.status(500).json({error: "Error interno del servidor"})
    }

}