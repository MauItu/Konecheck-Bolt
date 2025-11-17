// Auth Routes - Definición de endpoints de autenticación
const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const authMiddleware = require("../middleware/auth-middleware")

// Rutas públicas
router.post("/login", authController.login)
router.post("/register", authController.register)

// Rutas protegidas
router.post("/logout", authMiddleware.verificar, authController.logout)
router.get("/verificar-sesion", authMiddleware.verificar, authController.verificarSesion)

module.exports = router
