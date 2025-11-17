// Persona Model - Consultas SQL para tabla personas
const pool = require("../../config/database");

class Persona {
  async obtenerTodos() {
    try {
      const { rows } = await pool.query("SELECT * FROM personas ORDER BY apellidos, nombres ASC");
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo personas: ${error.message}`);
    }
  }

  async obtenerPorId(id) {
    try {
      const { rows } = await pool.query("SELECT * FROM personas WHERE id = $1", [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo persona: ${error.message}`);
    }
  }

  async obtenerPorCedula(cedula) {
    try {
      const { rows } = await pool.query("SELECT * FROM personas WHERE identificacion = $1", [cedula]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo persona por cédula: ${error.message}`);
    }
  }

  async crear(datos) {
    try {
      const { nombre, apellido, cedula, email, telefono } = datos;
      const { rows } = await pool.query(
        `INSERT INTO personas (nombres, apellidos, identificacion, fecha_creacion)
         VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [nombre, apellido, cedula]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error creando persona: ${error.message}`);
    }
  }
}

module.exports = new Persona();