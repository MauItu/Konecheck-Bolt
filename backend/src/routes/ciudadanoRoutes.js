// Ciudadano Routes - Endpoints de búsqueda y filtrado
const express = require("express")
const router = express.Router()
const ciudadanoController = require("../controllers/ciudadano-controller")
const authMiddleware = require("../middleware/auth-middleware")

// Requieren autenticación
router.use(authMiddleware.verificar)

router.get("/", ciudadanoController.listar)
router.get("/buscar", ciudadanoController.buscar)
router.get("/filtrar", ciudadanoController.filtrar)
router.get("/documento/:id", ciudadanoController.obtenerDocumento)

module.exports = router
