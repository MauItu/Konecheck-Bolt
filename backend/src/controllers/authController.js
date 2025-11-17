// authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../config/database.js");
const { validateEmail, validatePassword } = require("../../utils/validators");

class AuthController {
  // LOGIN
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!validateEmail(email)) return res.status(400).json({ error: "Email inválido" });
      if (!validatePassword(password)) return res.status(400).json({ error: "Contraseña inválida" });

  // 1. Buscar admin por correo
const { rows } = await pool.query(
  `SELECT a.id, a.correo, a.password, p.nombres, p.apellidos
   FROM administradores a
   JOIN personas p ON p.id = a.id
   WHERE a.correo = $1`,
  [email]
);
const admin = rows[0];

      if (!admin) return res.status(401).json({ error: "Credenciales incorrectas" });

      // 2. Verificar password
      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) return res.status(401).json({ error: "Credenciales incorrectas" });

      // 3. Generar JWT
      const token = jwt.sign({ id: admin.id, email: admin.correo }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // 4. Responder con token y datos
      res.json({
        message: "Login exitoso",
        token,
        usuario: {
          id: admin.id,
          nombre: `${admin.nombres} ${admin.apellidos}`,
          email: admin.correo,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // REGISTRO (placeholder)
  async register(req, res, next) {
    try {
      const { email, password, nombre } = req.body;
      if (!email || !password || !nombre) {
        return res.status(400).json({ error: "Campos requeridos faltantes" });
      }
      res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
      next(error);
    }
  }

  // VERIFICAR SESIÓN
  async verificarSesion(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "No hay token" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ autenticado: true, usuario: decoded });
    } catch (error) {
      return res.status(401).json({ error: "Token inválido" });
    }
  }

  // LOGOUT
  async logout(req, res, next) {
    res.json({ message: "Logout exitoso" });
  }
}

module.exports = new AuthController();