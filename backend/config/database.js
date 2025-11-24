// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Crea el pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Prueba la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.stack);
  } else {
    console.log('✅ Conectado a Neon Database');
    release();
  }
});

module.exports = pool;
