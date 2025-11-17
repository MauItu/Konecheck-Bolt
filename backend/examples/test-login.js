const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testLogin() {
  console.log('\n=== PRUEBA DE LOGIN ===\n');

  try {
    // 1. Intentar login con credenciales de prueba
    console.log('1. Intentando login con credenciales...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin23@konecheck.com',
      password: '999999', // Contraseña correcta que crea el seed
    });

    console.log('✓ Login exitoso');
    console.log('Token:', loginResponse.data.token);
    console.log('Usuario:', loginResponse.data.usuario);

    // 2. Usar el token para verificar la sesión
    console.log('\n2. Verificando sesión con el token...');
    const token = loginResponse.data.token;
    const verifyResponse = await axios.get(`${API_URL}/auth/verificar-sesion`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✓ Sesión verificada');
    console.log('Usuario autenticado:', verifyResponse.data.usuario);

    // 3. Probar con credenciales inválidas
    console.log('\n3. Probando con credenciales inválidas...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'usuario@konecheck.com',
        password: 'PasswordIncorrecta123',
      });
    } catch (error) {
      console.log('✓ Error esperado:', error.response.data.error);
    }

    console.log('\n=== PRUEBA COMPLETADA ===\n');
  } catch (error) {
    console.error('✗ Error en la prueba:', error.response?.data || error.message);
    console.log('\nPosibles soluciones:');
    console.log('1. Verifica que el servidor está corriendo en puerto 3000');
    console.log('2. Verifica que tienes usuario en la BD con email: admin@konecheck.com');
    console.log('3. Ejecuta: npm run seed (para crear datos de prueba)');
  }
}

testLogin();
