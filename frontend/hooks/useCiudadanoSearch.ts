import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store'; 
import { useRouter } from 'expo-router'; 

export interface CiudadanoData { 
  identificacion: string;
  nombres: string;
  apellidos: string;
  estado_judicial: string;
  origen_datos?: 'BASE_DE_DATOS' | 'LECTURA_FISICA'; 
  judicialStatus?: {
    label: string;
    color: string;
    isRequired: boolean;
  };
}

// ⚠️ REVISA TU IP
const API_BASE_URL = 'http://172.20.10.3:3000/api'; 

export function useCiudadanoSearch() {
  const [ciudadano, setCiudadano] = useState<CiudadanoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 

  const getToken = async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('userToken');
    } else {
      return SecureStore.getItemAsync('userToken');
    }
  };

  // 🔥 LÓGICA DE ESTADOS CORREGIDA (SOLUCIÓN PROBLEMA 1)
  const mapEstadoJudicial = (raw?: string, isNotFound?: boolean) => {
    if (isNotFound) {
      return {
        label: 'NO REGISTRADO EN BD (Sin Novedad)',
        color: '#607D8B', // Gris Azulado
        isRequired: false,
      };
    }

    const value = (raw || '').trim();
    const lower = value.toLowerCase();

    // 1. PRIMERO validamos si dice explícitamente que NO es requerido
    if (lower.includes('no requerido') || lower.includes('sin novedad') || lower.includes('no solicita')) {
      return {
        label: raw || 'No Requerido',
        color: '#388E3C', // VERDE (Seguro)
        isRequired: false,
      };
    }

    // 2. LUEGO validamos si es requerido (Búsqueda estricta)
    // Solo si contiene palabras de alerta real
    if (
        lower.includes('requerido') || 
        lower.includes('captura') || 
        lower.includes('orden judicial') || 
        lower.includes('búsqueda') || 
        lower.includes('busqueda') ||
        lower.includes('activa')
    ) {
      return {
        label: '¡ALERTA: REQUERIDO!',
        color: '#D32F2F', // ROJO (Peligro)
        isRequired: true,
      };
    }

    // 3. Fallback: Si no dice ni una cosa ni la otra, asumimos Verde/Info
    return {
      label: raw || 'Sin Novedad',
      color: '#388E3C', 
      isRequired: false,
    };
  };

  const searchCiudadano = async (identificacion: string) => {
    setIsLoading(true);
    setError(null);
    setCiudadano(null);

    // Validación básica
    if (!identificacion) return;
    
    try {
      const token = await getToken();
      
      if (!token) {
        setError("Sesión no iniciada.");
        router.replace('../app/(tabs)/index'); 
        return; 
      }

      const url = `${API_BASE_URL}/ciudadanos/${identificacion}`;
      
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Encontrado en BD
        const judicialStatus = mapEstadoJudicial(data?.estado_judicial, false);
        const result: CiudadanoData = {
          ...data,
          origen_datos: 'BASE_DE_DATOS',
          judicialStatus,
        };
        setCiudadano(result);
        return result;

      } else if (response.status === 404) {
        // No encontrado -> Mostrar datos leídos limpios
        const judicialStatus = mapEstadoJudicial('No Registrado', true);
        
        const ciudadanoNoRegistrado: CiudadanoData = {
          identificacion: identificacion,
          nombres: "NO REGISTRADO", 
          apellidos: "EN BASE DE DATOS",
          estado_judicial: "No figura en sistema",
          origen_datos: 'LECTURA_FISICA',
          judicialStatus,
        };
        
        setCiudadano(ciudadanoNoRegistrado);
        return ciudadanoNoRegistrado;

      } else if (response.status === 401 || response.status === 403) {
        setError("Sesión caducada.");
        router.replace('../app/(tabs)/index'); 
      } else {
        setError(data.error || "Error al consultar los datos.");
      }

    } catch (err) {
      console.error("Network error:", err);
      setError("Error de red: Verifique su conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  return { ciudadano, isLoading, error, searchCiudadano };
}