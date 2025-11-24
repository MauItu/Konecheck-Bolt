const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/database"); // IMPORTA TU BD CORRECTAMENTE

exports.login = async (req, res) => {
  try {
    const { identificacion, password } = req.body;

    if (!identificacion || !password) {
      return res.status(400).json({ mensaje: "Faltan credenciales" });
    }

    // Buscar usuario
    const query = `
      SELECT 
        id,
        identificacion,
        password_encriptada,
        nombres,
        apellidos,
        rango
      FROM usuario_fuerza_publica
      WHERE identificacion = $1
    `;

    const { rows } = await pool.query(query, [identificacion]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Validar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password_encriptada);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario.id,
        identificacion: usuario.identificacion,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rango: usuario.rango,
      },
      process.env.JWT_SECRET || "SUPER_SECRETO_CAMBIAR",
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rango: usuario.rango,
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
