const jwt = require('jsonwebtoken');

class AuthMiddleware {
  verificar(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);
      
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token inválido' });
      }
      res.status(500).json({ error: 'Error verificando token' });
    }
  }

  requerirRol(...rolesPermitidos) {
    return (req, res, next) => {
      if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ 
          error: 'Acceso denegado',
          roleRequired: rolesPermitidos,
          userRole: req.user?.rol
        });
      }
      next();
    };
  }
}

module.exports = new AuthMiddleware();
