// src/hooks/useCiudadanoSearch.ts
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store'; 
import { useRouter } from 'expo-router'; // Necesitas el router para redirigir si el token falla

// Define la estructura de datos que esperas recibir del backend
// 🔥 CORRECCIÓN CLAVE: Se añade 'export' a la interfaz
export interface CiudadanoData { 
  identificacion: string;
  nombres: string;
  apellidos: string;
  estado_judicial: string;
  // Propiedad derivada para uso en UI:
  judicialStatus?: {
    label: string;
    color: string;
    isRequired: boolean;
  };
  // ... (Asegúrate de que coincida con lo que devuelve CiudadanoController.js)
}

const API_BASE_URL = 'http://172.20.10.3:3000/api'; 


// ----------------------------------------------------------------------
// HOOK PERSONALIZADO: useCiudadanoSearch
// ----------------------------------------------------------------------
export function useCiudadanoSearch() {
  const [ciudadano, setCiudadano] = useState<CiudadanoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Inicializa el router

  // Función para obtener el token del almacenamiento seguro/local
  const getToken = async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('userToken');
    } else {
      // Uso de SecureStore en móvil (seguro)
      return SecureStore.getItemAsync('userToken');
    }
  };

  // Pequeña función utilitaria que mapea el campo estado_judicial a datos para la UI
  const mapEstadoJudicial = (raw?: string) => {
    const value = (raw || '').trim();
    const lower = value.toLowerCase();


    // Fallbacks: si contiene la palabra 'no' -> no requerido, si contiene 'buscar'/'búsqueda' -> requerido
    if (lower.includes('no')) {
      return {
        label: 'No Requerido',
        color: '#388E3C',
        isRequired: false,
      };
    }

    if (lower.length > 0) {
      // Si viene otro texto, intentar inferir: si tiene 'activa' o 'búsqueda' -> requerido
      if (lower.includes('activa') || lower.includes('búsqueda') || lower.includes('busqueda')) {
        return {
          label: `Requerido (${raw})`,
          color: '#D32F2F',
          isRequired: true,
        };
      }

      // Default a no requerido mostrando el valor original
      return {
        label: raw,
        color: '#388E3C',
        isRequired: false,
      };
    }

    // Si no hay dato
    return {
      label: 'No disponible',
      color: '#9E9E9E',
      isRequired: false,
    };
  };

  // Función principal que realiza la búsqueda protegida
  const searchCiudadano = async (identificacion: string) => {
    // 1. Limpieza y validación inicial
    setIsLoading(true);
    setError(null);
    setCiudadano(null);

    if (!identificacion) {
      setError("La identificación no puede estar vacía.");
      setIsLoading(false);
      return;
    }
    
    try {
      // 2. Obtener el Token de Autenticación
      const token = await getToken();
      
      if (!token) {
        setError("Sesión no iniciada. Redirigiendo a Login.");
        Alert.alert("Sesión Caducada", "Debes iniciar sesión nuevamente.");
        // Redirigir al login (index.tsx)
        router.replace('../app/(tabs)/index'); 
        return; 
      }

      // 3. Configuración de la URL
      // Usaremos la ruta /api/ciudadanos/:identificacion
      const url = `${API_BASE_URL}/ciudadanos/${identificacion}`;
      
      // 4. Realizar la Petición a la API, AÑADIENDO EL TOKEN
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      const data = await response.json();

      if (response.ok) {
        // 5. Éxito: Guardar los datos del ciudadano
        // Enriquecemos los datos con una representación lista para UI del estado judicial
        const judicialStatus = mapEstadoJudicial(data?.estado_judicial);
        setCiudadano({
          ...data,
          judicialStatus,
        } as CiudadanoData);
        return data as CiudadanoData; 
      } else if (response.status === 401 || response.status === 403) {
        // 6. Manejo de Token Inválido o Expirado (Error del Middleware)
        setError(data.error || "Token inválido/expirado. Vuelva a iniciar sesión.");
        Alert.alert("Acceso Denegado", "Su sesión ha caducado o es inválida.");
        router.replace('../app/(tabs)/index'); // Forzar re-login
      } else if (response.status === 404) {
        // 7. Manejo de Ciudadano No Encontrado
        setError(data.mensaje || "Ciudadano no encontrado en el sistema.");
      } else {
        // 8. Otros Errores (500, etc.)
        setError(data.error || data.mensaje || "Error al consultar los datos.");
      }

    } catch (err) {
      // 9. Error de Red: Manejar fallos de conexión
      console.error("Network or parsing error:", err);
      setError("Error de red: No se pudo conectar al servidor. Verifique su IP.");
    } finally {
      setIsLoading(false);
    }
  };

  // 10. Retornar variables y funciones
  return { 
    ciudadano, 
    isLoading, 
    error, 
    searchCiudadano 
  };
}