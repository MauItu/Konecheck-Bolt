// Reporte Model - Consultas y generación de reportes
const pool = require("../../config/database");

class Reporte {
  async obtenerEstadisticas() {
    try {
      const { rows } = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM ciudadanos) as total_ciudadanos,
          (SELECT COUNT(*) FROM usuario_fuerza_publica) as total_usuarios,
          (SELECT COUNT(*) FROM documentos) as total_documentos,
          (SELECT COUNT(*) FROM ciudadanos WHERE estado_judicial = 'activo') as ciudadanos_activos
      `);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }

  async generar(criterios) {
    try {
      const { tipo, fechaInicio, fechaFin } = criterios;
      const { rows } = await pool.query(
        `SELECT * FROM ciudadanos 
         WHERE fecha_creacion BETWEEN $1 AND $2
         ORDER BY fecha_creacion DESC`,
        [fechaInicio, fechaFin]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error generando reporte: ${error.message}`);
    }
  }

  async exportar(id, formato) {
    return `reporte_${id}.${formato}`;
  }
}

module.exports = new Reporte();