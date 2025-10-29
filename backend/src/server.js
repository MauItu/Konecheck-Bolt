const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Ruta de prueba mejorada
app.get('/test-connection', async (req, res) => {
  try {
    console.log('📡 Intentando conectar a Neon...');
    
    // Probar consulta simple
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Conexión exitosa!');
    
    res.json({ 
      success: true, 
      message: '✅ Conexión exitosa a Neon!',
      data: {
        time: result.rows[0].current_time,
        postgres_version: result.rows[0].pg_version
      }
    });
  } catch (error) {
    console.error('❌ Error detallado:', error);
    
    res.status(500).json({ 
      success: false, 
      message: '❌ Error de conexión',
      error: error.message,
      detail: error.detail || 'Sin detalles adicionales',
      hint: error.hint || 'Verifica tu cadena de conexión'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📍 Prueba la conexión en: http://localhost:${PORT}/test-connection`);
});
