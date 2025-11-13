// Usuario Controller - CRUD de usuarios fuerza pública
const Usuario = require("../models/Usuario")

class UsuarioController {
  async obtenerTodos(req, res, next) {
    try {
      const usuarios = await Usuario.obtenerTodos()
      res.json(usuarios)
    } catch (error) {
      next(error)
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params
      const usuario = await Usuario.obtenerPorId(id)

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" })
      }

      res.json(usuario)
    } catch (error) {
      next(error)
    }
  }

  async crear(req, res, next) {
    try {
      const { nombre, email, rol } = req.body

      if (!nombre || !email || !rol) {
        return res.status(400).json({ error: "Campos requeridos faltantes" })
      }

      const nuevoUsuario = await Usuario.crear({ nombre, email, rol })
      res.status(201).json(nuevoUsuario)
    } catch (error) {
      next(error)
    }
  }

  async actualizar(req, res, next) {
    try {
      const { id } = req.params
      const datos = req.body

      const usuarioActualizado = await Usuario.actualizar(id, datos)
      res.json(usuarioActualizado)
    } catch (error) {
      next(error)
    }
  }

  async eliminar(req, res, next) {
    try {
      const { id } = req.params
      await Usuario.eliminar(id)
      res.json({ message: "Usuario eliminado exitosamente" })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UsuarioController()
