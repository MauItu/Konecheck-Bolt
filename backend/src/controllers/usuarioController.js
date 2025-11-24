const Usuario = require("../models/Usuario");

exports.obtenerTodos = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NUEVO: Obtener estado judicial por identificación
exports.obtenerEstadoJudicial = async (req, res) => {
  try {
    const { identificacion } = req.params;

    const usuario = await Usuario.obtenerPorIdentificacion(identificacion);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Ciudadano no encontrado" });
    }

    res.json({
      identificacion: usuario.identificacion,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      estado_judicial: usuario.estado_judicial,
      rango: usuario.rango
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.crear(req.body);
    res.json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.actualizar(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await Usuario.eliminar(req.params.id);
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
