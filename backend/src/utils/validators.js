// Validators - Validación de datos (emails, cédulas, teléfonos)
const validadores = {
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  validatePassword(password) {
    // Mínimo 8 caracteres, una mayúscula, una minúscula, un número
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return regex.test(password)
  },

  validateCedula(cedula) {
    // Validar formato de cédula (ajustar según el país)
    const regex = /^\d{7,10}$/
    return regex.test(cedula)
  },

  validateTelefono(telefono) {
    // Validar formato de teléfono
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    return regex.test(telefono)
  },

  validateURL(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  validateRequired(campo, nombre) {
    if (!campo || (typeof campo === "string" && !campo.trim())) {
      throw new Error(`${nombre} es requerido`)
    }
  },
}

module.exports = validadores
