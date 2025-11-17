const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = null;

// Configurar axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

async function testEndpoints() {
  try {
    console.log('\n========== TESTING ENDPOINTS ==========\n');

    // 1. Test de conexión
    console.log('1. Testing /test-connection...');
    const connectionTest = await axios.get('http://localhost:3000/test-connection');
    console.log('✓ Conexión exitosa:', connectionTest.data.data);

    // 2. Register
    console.log('\n2. Testing POST /auth/register...');
    const registerRes = await api.post('/auth/register', {
      email: `usuario${Date.now()}@test.com`,
      password: 'Password@123',
      nombre: 'Usuario Prueba',
    });
    console.log('✓ Usuario registrado:', registerRes.data.usuario);

    // 3. Login
    console.log('\n3. Testing POST /auth/login...');
    const loginRes = await api.post('/auth/login', {
      email: 'admin@konecheck.com',
      password: 'Admin@123',
    });
    authToken = loginRes.data.token;
    console.log('✓ Login exitoso');
    console.log('Token:', authToken.substring(0, 20) + '...');

    // 4. Verificar sesión
    console.log('\n4. Testing GET /auth/verificar-sesion...');
    const sessionRes = await api.get('/auth/verificar-sesion');
    console.log('✓ Sesión verificada:', sessionRes.data.usuario);

    // 5. Obtener usuarios
    console.log('\n5. Testing GET /usuarios...');
    const usuariosRes = await api.get('/usuarios');
    console.log('✓ Usuarios obtenidos:', usuariosRes.data.length, 'registros');

    // 6. Obtener ciudadanos
    console.log('\n6. Testing GET /ciudadanos...');
    const ciudadanosRes = await api.get('/ciudadanos');
    console.log('✓ Ciudadanos obtenidos:', ciudadanosRes.data.length, 'registros');

    console.log('\n========== ALL TESTS PASSED ==========\n');
  } catch (error) {
    console.error('\n✗ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testEndpoints();
