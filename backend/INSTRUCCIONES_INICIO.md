# INSTRUCCIONES PARA EJECUTAR EL BACKEND

## Requisitos Previos
- Node.js v16+ instalado
- Cuenta en Neon para la BD PostgreSQL
- Tu archivo `.env` configurado

## Paso 1: Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

Esto instala:
- `express` - Framework web
- `pg` - Driver PostgreSQL
- `cors` - Manejo de CORS
- `jsonwebtoken` - Autenticación JWT
- `bcrypt` - Hasheo de contraseñas
- `dotenv` - Variables de entorno

## Paso 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz:

\`\`\`env
DATABASE_URL=postgresql://neondb_owner:npg_YTIljcSP0r7L@ep-mute-cherry-aeu7okp0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3000
JWT_SECRET=mi-secreto-super-seguro-123456
\`\`\`

## Paso 3: Crear Tablas en Neon

Ejecuta estas queries en tu consola Neon:

\`\`\`sql
-- Tabla de usuarios (fuerza pública)
CREATE TABLE usuario_fuerza_publica (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(50) DEFAULT 'usuario',
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Tabla de ciudadanos
CREATE TABLE ciudadanos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  estado VARCHAR(50),
  ciudad VARCHAR(100),
  edad INT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE documentos (
  id SERIAL PRIMARY KEY,
  ciudadano_id INT REFERENCES ciudadanos(id),
  tipo VARCHAR(50),
  url TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Tabla de personas (general)
CREATE TABLE personas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  fecha_creacion TIMESTAMP DEFAULT NOW()
);
\`\`\`

## Paso 4: Ejecutar el Backend

### Modo Desarrollo (con recarga automática)
\`\`\`bash
npm run dev
\`\`\`

### Modo Producción
\`\`\`bash
npm start
\`\`\`

Verás un mensaje como:
\`\`\`
[Server] Corriendo en puerto 3000
[Server] Prueba conexión: http://localhost:3000/test-connection
\`\`\`

## Paso 5: Verificar que Funciona

### Opción A: Desde el navegador
\`\`\`
http://localhost:3000/health
\`\`\`

### Opción B: Desde la terminal
\`\`\`bash
curl http://localhost:3000/test-connection
\`\`\`

### Opción C: Con Axios (ejecutar ejemplos)
\`\`\`bash
npm install axios
node examples/test-axios.js
\`\`\`

---

## ENDPOINTS PRINCIPALES

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login (retorna token)
- `GET /api/auth/verificar-sesion` - Verificar token
- `POST /api/auth/logout` - Logout

### Usuarios
- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/:id` - Obtener uno
- `POST /api/usuarios` - Crear
- `PUT /api/usuarios/:id` - Actualizar
- `DELETE /api/usuarios/:id` - Eliminar

### Ciudadanos
- `GET /api/ciudadanos` - Listar todos
- `GET /api/ciudadanos/buscar?nombre=X&cedula=Y` - Buscar
- `GET /api/ciudadanos/filtrar?estado=X&ciudad=Y` - Filtrar

### Reportes
- `GET /api/reportes/estadisticas` - Obtener stats
- `POST /api/reportes/generar` - Generar reporte

---

## AUTENTICACIÓN CON JWT

Todos los endpoints protegidos requieren token en el header:

\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### Obtener Token

1. Registrar usuario:
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "nombre": "Test User"
  }'
\`\`\`

2. Login:
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
\`\`\`

Respuesta incluye el token:
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "test@example.com",
    "rol": "usuario"
  }
}
\`\`\`

---

## TROUBLESHOOTING

### Error: Cannot find module 'pg'
**Solución:** Ejecutar `npm install`

### Error: Port 3000 already in use
**Solución:** Cambiar PORT en `.env` o matar proceso:
\`\`\`bash
lsof -i :3000
kill -9 <PID>
\`\`\`

### Error: Connection string invalid
**Solución:** Verificar que DATABASE_URL está correcta en `.env`

### Error: Token expirado
**Solución:** Hacer login nuevamente

---

## PRÓXIMOS PASOS

1. **Integrar con Expo:** Ver `GUIA_INTEGRACION_EXPO.md`
2. **Agregar Tests:** Ver `examples/test-axios.js`
3. **Documentación API:** Implementar Swagger
4. **Logging:** Agregar Winston o Morgan
5. **Rate Limiting:** Proteger endpoints de bruteforce

¡El backend está listo para funcionar!
