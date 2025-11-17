// Documento Model - Consultas SQL para tabla documentos
const pool = require("../../config/database");

class Documento {
  async obtenerPorCiudadanoId(ciudadanoId) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM documentos WHERE ciudadano_id = $1 ORDER BY fecha_escaneo DESC",
        [ciudadanoId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo documentos: ${error.message}`);
    }
  }

  async obtenerPorId(id) {
    try {
      const { rows } = await pool.query("SELECT * FROM documentos WHERE id = $1", [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo documento: ${error.message}`);
    }
  }

  async crear(datos) {
    try {
      const { ciudadanoId, tipo, url } = datos;
      const { rows } = await pool.query(
        `INSERT INTO documentos (ciudadano_id, tipo, url, fecha_escaneo)
         VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [ciudadanoId, tipo, url]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error creando documento: ${error.message}`);
    }
  }
}

module.exports = new Documento();