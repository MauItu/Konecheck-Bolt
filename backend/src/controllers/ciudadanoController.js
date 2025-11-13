// Ciudadano Controller - Búsqueda y filtrado de ciudadanos
const Ciudadano = require("../models/Ciudadano")
const Documento = require("../models/Documento")

class CiudadanoController {
  async listar(req, res, next) {
    try {
      const ciudadanos = await Ciudadano.listar()
      res.json(ciudadanos)
    } catch (error) {
      next(error)
    }
  }

  async buscar(req, res, next) {
    try {
      const { nombre, cedula } = req.query

      if (!nombre && !cedula) {
        return res.status(400).json({ error: "Parámetros de búsqueda requeridos" })
      }

      const resultados = await Ciudadano.buscar({ nombre, cedula })
      res.json(resultados)
    } catch (error) {
      next(error)
    }
  }

  async filtrar(req, res, next) {
    try {
      const { estado, ciudad, edad } = req.query
      const ciudadanos = await Ciudadano.filtrar({ estado, ciudad, edad })
      res.json(ciudadanos)
    } catch (error) {
      next(error)
    }
  }

  async obtenerDocumento(req, res, next) {
    try {
      const { id } = req.params
      const documento = await Documento.obtenerPorCiudadanoId(id)

      if (!documento) {
        return res.status(404).json({ error: "Documento no encontrado" })
      }

      res.json(documento)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new CiudadanoController()
