// Usuario Model - Consultas SQL para tabla usuario_fuerza_publica
const pool = require("../config/database");

class Usuario {

  async obtenerParaLogin(identificacion) {
  try {
    const { rows } = await pool.query(
      `SELECT 
          id,
          identificacion,
          password,
          nombres,
          apellidos,
          rango
       FROM usuario_fuerza_publica
       WHERE identificacion = $1`,
      [identificacion]
    );

    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error obteniendo usuario para login: ${error.message}`);
  }
}


  async obtenerTodos() {
    try {
      const { rows } = await pool.query(
        `SELECT 
            id, 
            nombres || ' ' || apellidos AS nombre, 
            identificacion AS email, 
            '' AS rol
         FROM usuario_fuerza_publica
         ORDER BY nombres ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }

  async obtenerPorId(id) {
    try {
      const { rows } = await pool.query(
        `SELECT 
            id, 
            nombres || ' ' || apellidos AS nombre, 
            identificacion AS email, 
            '' AS rol
         FROM usuario_fuerza_publica 
         WHERE id = $1`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por ID: ${error.message}`);
    }
  }

  // NUEVO: obtener por identificación (la ruta de estado judicial usa este)
  async obtenerPorIdentificacion(identificacion) {
    try {
      const { rows } = await pool.query(
        `SELECT
            id,
            identificacion,
            nombres,
            apellidos,
            estado_judicial,
            rango,
            fecha_nacimiento,
            lugar_nacimiento
         FROM usuario_fuerza_publica
         WHERE identificacion = $1`,
        [identificacion]
      );

      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por identificación: ${error.message}`);
    }
  }

  async crear(datos) {
    try {
      const { nombre, email } = datos;
      const [nombres, apellidos] = nombre.split(" ");

      const { rows } = await pool.query(
        `INSERT INTO usuario_fuerza_publica 
          (nombres, apellidos, identificacion, password, rango, fecha_creacion)
         VALUES ($1, $2, $3, 'temp', 'sin-rango', NOW())
         RETURNING *`,
        [nombres, apellidos, email]
      );

      return rows[0];
    } catch (error) {
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  async actualizar(id, datos) {
    try {
      const campos = Object.keys(datos)
        .map((key, idx) => `${key} = $${idx + 1}`)
        .join(", ");
      
      const valores = Object.values(datos);

      const { rows } = await pool.query(
        `UPDATE usuario_fuerza_publica 
         SET ${campos}, fecha_actualizacion = NOW()
         WHERE id = $${valores.length + 1}
         RETURNING *`,
        [...valores, id]
      );

      return rows[0];
    } catch (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`);
    }
  }

  async eliminar(id) {
    try {
      await pool.query(
        "DELETE FROM usuario_fuerza_publica WHERE id = $1",
        [id]
      );
    } catch (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`);
    }
  }
}

module.exports = new Usuario();
