const pool = require("../../config/database"); // Corrected to use pool

class Ciudadano {
  async obtenerTodos() {
    try {
      const { rows } = await pool.query( // Changed db to pool
        `SELECT 
          nombres, 
          apellidos, 
          identificacion, 
          fecha_nacimiento, 
          lugar_nacimiento, 
          rh, 
          fecha_expedicion, 
          lugar_expedicion, 
          estatura, 
          tipo_documento, 
          numero_documento, 
          direccion, 
          telefono, 
          correo, 
          estado_judicial 
        FROM ciudadanos1`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo ciudadanos: ${error.message}`);
    }
  }

  async obtenerPorId(id) {
    try {
      const { rows } = await pool.query( // Changed db to pool
        `SELECT 
          nombres, 
          apellidos, 
          identificacion, 
          fecha_nacimiento, 
          lugar_nacimiento, 
          rh, 
          fecha_expedicion, 
          lugar_expedicion, 
          estatura, 
          tipo_documento, 
          numero_documento, 
          direccion, 
          telefono, 
          correo, 
          estado_judicial 
        FROM ciudadanos1 
        WHERE identificacion = $1`, // Changed ? to $1 for consistency
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error obteniendo ciudadano por ID: ${error.message}`);
    }
  }
  async obtenerPorIdentificacion(identificacion) { // Cambiado el nombre del método
  try {
    const { rows } = await pool.query(
      `SELECT 
        nombres, 
        apellidos, 
        identificacion, 
        fecha_nacimiento, 
        lugar_nacimiento, 
        rh, 
        fecha_expedicion, 
        lugar_expedicion, 
        estatura, 
        tipo_documento, 
        numero_documento, 
        direccion, 
        telefono, 
        correo, 
        estado_judicial 
      FROM ciudadanos1 
      WHERE identificacion = $1`, 
      [identificacion]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error obteniendo ciudadano por identificación: ${error.message}`);
  }
}

  async crear(data) {
    const ciudadano = new Ciudadano(data);
    try {
      await pool.query( // Changed db to pool
        `INSERT INTO ciudadanos1 
          (nombres, apellidos, identificacion, fecha_nacimiento, lugar_nacimiento, rh, fecha_expedicion, lugar_expedicion, estatura, tipo_documento, numero_documento, direccion, telefono, correo, estado_judicial) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          ciudadano.nombres,
          ciudadano.apellidos,
          ciudadano.identificacion,
          ciudadano.fecha_nacimiento,
          ciudadano.lugar_nacimiento,
          ciudadano.rh,
          ciudadano.fecha_expedicion,
          ciudadano.lugar_expedicion,
          ciudadano.estatura,
          ciudadano.tipo_documento,
          ciudadano.numero_documento,
          ciudadano.direccion,
          ciudadano.telefono,
          ciudadano.correo,
          ciudadano.estado_judicial
        ]
      );
      return ciudadano;
    } catch (error) {
      throw new Error(`Error creando ciudadano: ${error.message}`);
    }
  }

  async actualizar(id, data) {
    try {
      const campos = Object.keys(data)
        .map((key, idx) => `${key} = $${idx + 1}`)
        .join(", ");
      
      const valores = Object.values(data);

      await pool.query( // Changed db to pool
        `UPDATE ciudadanos1 
         SET ${campos} 
         WHERE identificacion = $${valores.length + 1}`,
        [...valores, id]
      );
      return this.obtenerPorId(id);
    } catch (error) {
      throw new Error(`Error actualizando ciudadano: ${error.message}`);
    }
  }

  async eliminar(id) {
    try {
      await pool.query( // Changed db to pool
        "DELETE FROM ciudadanos1 WHERE identificacion = $1",
        [id]
      );
    } catch (error) {
      throw new Error(`Error eliminando ciudadano: ${error.message}`);
    }
  }
}

module.exports = new Ciudadano();
