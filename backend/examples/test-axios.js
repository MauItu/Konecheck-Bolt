// EJEMPLOS DE TESTING CON AXIOS
// Ejecutar: node examples/test-axios.js

const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let TOKEN = null;

// Crear instancia de axios con configuración
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token automáticamente si existe
api.interceptors.request.use((config) => {
  if (TOKEN) {
    config.headers.Authorization = `Bearer ${TOKEN}`;
  }
  return config;
});

// Pruebas
async function runTests() {
  try {
    console.log('\n======== TEST 1: Verificar Conexión ========');
    const health = await axios.get('http://localhost:3000/health');
    console.log('✅ Servidor activo:', health.data);

    console.log('\n======== TEST 2: Probar Conexión BD ========');
    const connection = await axios.get('http://localhost:3000/test-connection');
    console.log('✅ Base de datos conectada:', connection.data.message);

    console.log('\n======== TEST 3: Registrar Usuario ========');
    const register = await api.post('/auth/register', {
      email: `user${Date.now()}@example.com`,
      password: 'Password123',
      nombre: 'Usuario Test',
      rol: 'usuario',
    });
    console.log('✅ Usuario registrado:', register.data);

    console.log('\n======== TEST 4: Login ========');
    const login = await api.post('/auth/login', {
      email: register.data.usuario.email,
      password: 'Password123',
    });
    TOKEN = login.data.token;
    console.log('✅ Login exitoso, Token:', TOKEN.substring(0, 20) + '...');

    console.log('\n======== TEST 5: Verificar Sesión ========');
    const session = await api.get('/auth/verificar-sesion');
    console.log('✅ Sesión verificada:', session.data);

    console.log('\n======== TEST 6: Obtener Usuarios ========');
    const usuarios = await api.get('/usuarios');
    console.log('✅ Usuarios obtenidos:', usuarios.data.length, 'usuarios');

    console.log('\n======== TEST 7: Logout ========');
    const logout = await api.post('/auth/logout');
    console.log('✅ Logout:', logout.data.message);
    TOKEN = null;

    console.log('\n✅ TODOS LOS TESTS PASARON CORRECTAMENTE\n');
  } catch (error) {
    console.error(
      '❌ Error:',
      error.response?.data || error.message
    );
  }
}

runTests();
