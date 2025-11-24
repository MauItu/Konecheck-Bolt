"use client"

import { CameraView, useCameraPermissions } from "expo-camera"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from "react-native"
import { Camera, CheckCircle, RefreshCw } from "lucide-react-native"
import { useCiudadanoSearch } from "@/hooks/useCiudadanoSearch"
import CiudadanoResultModal from "../components/CiudadanoResultModal"

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [barcode, setBarcode] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  
  // Hook de conexión al Backend
  const { searchCiudadano, ciudadano, error, isLoading } = useCiudadanoSearch()

  // Efecto para abrir el modal automáticamente si la consulta al backend responde (éxito o error específico)
  useEffect(() => {
    if (scanned && (ciudadano || error)) {
      setModalVisible(true);
    }
  }, [ciudadano, error, scanned]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando cámara...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionIconContainer}>
          <Camera size={56} color="#388E3C" strokeWidth={2} />
        </View>
        <Text style={styles.messageTitle}>Permiso de Cámara</Text>
        <Text style={styles.message}>Necesitamos acceso a tu cámara para escanear documentos de identidad.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Permitir Acceso</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return
    
    // 1. Intentar parsear la cédula de la trama cruda
    const cedulaIdentificada = extractCedulaFromRaw(data, type);

    if (cedulaIdentificada) {
      setScanned(true)
      Vibration.vibrate() // Feedback táctil
      setBarcode(cedulaIdentificada)
      
      // 2. Consultar al Backend con la cédula limpia
      await searchCiudadano(cedulaIdentificada);
      
      // El useEffect arriba se encargará de abrir el modal cuando llegue la respuesta
    } else {
       // Opcional: Si escanea algo que no parece cédula, puedes ignorarlo o mostrar alerta
       // console.log("Data escaneada no válida:", data);
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setScanned(false)
    setBarcode(null)
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["pdf417", "qr", "code128"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.instruction}>
              Escanea el código de barras (PDF417) {"\n"}al respaldo de la cédula
            </Text>
          </View>
        </CameraView>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
            {isLoading ? (
               <View style={{alignItems: 'center', padding: 20}}>
                  <RefreshCw size={48} color="#388E3C" className="animate-spin" />
                  <Text style={[styles.resultTitle, {marginTop: 20}]}>Consultando BD...</Text>
               </View>
            ) : (
              <>
                <View style={styles.successIconContainer}>
                  <CheckCircle size={48} color="#FFFFFF" strokeWidth={2.5} />
                </View>

                <Text style={styles.resultTitle}>Lectura Exitosa</Text>
                <Text style={styles.subTitle}>Documento Detectado</Text>

                <View style={styles.barcodeContainer}>
                  <Text style={styles.resultBarcode}>{barcode}</Text>
                </View>

                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={() => setScanned(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.scanAgainText}>Escanear Otro</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}

      {/* Modal con los datos traídos del Backend */}
      <CiudadanoResultModal
        visible={modalVisible}
        ciudadano={ciudadano} // Datos completos (SQL)
        error={error}
        onClose={handleCloseModal}
      />
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/* LÓGICA DE PARSEO AVANZADA                           */
/* -------------------------------------------------------------------------- */

/**
 * Intenta extraer el número de identificación de tramas PDF417 (Cédula) o QR.
 */
function extractCedulaFromRaw(raw: string, type: string): string | null {
  // Limpieza básica: quitar caracteres de control no imprimibles si molestan
  // pero a veces son necesarios para separar campos. Trabajaremos con la cadena cruda.
  
  if (type === 'pdf417') {
    // CASO 1: PDF417 (Cédula Física Nueva/Antigua)
    // El formato PM-01 suele empezar con '0P' seguido de muchos ceros y luego la cédula.
    // O contiene la cadena "PubDSK".
    // La estrategia más segura es buscar la primera secuencia numérica larga válida (7-10 dígitos)
    // que NO sea una fecha (las fechas suelen empezar por 19xx o 20xx y están más adelante).
    
    // Regex: Busca "0P" opcional, ceros opcionales, y captura de 7 a 10 dígitos.
    // El patrón de la cédula suele estar al principio de la trama.
    
    // Intento 1: Patrón estricto de inicio de trama (Común en scanners seriales)
    const matchStart = raw.match(/^0P\d*(\d{7,10})\b/);
    if (matchStart && matchStart[1]) return matchStart[1];

    // Intento 2: Búsqueda de secuencia numérica limpia.
    // Buscamos números de 7 a 10 dígitos. 
    // Filtramos para evitar confundir con la fecha de nacimiento (ej. 19900101 tiene 8 dígitos).
    // Generalmente la cédula aparece ANTES que las fechas en la trama.
    const numericMatches = raw.match(/\b\d{7,10}\b/g);
    
    if (numericMatches && numericMatches.length > 0) {
      // Tomamos el primer número encontrado que parezca cédula.
      // Validamos que no parezca un año obvio si es de 8 dígitos (ej: empieza por 19 o 20)
      // Aunque hay cédulas viejas que empiezan por 19 millones, el contexto de la trama suele poner la ID primero.
      return numericMatches[0];
    }
    
    // Intento 3: Si la trama es muy sucia, limpiar todo lo que no sea numérico
    // y tomar los primeros 10 dígitos (fallback peligroso pero útil a veces)
    const justNumbers = raw.replace(/\D/g, '');
    if (justNumbers.length >= 7) {
       // Las tramas suelen empezar con muchos ceros, quitarlos.
       const cleanNumber = justNumbers.replace(/^0+/, '');
       return cleanNumber.substring(0, 10); // Cortar si es muy largo
    }
  }
  
  // CASO 2: QR Code (Cédula Digital o códigos simples)
  if (type === 'qr') {
      // Si el QR es solo el número:
      if (/^\d{7,10}$/.test(raw.trim())) {
          return raw.trim();
      }
      // Si es una URL (ej: https://.../12345678)
      const urlMatch = raw.match(/\/(\d{7,10})(?:\/|$)/);
      if (urlMatch) return urlMatch[1];
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#388E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingText: { color: '#fff', fontSize: 16 },
  messageTitle: { fontSize: 26, fontWeight: 'bold', color: '#2E7D32', marginBottom: 12, textAlign: 'center' },
  message: { color: '#666', fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 24, paddingHorizontal: 16 },
  permissionButton: { backgroundColor: '#388E3C', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12, shadowColor: '#388E3C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  camera: { flex: 1, width: '100%' },
  overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 300, height: 200, position: 'relative' }, // Más ancho para PDF417
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#66BB6A' },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  instruction: { color: '#fff', fontSize: 16, marginTop: 40, textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F5F5F5' },
  resultCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32, width: '100%', maxWidth: 400, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  successIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#388E3C', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
  subTitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  barcodeContainer: { backgroundColor: '#E8F5E9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#66BB6A' },
  resultBarcode: { fontSize: 22, color: '#2E7D32', textAlign: 'center', fontWeight: '700', letterSpacing: 1 },
  scanAgainButton: { backgroundColor: '#388E3C', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  scanAgainText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
})