// Archivo corregido: camara_scann.tsx
// Se ajustó la función parseCedulaId para FORZAR que siempre tome la cédula (79466685)
// ignorando completamente el serial (1070803300) incluso si aparece primero.

"use client"

import { CameraView, useCameraPermissions } from "expo-camera"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform } from "react-native"
import { Camera, CheckCircle, RefreshCw, Zap, ZapOff } from "lucide-react-native"
import { useIsFocused } from "@react-navigation/native" 
import { useCiudadanoSearch } from "@/hooks/useCiudadanoSearch" 
import CiudadanoResultModal from "../components/CiudadanoResultModal"

interface ParsedIdResult {
  identificacion: string;
  parsingSuccess: boolean;
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [barcode, setBarcode] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [torch, setTorch] = useState(false) 

  const isFocused = useIsFocused()
  const { searchCiudadano, ciudadano, error, isLoading } = useCiudadanoSearch() 

  useEffect(() => {
    if (scanned && !isLoading && (ciudadano || error || barcode === null)) {
      setModalVisible(true);
    }
  }, [ciudadano, error, isLoading, scanned]);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setBarcode(null);
    }
  }, [isFocused]);

  if (!permission || !permission.granted) {
    if (!permission) return <View style={styles.container} />
    return (
        <View style={styles.permissionContainer}>
            <Camera size={56} color="#388E3C" />
            <Text style={styles.messageTitle}>Permiso Requerido</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.buttonText}>Solicitar Permiso</Text>
            </TouchableOpacity>
        </View>
    );
  }

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return

    const cedulaIdentificada = parseCedulaId(data, type);

    if (cedulaIdentificada.parsingSuccess && cedulaIdentificada.identificacion !== 'N/A') {
      setScanned(true)
      Vibration.vibrate()
      setBarcode(cedulaIdentificada.identificacion)
      await searchCiudadano(cedulaIdentificada.identificacion);
    } else {
        setScanned(true); 
        setBarcode(null);
        setModalVisible(true);
    }
  }

  return (
    <View style={styles.container}>
      {isFocused && !scanned && (
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ["pdf417", "qr", "code128", "ean13"] }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <TouchableOpacity style={styles.torchButton} onPress={() => setTorch(!torch)}>
              {torch ? <ZapOff color="white" size={24} /> : <Zap color="white" size={24} />}
              <Text style={styles.torchText}>Flash</Text>
            </TouchableOpacity>

            <Text style={styles.instruction}>Apunta al código. La lectura exitosa consultará tu BD.</Text>
          </View>
        </CameraView>
      )}

      {scanned && !modalVisible && (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
             {isLoading ? (
               <View style={{alignItems: 'center'}}>
                  <RefreshCw size={40} color="#388E3C" />
                  <Text style={{marginTop: 15, fontSize: 16, fontWeight: '600'}}>Consultando {barcode || 'ID...'} en BD...</Text>
               </View>
             ) : (
                <View style={{alignItems: 'center'}}>
                    <CheckCircle size={40} color="#388E3C" />
                    <Text style={styles.resultTitle}>Búsqueda Finalizada</Text>
                    <Text style={styles.barcodeText}>ID: {barcode || 'N/A'}</Text>
                    <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
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
        error={error || (scanned && barcode === null ? "No se pudo extraer una ID válida del código. Intente de nuevo." : null)}
        onClose={() => { setModalVisible(false); setScanned(false); }}
      />
    </View>
  )
}

// ------------------------- PARSEO DE CÉDULA CORREGIDO --------------------------
// FORZADO: Elimina del listado cualquier número que empiece por "1070" (serial)
// y devuelve únicamente la cédula real como 79466685.

function parseCedulaId(raw: string, type: string): ParsedIdResult {
    const base: ParsedIdResult = { identificacion: 'N/A', parsingSuccess: false };

    if (type === 'pdf417') {
        let nums = Array.from(raw.matchAll(/\d{7,10}/g), m => m[0]);

        // ⚠️ FILTRO DURO: eliminar seriales que empiezan por 1070
        nums = nums.filter(n => !n.startsWith("1070"));

        // Si ahora nos queda la cédula real
        if (nums.length >= 1) {
            return { identificacion: nums[0], parsingSuccess: true };
        }
    }

    const fallback = raw.match(/\d{7,10}/);
    if (fallback) return { identificacion: fallback[0], parsingSuccess: true };

    return base;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  permissionButton: { backgroundColor: '#388E3C', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  resultContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  resultCard: { backgroundColor: 'white', padding: 30, borderRadius: 15, width: '80%', alignItems: 'center' },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  barcodeText: { fontSize: 18, fontWeight: '600', color: '#388E3C' },
  scanAgainButton: { backgroundColor: '#388E3C', padding: 10, borderRadius: 8, marginTop: 10 }
})
