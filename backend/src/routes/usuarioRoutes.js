const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middleware/auth-middleware");

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificar);

// CONSULTA ESTADO JUDICIAL (primero para evitar conflicto con :id)
router.get("/estado-judicial/:identificacion", usuarioController.obtenerEstadoJudicial);

// CRUD normal
router.get("/", usuarioController.obtenerTodos);
router.get("/:id", usuarioController.obtenerPorId);
router.post("/", usuarioController.crear);
router.put("/:id", usuarioController.actualizar);
router.delete("/:id", usuarioController.eliminar);

module.exports = router;
