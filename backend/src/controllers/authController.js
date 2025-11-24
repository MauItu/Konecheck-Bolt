const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/database");

class AuthController {

  async login(req, res, next) {
    try {
      console.log("BODY LOGIN:", req.body);

      const { identificacion, password } = req.body;

      if (!identificacion || !password) {
        return res.status(400).json({
          mensaje: "Debe enviar identificación y password"
        });
      }

      // Buscar usuario
      const { rows } = await pool.query(
        `SELECT 
            id,
            identificacion,
            nombres,
            apellidos,
            password,
            rango
         FROM usuario_fuerza_publica
         WHERE identificacion = $1`,
        [identificacion]
      );

      const usuario = rows[0];

      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      // --------------------------------------
      // 🔥 Validación híbrida de contraseña 🔥
      // --------------------------------------

      let passwordValida = false;
      const storedPassword = usuario.password;

      // Detectar si es hash bcrypt
      const esHash = storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$");

      if (esHash) {
        // Comparar usando bcrypt
        passwordValida = await bcrypt.compare(password, storedPassword);
      } else {
        // Comparar como texto plano
        passwordValida = password === storedPassword;
      }

      if (!passwordValida) {
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
      }

      // Crear token
      const token = jwt.sign(
        {
          id: usuario.id,
          identificacion: usuario.identificacion,
          nombre: usuario.nombres + " " + usuario.apellidos,
          rango: usuario.rango
        },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );

      res.json({
        mensaje: "Login exitoso",
        token,
        usuario: {
          id: usuario.id,
          identificacion: usuario.identificacion,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          rango: usuario.rango
        }
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
