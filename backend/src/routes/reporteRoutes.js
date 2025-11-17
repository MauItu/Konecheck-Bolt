// Reporte Routes - Endpoints de reportes y estadísticas
const express = require("express")
const router = express.Router()
const reporteController = require("../controllers/reporteController")
const authMiddleware = require("../middleware/auth-middleware")

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificar)

router.get("/estadisticas", reporteController.obtenerEstadisticas)
router.post("/generar", reporteController.generarReporte)
router.get("/exportar/:id/:formato", reporteController.exportarReporte)

module.exports = router
