// Ciudadano Model - Consultas SQL para tabla ciudadanos
const sql = require("../config/database")

class Ciudadano {
  async listar() {
    try {
      const resultado = await sql(
        "SELECT id, nombre, cedula, email, estado, ciudad FROM ciudadanos ORDER BY nombre ASC",
      )
      return resultado
    } catch (error) {
      throw new Error(`Error listando ciudadanos: ${error.message}`)
    }
  }

  async buscar(criterios) {
    try {
      const { nombre, cedula } = criterios
      let query = "SELECT * FROM ciudadanos WHERE 1=1"
      const valores = []

      if (nombre) {
        valores.push(`%${nombre}%`)
        query += ` AND nombre ILIKE $${valores.length}`
      }

      if (cedula) {
        valores.push(cedula)
        query += ` AND cedula = $${valores.length}`
      }

      const resultado = await sql(query, valores)
      return resultado
    } catch (error) {
      throw new Error(`Error buscando ciudadanos: ${error.message}`)
    }
  }

  async filtrar(criterios) {
    try {
      const { estado, ciudad, edad } = criterios
      let query = "SELECT * FROM ciudadanos WHERE 1=1"
      const valores = []

      if (estado) {
        valores.push(estado)
        query += ` AND estado = $${valores.length}`
      }

      if (ciudad) {
        valores.push(ciudad)
        query += ` AND ciudad = $${valores.length}`
      }

      if (edad) {
        valores.push(edad)
        query += ` AND edad = $${valores.length}`
      }

      const resultado = await sql(query, valores)
      return resultado
    } catch (error) {
      throw new Error(`Error filtrando ciudadanos: ${error.message}`)
    }
  }
}

module.exports = new Ciudadano()
