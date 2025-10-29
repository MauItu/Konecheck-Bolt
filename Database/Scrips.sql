-- Script de creación de tablas para KonCheck
-- Compatible con PostgreSQL (Neon Database)

-- =====================================
-- TABLA BASE: PERSONAS
-- =====================================
CREATE TABLE IF NOT EXISTS personas (
    id BIGSERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    identificacion VARCHAR(20) UNIQUE NOT NULL,
    fecha_nacimiento DATE,
    lugar_nacimiento VARCHAR(100),
    rh VARCHAR(5),
    fecha_expedicion DATE,
    lugar_expedicion VARCHAR(100),
    estatura VARCHAR(10),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_identificacion ON personas(identificacion);
CREATE INDEX IF NOT EXISTS idx_nombres ON personas(nombres);
CREATE INDEX IF NOT EXISTS idx_apellidos ON personas(apellidos);

-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_personas_fecha_actualizacion
    BEFORE UPDATE ON personas
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- =====================================
-- TABLA ADMINISTRADORES (hereda de personas)
-- =====================================
CREATE TABLE IF NOT EXISTS administradores (
    id BIGINT PRIMARY KEY,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id) REFERENCES personas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_correo ON administradores(correo);

-- =====================================
-- TABLA CIUDADANOS (hereda de personas)
-- =====================================
CREATE TABLE IF NOT EXISTS ciudadanos (
    id BIGINT PRIMARY KEY,
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(30) UNIQUE NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    estado_judicial VARCHAR(50) DEFAULT 'No Requerido',
    FOREIGN KEY (id) REFERENCES personas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_numero_documento ON ciudadanos(numero_documento);
CREATE INDEX IF NOT EXISTS idx_tipo_documento ON ciudadanos(tipo_documento);

-- =====================================
-- TABLA DOCUMENTOS
-- =====================================
CREATE TABLE IF NOT EXISTS documentos (
    id BIGSERIAL PRIMARY KEY,
    ciudadano_id BIGINT NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    numero_documento VARCHAR(50),
    codigo_barras VARCHAR(100),
    fecha_escaneo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    escaneado_por VARCHAR(100),
    FOREIGN KEY (ciudadano_id) REFERENCES ciudadanos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ciudadano ON documentos(ciudadano_id);
CREATE INDEX IF NOT EXISTS idx_codigo_barras ON documentos(codigo_barras);

-- =====================================
-- TABLA USUARIOS FUERZA PÚBLICA
-- =====================================
CREATE TABLE IF NOT EXISTS usuario_fuerza_publica (
    id BIGSERIAL PRIMARY KEY,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    lugar_nacimiento VARCHAR(100),
    rh VARCHAR(5),
    fecha_expedicion DATE,
    lugar_expedicion VARCHAR(100),
    estatura DOUBLE PRECISION,
    estado_judicial VARCHAR(50) DEFAULT 'No Requerido',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    rango VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ufp_identificacion ON usuario_fuerza_publica(identificacion);
CREATE INDEX IF NOT EXISTS idx_ufp_activo ON usuario_fuerza_publica(activo);
CREATE INDEX IF NOT EXISTS idx_ufp_fecha_creacion ON usuario_fuerza_publica(fecha_creacion);

-- Trigger para actualizar fecha_actualizacion en usuario_fuerza_publica
CREATE TRIGGER trigger_ufp_fecha_actualizacion
    BEFORE UPDATE ON usuario_fuerza_publica
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- =====================================
-- MENSAJE FINAL
-- =====================================
SELECT '✅ Tablas creadas exitosamente en Neon PostgreSQL' AS mensaje;