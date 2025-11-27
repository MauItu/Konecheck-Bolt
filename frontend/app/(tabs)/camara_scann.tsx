"use client"

import { CameraView, useCameraPermissions } from "expo-camera"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from "react-native"
import { Camera, RefreshCw, Zap, ZapOff } from "lucide-react-native"
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
    if (scanned && !isLoading && (ciudadano || error)) {
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
            <Text style={styles.messageTitle}>Permiso de Cámara</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.buttonText}>Activar Cámara</Text>
            </TouchableOpacity>
        </View>
    );
  }

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return
    
    console.log("Datos crudos leídos (PDF417):", data); 

    // 🔥 LÓGICA DE EXTRACCIÓN SIMPLIFICADA
    const resultadoLectura = parseCedulaId(data);

    if (resultadoLectura.parsingSuccess) {
      console.log("Cédula Limpia SELECCIONADA (FINAL):", resultadoLectura.identificacion); 
      
      setScanned(true)
      Vibration.vibrate()
      setBarcode(resultadoLectura.identificacion)
      
      // Enviamos el número LIMPIO a la base de datos
      await searchCiudadano(resultadoLectura.identificacion); 
    } else {
       console.log("No se pudo extraer una cédula válida de los datos leídos."); 
    }
  }

  return (
    <View style={styles.container}>
      {isFocused && !scanned && (
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: ["pdf417", "qr"], 
          }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
             <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.tl]} />
                <View style={[styles.corner, styles.tr]} />
                <View style={[styles.corner, styles.bl]} />
                <View style={[styles.corner, styles.br]} />
             </View>

            <TouchableOpacity 
              style={styles.torchButton} 
              onPress={() => setTorch(!torch)}
            >
              {torch ? <ZapOff color="white" size={24} /> : <Zap color="white" size={24} />}
              <Text style={styles.torchText}>Luz</Text>
            </TouchableOpacity>

            <Text style={styles.instruction}>
              Enfoque la parte trasera de la cédula (Código de Barras)
            </Text>
          </View>
        </CameraView>
      )}

      {/* Loading Overlay */}
      {scanned && !modalVisible && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
             <RefreshCw size={40} color="#388E3C" className="animate-spin" />
             <Text style={styles.loadingTitle}>Verificando Huella...</Text>
             <Text style={styles.loadingSubtitle}>Consultando base de datos...</Text>
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

/**
 * 🔥 ALGORITMO SIMPLE Y DIRECTO (Cédula moderna)
 * Busca solo la primera secuencia de 10 dígitos que empiece por '1' en la cadena cruda.
 */
function parseCedulaId(raw: string): ParsedIdResult {
    
    // 1. Buscamos el patrón 1 seguido de 9 dígitos (1\d{9}) en toda la cadena.
    // El 'g' es para búsqueda global, pero match() sin 'g' en JavaScript retorna la primera coincidencia, lo cual es ideal aquí.
    const nuipRegex = /1\d{9}/; 
    const nuipMatch = raw.match(nuipRegex); 

    if (nuipMatch) {
        // En tu caso, esto encontrará '1025523117' en la secuencia '...850678261025523117...'
        const extractedNuip = nuipMatch[0];
        console.log("¡Éxito! Cédula moderna de 10 dígitos encontrada:", extractedNuip);
        return { identificacion: extractedNuip, parsingSuccess: true };
    }
    
    // 2. Fallback para cédulas antiguas (6-8 dígitos)
    // Solo si no se encontró el NUIP de 10 dígitos.
    
    // Aislamos todos los bloques numéricos
    const matches = raw.replace(/[^0-9]/g, ' ').match(/\d+/g);

    if (matches) {
        for (const rawCandidate of matches) {
            // Eliminamos ceros a la izquierda y buscamos cédulas antiguas
            const cleanCandidate = Number(rawCandidate).toString();
            const len = cleanCandidate.length;

            if (len >= 6 && len <= 8) {
                 // Descartamos si parece fecha (19xx o 20xx)
                 if (len === 8 && (cleanCandidate.startsWith('19') || cleanCandidate.startsWith('20'))) {
                     continue;
                 }
                 console.log("Fallback: Cédula antigua (6-8 dígitos) seleccionada:", cleanCandidate);
                 return { identificacion: cleanCandidate, parsingSuccess: true };
            }
        }
    }

    // 3. Ningún patrón de cédula encontrado
    console.log("Fallo total: No se encontró ningún patrón de cédula válido.");
    return { identificacion: '', parsingSuccess: false };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  
  scanFrame: { width: 320, height: 220, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#388E3C', borderWidth: 5 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  instruction: { color: 'white', marginTop: 50, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, overflow: 'hidden', fontWeight: 'bold', textAlign: 'center' },
  torchButton: { position: 'absolute', bottom: 60, right: 30, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 50 },
  torchText: { color: 'white', fontSize: 10, marginTop: 4 },
  
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  messageTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#333' },
  permissionButton: { backgroundColor: '#388E3C', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' },
  loadingCard: { backgroundColor: 'white', padding: 25, borderRadius: 16, alignItems: 'center', width: '85%' },
  loadingTitle: { marginTop: 15, fontSize: 18, fontWeight: 'bold', color: '#333' },
  loadingSubtitle: { marginTop: 5, fontSize: 14, color: '#666' },
})