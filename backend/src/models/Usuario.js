// Usuario Model - Consultas SQL para tabla usuario_fuerza_publica
const sql = require("../config/database")

class Usuario {
  async obtenerTodos() {
    try {
      const resultado = await sql("SELECT * FROM usuario_fuerza_publica ORDER BY nombre ASC")
      return resultado
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      const resultado = await sql("SELECT * FROM usuario_fuerza_publica WHERE id = $1", [id])
      return resultado[0]
    } catch (error) {
      throw new Error(`Error obteniendo usuario: ${error.message}`)
    }
  }

  async crear(datos) {
    try {
      const { nombre, email, rol } = datos
      const resultado = await sql(
        "INSERT INTO usuario_fuerza_publica (nombre, email, rol, fecha_creacion) VALUES ($1, $2, $3, NOW()) RETURNING *",
        [nombre, email, rol],
      )
      return resultado[0]
    } catch (error) {
      throw new Error(`Error creando usuario: ${error.message}`)
    }
  }

  async actualizar(id, datos) {
    try {
      const campos = Object.keys(datos)
        .map((key, idx) => `${key} = $${idx + 1}`)
        .join(", ")
      const valores = Object.values(datos)

      const resultado = await sql(
        `UPDATE usuario_fuerza_publica SET ${campos}, fecha_actualizacion = NOW() WHERE id = $${valores.length + 1} RETURNING *`,
        [...valores, id],
      )
      return resultado[0]
    } catch (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      await sql("DELETE FROM usuario_fuerza_publica WHERE id = $1", [id])
    } catch (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`)
    }
  }
}

module.exports = new Usuario()
