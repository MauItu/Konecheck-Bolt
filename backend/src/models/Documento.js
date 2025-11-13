// Documento Model - Consultas SQL para tabla documentos
const sql = require("../config/database")

class Documento {
  async obtenerPorCiudadanoId(ciudadanoId) {
    try {
      const resultado = await sql("SELECT * FROM documentos WHERE ciudadano_id = $1 ORDER BY fecha_creacion DESC", [
        ciudadanoId,
      ])
      return resultado
    } catch (error) {
      throw new Error(`Error obteniendo documentos: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      const resultado = await sql("SELECT * FROM documentos WHERE id = $1", [id])
      return resultado[0]
    } catch (error) {
      throw new Error(`Error obteniendo documento: ${error.message}`)
    }
  }

  async crear(datos) {
    try {
      const { ciudadanoId, tipo, url } = datos
      const resultado = await sql(
        "INSERT INTO documentos (ciudadano_id, tipo, url, fecha_creacion) VALUES ($1, $2, $3, NOW()) RETURNING *",
        [ciudadanoId, tipo, url],
      )
      return resultado[0]
    } catch (error) {
      throw new Error(`Error creando documento: ${error.message}`)
    }
  }
}

module.exports = new Documento()
