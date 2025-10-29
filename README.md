🛡️ KonCheck: Sistema de Consulta Ciudadano para la Fuerza Pública
Sistema de verificación de antecedentes diseñado para su uso en campo por miembros de la Policía Nacional, Ejército, Armada y Fuerza Aérea de Colombia. Permite la consulta rápida de antecedentes judiciales mediante el escaneo del código de barras de la cédula y la entrada manual para la toma de decisiones inmediatas.

📋 Tabla de Contenidos









✨ Características Clave
Aplicación Nativa: Desarrollado para Android/iOS con React Native/Expo.

Consulta (HU9): Permite escanear el código de barras del documento para consultar antecedentes judiciales de manera rápida y confiable.

Mitigación de Riesgos: Implementa el Ingreso Manual de la identificación como alternativa ante errores en la lectura óptica.

Seguridad: Cuenta con un módulo de seguridad para autenticar al personal de la Fuerza Pública mediante Identificación y Contraseña.

Auditoría: Cada consulta debe registrarse con fecha, hora y la identificación del policía que la realizó, para fines de auditoría.

Arquitectura: Usa una API REST escalable para la conexión frontend-backend.

🛠️ Tecnologías del Stack
Hemos optado por un Stack Full-Stack TypeScript para una implementación ágil y un idioma unificado en todo el proyecto.

Frontend (Aplicación Móvil - Nativa)
React Native / Expo - Desarrollo móvil nativo.

TypeScript - Tipado estático para código robusto.

Axios - Cliente HTTP.

Diseño: Paleta de colores Verde Oscuro (#388E3C) y Verde Claro (#66BB6A).

Backend (API REST)
Node.js / Express - Servidor y runtime.

TypeScript - Para la capa de API.

PostgreSQL / Neon - Base de datos relacional y de licencia libre.

bcrypt - Encriptación de contraseñas (requisito de seguridad).

📂 Estructura de Arquitectura
El proyecto está organizado en un Monorepo bajo una arquitectura de Módulos/Capas para facilitar la integración y el mantenimiento.

📦 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:

Node.js >= 18.x

npm >= 9.x

Expo CLI: npm install -g expo-cli

Expo Go en tu dispositivo móvil o un emulador (Android Studio/Xcode).

🚀 Instalación y Configuración
1. Clonar e Instalar
2. Configuración del Backend (PostgreSQL)
Crea un proyecto en Neon.tech y obtén la cadena de conexión.

Copia y edita el archivo de variables de entorno:

Edita el archivo .env con tu DATABASE_URL de Neon y tu JWT_SECRET.

3. Crear Tablas SQL
Ejecuta los scripts schema.sql y seed.sql en tu editor SQL de Neon para inicializar la base de datos (tablas usuario_fuerza_publica, ciudadanos, documentos).

4. Configurar URL del Frontend
Ajusta la API_URL en frontend/src/api/config.ts para que apunte a tu IP local (o localhost si usas simulador) donde se ejecuta el backend de Express.

🎮 Uso y Flujo de la Aplicación
Iniciar el Backend (API REST)
Iniciar el Frontend (Móvil Nativo)
Escanea el QR con Expo Go en tu dispositivo.

Flujo Operacional (MVP5)
Login: Ingresa tus credenciales. El sistema simulará la autenticación exitosa.

Consulta: El sistema navega a la ScannerScreen.

Escaneo: La interfaz de la cámara se activa (simulada) para la lectura.

Manual: El componente Input Manual permite ingresar la identificación directamente si el escaneo falla.

Perfil: El menú lateral (ProfileDrawer) muestra el perfil del usuario autenticado con el diseño verde corporativo.

🌐 API Endpoints
El protocolo de comunicación es API REST.

🗄️ Modelo de Datos (Esquema SQL)
La persistencia usa un modelo relacional con una capa de Patrón Repositorio en el backend para desacoplar la lógica de la DB.

usuario_fuerza_publica: Datos de login y perfil (Policía, Rango).

ciudadanos: Información general y estado judicial (Requerido o No Requerido).

documentos: Registra la trazabilidad de la consulta (ID policía, fecha, cédula consultada).

🤝 Contribuir
Las contribuciones son bienvenidas. Por favor, asegúrese de mantener la consistencia con el Stack Full-Stack TypeScript y la arquitectura de Patrón Repositorio (SQL).

Hecho con ❤️ para las fuerzas públicas de Colombia


[^]: La nota del PROYECTO FINAL depende de la sustentación técnica.