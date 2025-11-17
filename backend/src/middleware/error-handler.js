// Error Handler - Manejo centralizado de errores
class ErrorHandler {
  handle(err, req, res, next) {
    console.error("[Error]", {
      mensaje: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    })

    const statusCode = err.statusCode || 500
    const mensaje = err.message || "Error interno del servidor"

    res.status(statusCode).json({
      error: {
        mensaje,
        statusCode,
        timestamp: new Date().toISOString(),
      },
    })
  }

  validationError(errores) {
    return {
      statusCode: 400,
      message: "Errores de validación",
      detalles: errores,
    }
  }

  notFound(req, res) {
    res.status(404).json({
      error: {
        mensaje: "Recurso no encontrado",
        path: req.originalUrl,
      },
    })
  }
}

module.exports = new ErrorHandler()
