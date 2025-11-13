// Persona Model - Consultas SQL para tabla personas
const sql = require("../config/database")

class Persona {
  async obtenerTodos() {
    try {
      const resultado = await sql("SELECT * FROM personas ORDER BY apellido, nombre ASC")
      return resultado
    } catch (error) {
      throw new Error(`Error obteniendo personas: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      const resultado = await sql("SELECT * FROM personas WHERE id = $1", [id])
      return resultado[0]
    } catch (error) {
      throw new Error(`Error obteniendo persona: ${error.message}`)
    }
  }

  async obtenerPorCedula(cedula) {
    try {
      const resultado = await sql("SELECT * FROM personas WHERE cedula = $1", [cedula])
      return resultado[0]
    } catch (error) {
      throw new Error(`Error obteniendo persona por cédula: ${error.message}`)
    }
  }

  async crear(datos) {
    try {
      const { nombre, apellido, cedula, email, telefono } = datos
      const resultado = await sql(
        "INSERT INTO personas (nombre, apellido, cedula, email, telefono, fecha_creacion) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
        [nombre, apellido, cedula, email, telefono],
      )
      return resultado[0]
    } catch (error) {
      throw new Error(`Error creando persona: ${error.message}`)
    }
  }
}

module.exports = new Persona()
