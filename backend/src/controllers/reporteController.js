// Reporte Controller - Generación de reportes y estadísticas
const Reporte = require("../models/Reporte")

class ReporteController {
  async obtenerEstadisticas(req, res, next) {
    try {
      const estadisticas = await Reporte.obtenerEstadisticas()
      res.json(estadisticas)
    } catch (error) {
      next(error)
    }
  }

  async generarReporte(req, res, next) {
    try {
      const { tipo, fechaInicio, fechaFin } = req.body

      if (!tipo || !fechaInicio || !fechaFin) {
        return res.status(400).json({ error: "Parámetros requeridos faltantes" })
      }

      const reporte = await Reporte.generar({ tipo, fechaInicio, fechaFin })
      res.json(reporte)
    } catch (error) {
      next(error)
    }
  }

  async exportarReporte(req, res, next) {
    try {
      const { id, formato } = req.params
      const archivo = await Reporte.exportar(id, formato)
      res.download(archivo)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ReporteController()
