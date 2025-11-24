const express = require("express");
const router = express.Router();
const ciudadanoController = require("../controllers/ciudadanoController");
const authMiddleware = require("../middleware/auth-middleware");

// TODAS las rutas protegidas
router.use(authMiddleware.verificar);

router.get("/", ciudadanoController.obtenerTodos);
router.get("/:id", ciudadanoController.obtenerPorId);
router.get("/:identificacion", ciudadanoController.obtenerPorIdentificacion); // Asegúrate de que esta línea esté presenterouter.post("/", ciudadanoController.crear);
router.put("/:id", ciudadanoController.actualizar);
router.delete("/:id", ciudadanoController.eliminar);

module.exports = router;
