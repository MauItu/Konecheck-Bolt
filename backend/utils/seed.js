// utils/seed.js
const pool = require("../config/database.js");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    // 1. Persona base
    const { rows } = await pool.query(
      `INSERT INTO personas (nombres, apellidos, identificacion, fecha_creacion)
       VALUES ('Admin', 'Konecheck', '999999', NOW())
       RETURNING id`
    );
    const id = rows[0].id;

    // 2. Admin con password 999999 (hasheada)
    const hash = await bcrypt.hash("999999", 10);
    await pool.query(
      `INSERT INTO administradores (id, correo, password, activo)
       VALUES ($1, 'admin23@konecheck.com', $2, true)`,
      [id, hash]
    );

    console.log("✅ Datos de prueba insertados");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al insertar datos:", err.message);
    process.exit(1);
  }
})();