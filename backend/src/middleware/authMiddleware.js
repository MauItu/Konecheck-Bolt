// Auth Middleware - Verificación de token JWT y autenticación
const jwt = require("jsonwebtoken")

class AuthMiddleware {
  verificar(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1]

      if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "tu-secreto-aqui")
      req.user = decoded
      next()
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expirado" })
      }
      res.status(403).json({ error: "Token inválido" })
    }
  }

  requerirRol(...rolesPermitidos) {
    return (req, res, next) => {
      if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ error: "Acceso denegado" })
      }
      next()
    }
  }
}

module.exports = new AuthMiddleware()
