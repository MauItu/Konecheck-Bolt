"use client"

import { CameraView, useCameraPermissions } from "expo-camera"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform } from "react-native"
import { Camera, CheckCircle, RefreshCw, Zap, ZapOff } from "lucide-react-native"
// --- CORRECCIÓN CLAVE AQUÍ ---
import { useIsFocused } from "@react-navigation/native" 
// Opcional: Si necesitas Stack en otro lado, pero useIsFocused debe ser de @react-navigation/native
// import { Stack } from "expo-router" 
// -----------------------------
import { useCiudadanoSearch } from "@/hooks/useCiudadanoSearch"
import CiudadanoResultModal from "../components/CiudadanoResultModal"

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [barcode, setBarcode] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [torch, setTorch] = useState(false) 
  
  // Ahora el hook useIsFocused está importado correctamente
  const isFocused = useIsFocused() 
  const { searchCiudadano, ciudadano, error, isLoading } = useCiudadanoSearch()

  useEffect(() => {
    if (scanned && (ciudadano || error)) {
      setModalVisible(true);
    }
  }, [ciudadano, error, scanned]);

  useEffect(() => {
    // Si la pantalla se enfoca, reiniciamos el escáner
    if (isFocused) {
      setScanned(false);
      setBarcode(null);
    }
  }, [isFocused]);

  if (!permission) {
    return <View style={styles.container} />
  }

  if (!permission.granted) {
    // ... (Mantener el código de permisos)
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

    const cedulaIdentificada = extractCedulaFromRaw(data, type);

    if (cedulaIdentificada) {
      setScanned(true)
      Vibration.vibrate()
      setBarcode(cedulaIdentificada)
      await searchCiudadano(cedulaIdentificada); 
    }
  }

  return (
    <View style={styles.container}>
      {isFocused && !scanned && ( // Renderiza solo si está enfocada y no ha escaneado
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            // Reducimos los tipos a los esenciales para rendimiento
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
              Apunta al código. La lectura exitosa consultará tu BD.
            </Text>
          </View>
        </CameraView>
      )}

      {scanned && (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
             {isLoading ? (
               <View style={{alignItems: 'center'}}>
                  <RefreshCw size={40} color="#388E3C" className="animate-spin" />
                  <Text style={{marginTop: 15}}>Consultando {barcode}...</Text>
               </View>
             ) : (
                <View style={{alignItems: 'center'}}>
                    <CheckCircle size={40} color="#388E3C" />
                    <Text style={styles.resultTitle}>Lectura y Búsqueda Finalizada</Text>
                    <Text style={styles.barcodeText}>ID: {barcode}</Text>
                    <TouchableOpacity 
                        style={styles.scanAgainButton} 
                        onPress={() => setScanned(false)}
                    >
                        <Text style={styles.buttonText}>Escanear de nuevo</Text>
                    </TouchableOpacity>
                </View>
             )}
          </View>
        </View>
      )}

      <CiudadanoResultModal
        visible={modalVisible}
        ciudadano={ciudadano}
        error={error}
        onClose={() => {
          setModalVisible(false)
          setScanned(false)
        }}
      />
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/* LÓGICA DE PARSEO AVANZADA (Para obtener la cédula 794... y no el serial 033...) */
/* -------------------------------------------------------------------------- */
function extractCedulaFromRaw(raw: string, type: string): string | null {
  
  if (type === 'pdf417') {
    
    // 1. INTENTO ESPECÍFICO: Buscar el patrón "0P"
    const match0P = raw.match(/0P\d*(\d{7,10})/);
    if (match0P && match0P[1]) {
        return match0P[1];
    }

    // 2. INTENTO HEURÍSTICO AVANZADO: Tomar la segunda secuencia larga
    const allNumericSequences = Array.from(raw.matchAll(/\d{7,10}/g), m => m[0]);
    
    if (allNumericSequences.length >= 2) {
        // La primera secuencia es el NÚMERO DE SERIE. La segunda es la CÉDULA.
        return allNumericSequences[1]; 
    } 
    
    if (allNumericSequences.length === 1) {
        // Fallback 1: Si solo hay un número largo, lo devolvemos.
        return allNumericSequences[0];
    }
    
    // 3. FALLBACK SUCIO: Limpiar y tomar el inicio
    const justNumbers = raw.replace(/\D/g, '');
    if (justNumbers.length >= 7) {
       const cleanNumber = justNumbers.replace(/^0+/, '');
       if (cleanNumber.length >= 7) {
            return cleanNumber.substring(0, 10);
       }
    }
  }
  
  // Lógica para QR u otros códigos
  else {
      const match = raw.match(/\d{7,10}/);
      if (match) return match[0];
  }

  return null;
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
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  barcodeText: { fontSize: 18, fontWeight: '600', color: '#388E3C' },
  scanAgainButton: { backgroundColor: '#388E3C', padding: 10, borderRadius: 8, marginTop: 10 }
})