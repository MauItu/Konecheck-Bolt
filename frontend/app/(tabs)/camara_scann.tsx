"use client"

import { CameraView, useCameraPermissions } from "expo-camera"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform } from "react-native"
import { Camera, CheckCircle, RefreshCw, Zap, ZapOff } from "lucide-react-native"
import { useIsFocused } from "@react-navigation/native" 
// import { useCiudadanoSearch } from "@/hooks/useCiudadanoSearch" // REMOVIDO
import CiudadanoResultModal from "../components/CiudadanoResultModal"

// Nueva interfaz (debe coincidir con la del Modal)
interface CiudadanoData {
  identificacion: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  lugar_nacimiento: string
  rh: string
  tipo_documento: string
  parsingSuccess: boolean
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  // Ahora almacenamos el objeto de datos completo, no solo la ID
  const [ciudadanoData, setCiudadanoData] = useState<CiudadanoData | null>(null) 
  const [modalVisible, setModalVisible] = useState(false)
  const [torch, setTorch] = useState(false) 
  
  const isFocused = useIsFocused()
  // const { searchCiudadano, ciudadano, error, isLoading } = useCiudadanoSearch() // REMOVIDO

  // Efecto para mostrar el modal inmediatamente después de escanear y parsear
  useEffect(() => {
    if (scanned && ciudadanoData) {
      setModalVisible(true);
    } else if (scanned && !ciudadanoData) {
      // Si escaneó pero el parsing falló, forzamos el modal de error
      setModalVisible(true);
    }
  }, [scanned, ciudadanoData]);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setCiudadanoData(null);
    }
  }, [isFocused]);

  if (!permission) {
    return <View style={styles.container} />
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={56} color="#388E3C" />
        <Text style={styles.messageTitle}>Permiso Requerido</Text>
        <Text style={styles.message}>Necesitas activar el permiso de cámara en la configuración del dispositivo.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Solicitar Permiso</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return
    
    // console.log(`Raw Data Scanned: ${data}`); // DEBUG: Descomentar para ver la trama cruda

    const parsedData = parseCedulaData(data, type);

    setScanned(true)
    Vibration.vibrate()
    setCiudadanoData(parsedData)
    // Ya NO se llama a searchCiudadano, solo se muestra el modal.
  }

  return (
    <View style={styles.container}>
      {isFocused && !scanned && (
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: ["pdf417", "qr", "code128", "ean13"], 
          }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <TouchableOpacity 
              style={styles.torchButton} 
              onPress={() => setTorch(!torch)}
            >
              {torch ? <ZapOff color="white" size={24} /> : <Zap color="white" size={24} />}
              <Text style={styles.torchText}>Flash</Text>
            </TouchableOpacity>

            <Text style={styles.instruction}>
              Apunta al código. La lectura exitosa mostrará los datos del documento.
            </Text>
          </View>
        </CameraView>
      )}

      {/* VISTA DE CARGA (Ahora solo es una pantalla de espera mientras se abre el modal) */}
      {scanned && !modalVisible && (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <View style={{alignItems: 'center'}}>
                  <RefreshCw size={40} color="#388E3C" className="animate-spin" />
                  <Text style={{marginTop: 15}}>Procesando datos...</Text>
            </View>
          </View>
        </View>
      )}

      <CiudadanoResultModal
        visible={modalVisible}
        ciudadano={ciudadanoData}
        onClose={() => {
          setModalVisible(false)
          setScanned(false)
          setCiudadanoData(null)
        }}
      />
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/* FUNCIÓN DE PARSEO COMPLETO DE CÉDULA (PDF417)                              */
/* -------------------------------------------------------------------------- */

/**
 * Intenta extraer todos los campos de datos de la cédula colombiana (PDF417).
 * Utiliza heurística de limpieza y separación común para esta trama.
 */
function parseCedulaData(raw: string, type: string): CiudadanoData | null {
  
  const baseData: CiudadanoData = {
    identificacion: 'N/A', nombres: 'N/A', apellidos: 'N/A', 
    fecha_nacimiento: 'N/A', lugar_nacimiento: 'N/A', rh: 'N/A', 
    tipo_documento: 'N/A', parsingSuccess: false
  };

  if (type === 'pdf417') {
    // 1. Limpieza y estandarización del separador: 
    // Reemplaza caracteres de control (\u001D, \r, etc.) y no alfanuméricos con un pipe (|).
    // Esto es vital para manejar la trama sucia del PDF417.
    const cleanedRaw = raw
      .replace(/[^a-zA-Z0-9\s-/\.]/g, '|')
      .replace(/\|{2,}/g, '|') // Consolida múltiples separadores
      .replace(/^\||\|$/g, ''); // Remueve separadores al inicio/fin

    const parts = cleanedRaw.split('|').filter(p => p.trim() !== '');
    
    // Si la CC está estructurada por menos de 10 campos clave, el parsing es dudoso.
    if (parts.length < 10) return {...baseData, tipo_documento: 'PDF417', parsingSuccess: false};

    // Heurística de la CC Colombiana (Índices aproximados después del split):
    // 0: Serial (ej: 033...)
    // 1: Identificacion (ID)
    // 2: Apellido 1
    // 3: Apellido 2
    // 4: Nombre 1
    // 5: Nombre 2
    // 7: Fecha Nacimiento (DD/MM/AAAA)
    // 8: Lugar Nacimiento (ej: BOGOTA)
    // 9: RH (ej: O+)
    
    // Asignación de datos
    const result: CiudadanoData = {
        ...baseData,
        identificacion: parts[1] || baseData.identificacion,
        apellidos: `${parts[2] || ''} ${parts[3] || ''}`.trim(),
        nombres: `${parts[4] || ''} ${parts[5] || ''}`.trim(),
        fecha_nacimiento: parts[7] || baseData.fecha_nacimiento,
        lugar_nacimiento: parts[8] || baseData.lugar_nacimiento,
        rh: parts[9] || baseData.rh,
        tipo_documento: 'C.C. (PDF417)',
        parsingSuccess: true
    };
    
    // VALIDACIÓN CRÍTICA: Reasegurar la ID si el índice 1 era el número de serie
    if (!/^\d{7,10}$/.test(result.identificacion)) {
         // Si el índice 1 falló, intentamos tomar el SEGUNDO número largo de la trama original.
         const allNumeric = Array.from(raw.matchAll(/\d{7,10}/g), m => m[0]);
         if (allNumeric.length >= 2) {
             result.identificacion = allNumeric[1]; // El segundo es la ID
         } else {
             // Falló la extracción de ID
             result.parsingSuccess = false; 
         }
    }

    return result;
  }
  
  // Lógica para QR (Solo ID, los demás campos serán 'N/A' si no hay BD)
  if (type === 'qr') {
      const idMatch = raw.match(/\d{7,10}/);
      if (idMatch) {
          return {
            ...baseData,
            identificacion: idMatch[0],
            nombres: 'Datos no disponibles',
            apellidos: 'Localmente',
            tipo_documento: 'QR',
            parsingSuccess: true
          }
      }
  }

  return {...baseData, tipo_documento: type, parsingSuccess: false};
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 280, height: 280, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#66BB6A' },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  instruction: { color: 'white', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 5 },
  torchButton: { position: 'absolute', bottom: 100, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 20, right: 20 },
  torchText: { color: 'white', fontSize: 12, marginTop: 4 },
  
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 20 },
  messageTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  message: { textAlign: 'center', marginTop: 10, marginBottom: 20, color: '#666' },
  permissionButton: { backgroundColor: '#388E3C', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  
  resultContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  resultCard: { backgroundColor: 'white', padding: 30, borderRadius: 15, width: '80%', alignItems: 'center' },
})