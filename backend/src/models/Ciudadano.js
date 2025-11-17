// Ciudadano Model - Consultas SQL para tabla ciudadanos + personas
const pool = require("../../config/database");

class Ciudadano {
  async listar() {
    try {
      const { rows } = await pool.query(
        `SELECT c.id,
                p.nombres,
                p.identificacion,
                c.correo AS email,
                c.estado_judicial AS estado,
                '' AS ciudad
         FROM ciudadanos c
         JOIN personas p ON p.id = c.id
         ORDER BY p.nombres ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error listando ciudadanos: ${error.message}`);
    }
  }

  async buscar(criterios) {
    try {
      const { nombre, cedula } = criterios;
      let query = `
        SELECT c.*,
               p.nombres,
               p.identificacion,
               c.correo AS email
        FROM ciudadanos c
        JOIN personas p ON p.id = c.id
        WHERE 1=1`;
      const valores = [];

      if (nombre) {
        valores.push(`%${nombre}%`);
        query += ` AND p.nombres ILIKE $${valores.length}`;
      }

      if (cedula) {
        valores.push(cedula);
        query += ` AND p.identificacion = $${valores.length}`;
      }

      const { rows } = await pool.query(query, valores);
      return rows;
    } catch (error) {
      throw new Error(`Error buscando ciudadanos: ${error.message}`);
    }
  }

  async filtrar(criterios) {
    try {
      const { estado } = criterios;
      let query = `
        SELECT c.*,
               p.nombres,
               p.identificacion,
               c.correo AS email
        FROM ciudadanos c
        JOIN personas p ON p.id = c.id
        WHERE 1=1`;
      const valores = [];

      if (estado) {
        valores.push(estado);
        query += ` AND c.estado_judicial = $${valores.length}`;
      }

      const { rows } = await pool.query(query, valores);
      return rows;
    } catch (error) {
      throw new Error(`Error filtrando ciudadanos: ${error.message}`);
    }
  }
}

module.exports = new Ciudadano();