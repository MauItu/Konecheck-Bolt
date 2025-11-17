# GUÍA DE INTEGRACIÓN CON EXPO/REACT NATIVE

## 1. CONFIGURACIÓN INICIAL

### En tu proyecto Expo:

\`\`\`bash
npx expo install axios
npx expo install @react-native-async-storage/async-storage
\`\`\`

### Crear archivo de configuración:

**`api/config.ts`**
\`\`\`typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Para desarrollo en iPhone: usa tu IP local
// Para desarrollo en Android: usa tu IP local también
const API_URL = 'http://192.168.1.100:3000/api'; // Reemplazar con tu IP

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, limpiar
      await AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

export default api;
\`\`\`

---

## 2. SERVICIOS DE API

**`api/auth.ts`**
\`\`\`typescript
import api from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  async register(email: string, password: string, nombre: string) {
    const response = await api.post('/auth/register', {
      email,
      password,
      nombre,
    });
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('user');
  },

  async verificarSesion() {
    const response = await api.get('/auth/verificar-sesion');
    return response.data;
  },
};

export const ciudadanoService = {
  async listar() {
    const response = await api.get('/ciudadanos');
    return response.data;
  },

  async buscar(nombre?: string, cedula?: string) {
    const response = await api.get('/ciudadanos/buscar', {
      params: { nombre, cedula },
    });
    return response.data;
  },

  async filtrar(estado?: string, ciudad?: string, edad?: number) {
    const response = await api.get('/ciudadanos/filtrar', {
      params: { estado, ciudad, edad },
    });
    return response.data;
  },
};

export const reporteService = {
  async obtenerEstadisticas() {
    const response = await api.get('/reportes/estadisticas');
    return response.data;
  },

  async generar(tipo: string, fechaInicio: string, fechaFin: string) {
    const response = await api.post('/reportes/generar', {
      tipo,
      fechaInicio,
      fechaFin,
    });
    return response.data;
  },
};
\`\`\`

---

## 3. HOOK PERSONALIZADO PARA AUTENTICACIÓN

**`hooks/useAuth.ts`**
\`\`\`typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const user = await AsyncStorage.getItem('user');
        setUser(JSON.parse(user));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      setUser(response.usuario);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, nombre: string) => {
    try {
      setLoading(true);
      const response = await authService.register(email, password, nombre);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return { user, loading, error, login, register, logout };
};
\`\`\`

---

## 4. COMPONENTE DE LOGIN

**`screens/LoginScreen.tsx`**
\`\`\`typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }
      await login(email, password);
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Login Error', error || 'No se pudo iniciar sesión');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 5,
          opacity: loading ? 0.6 : 1,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
\`\`\`

---

## 5. SOLUCIÓN DE PROBLEMAS

### Error: Network request failed
**Solución:** Verificar que:
- El backend está corriendo (`npm run dev`)
- La IP es correcta (no usar localhost, sino tu IP local)
- El firewall permite conexiones en puerto 3000

### Error: CORS Policy
**Solución:** En `server.js`, verificar que CORS está configurado:
\`\`\`javascript
app.use(cors({
  origin: '*', // O especificar tu dominio
  credentials: true,
}));
\`\`\`

### Error: Token expirado
**Solución:** El usuario debe volver a login. El interceptor limpia el token automáticamente.

### Escanear código de barras y enviar a backend
**`screens/ScanScreen.tsx`**
\`\`\`typescript
import { CameraView } from 'expo-camera';
import { useState } from 'react';
import { ciudadanoService } from '../api/auth';

export const ScanScreen = () => {
  const handleBarCodeScanned = async (data: any) => {
    try {
      const ciudadano = await ciudadanoService.buscar(undefined, data);
      console.log('Ciudadano encontrado:', ciudadano);
    } catch (error) {
      console.error('Error buscando ciudadano:', error);
    }
  };

  return (
    <CameraView
      onBarcodeScanned={handleBarCodeScanned}
      barcodeScannerSettings={{ barcodeTypes: ['ean13', 'code128'] }}
    />
  );
};
\`\`\`

---

## 6. CHECKLIST FINAL

- [ ] Backend corriendo: `npm run dev`
- [ ] IP correcta en `api/config.ts`
- [ ] Puedes hacer login desde Expo
- [ ] Token se guarda en AsyncStorage
- [ ] Requests incluyen token en Authorization header
- [ ] Error handling implementado
- [ ] Rutas protegidas funcionan

**¡Listo para producción!**
