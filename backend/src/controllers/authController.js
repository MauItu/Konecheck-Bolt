// Auth Controller - Manejo de autenticación y sesion
const { validateEmail, validatePassword } = require("../utils/validators")

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Email inválido" })
      }

      if (!validatePassword(password)) {
        return res.status(400).json({ error: "Contraseña inválida" })
      }

      // Lógica de login aquí
      res.json({ message: "Login exitoso" })
    } catch (error) {
      next(error)
    }
  }

  async register(req, res, next) {
    try {
      const { email, password, nombre } = req.body

      if (!email || !password || !nombre) {
        return res.status(400).json({ error: "Campos requeridos faltantes" })
      }

      // Lógica de registro aquí
      res.status(201).json({ message: "Usuario registrado exitosamente" })
    } catch (error) {
      next(error)
    }
  }

  async verificarSesion(req, res, next) {
    try {
      // Verificar si el usuario tiene sesión activa
      res.json({ autenticado: true, usuario: req.user })
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      // Lógica de logout aquí
      res.json({ message: "Logout exitoso" })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
