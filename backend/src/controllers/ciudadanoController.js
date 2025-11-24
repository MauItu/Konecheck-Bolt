const Ciudadano = require("../models/Ciudadano");

class CiudadanoController {

  async obtenerTodos(req, res, next) {
    try {
      const ciudadanos = await Ciudadano.obtenerTodos();
      res.json(ciudadanos);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const ciudadano = await Ciudadano.obtenerPorId(req.params.id);

      if (!ciudadano) {
        return res.status(404).json({ mensaje: "Ciudadano no encontrado" });
      }

      res.json(ciudadano);
    } catch (error) {
      next(error);
    }
  }

  async crear(req, res, next) {
    try {
      const ciudadano = await Ciudadano.crear(req.body);
      res.status(201).json({ mensaje: "Ciudadano creado", ciudadano });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const ciudadano = await Ciudadano.actualizar(req.params.id, req.body);

      if (!ciudadano) {
        return res.status(404).json({ mensaje: "Ciudadano no encontrado" });
      }

      res.json({ mensaje: "Ciudadano actualizado", ciudadano });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      await Ciudadano.eliminar(req.params.id);
      res.json({ mensaje: "Ciudadano eliminado" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CiudadanoController();
