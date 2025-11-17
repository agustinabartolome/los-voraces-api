import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const registrar = async (req, res) => {
  const { username, password, rol } = req.body;

  try {
    const existe = await pool.query(
      "SELECT * FROM usuarios WHERE username = $1",
      [username]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const nuevo = await pool.query(
      "INSERT INTO usuarios(username, password, rol_id) VALUES ($1,$2,(SELECT id FROM roles WHERE nombre=$3)) RETURNING id",
      [username, hashed, rol]
    );

    res.json({ message: "Usuario registrado", userId: nuevo.rows[0].id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en registro" });
  }
};

export const perfil = async (req, res) => {
  try {
    
    res.json({ usuario: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};


export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await pool.query(
      `SELECT usuarios.*, roles.nombre AS rol
       FROM usuarios 
       JOIN roles ON roles.id = usuarios.rol_id
       WHERE username = $1`,
      [username]
    );

    if (usuario.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const user = usuario.rows[0];

    const coincide = await bcrypt.compare(password, user.password);
    if (!coincide) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
};
