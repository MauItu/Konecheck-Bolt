const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const ciudadanoRoutes = require('./src/routes/ciudadanoRoutes');
const errorHandler = require('./src/middleware/error-handler');

// Middlewares globales
app.use(cors({
  origin: '*', // En producción, especificar dominio
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Ruta de salud para monitoreo
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Ruta de prueba de conexión a BD
app.get('/test-connection', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    res.json({
      success: true,
      message: 'Conexión exitosa a Neon',
      data: {
        time: result.rows[0].current_time,
        postgres_version: result.rows[0].pg_version,
      },
    });
  } catch (error) {
    console.error('[Test Connection Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Error de conexión a Neon',
      error: error.message,
    });
  }
});

// Registro de rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ciudadanos', ciudadanoRoutes);


// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

// Middleware de error global
app.use((err, req, res, next) => {
  errorHandler.handle(err, req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Server] Corriendo en puerto ${PORT}`);
  console.log(`[Server] Prueba conexión: http://localhost:${PORT}/test-connection`);
});
