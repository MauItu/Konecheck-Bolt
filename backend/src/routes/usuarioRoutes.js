// Usuario Routes - Endpoints CRUD de usuarios
const express = require("express")
const router = express.Router()
const usuarioController = require("../controllers/usuarioController")
const authMiddleware = require("../middleware/auth-middleware")

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificar)

router.get("/", usuarioController.obtenerTodos)
router.get("/:id", usuarioController.obtenerPorId)
router.post("/", usuarioController.crear)
router.put("/:id", usuarioController.actualizar)
router.delete("/:id", usuarioController.eliminar)

module.exports = router
