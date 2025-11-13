// Helpers - Funciones auxiliares para formateo y utilidades
const helpers = {
  formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  },

  formatearHora(fecha) {
    return new Date(fecha).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  },

  generarId() {
    return Math.random().toString(36).substr(2, 9)
  },

  capitalizarPalabra(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
  },

  capitalizarNombre(nombre) {
    return nombre
      .split(" ")
      .map((palabra) => this.capitalizarPalabra(palabra))
      .join(" ")
  },

  paginar(items, pagina = 1, porPagina = 10) {
    const inicio = (pagina - 1) * porPagina
    const fin = inicio + porPagina
    return {
      datos: items.slice(inicio, fin),
      total: items.length,
      pagina,
      porPagina,
      totalPaginas: Math.ceil(items.length / porPagina),
    }
  },

  generarToken(payload, secreto, expiracion = "24h") {
    const jwt = require("jsonwebtoken")
    return jwt.sign(payload, secreto, { expiresIn: expiracion })
  },

  compararHashes(valor, hash) {
    const bcrypt = require("bcrypt")
    return bcrypt.compare(valor, hash)
  },

  generarHash(valor, rondas = 10) {
    const bcrypt = require("bcrypt")
    return bcrypt.hash(valor, rondas)
  },
}

module.exports = helpers
