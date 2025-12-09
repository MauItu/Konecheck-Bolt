"use client"

import { CameraView, useCameraPermissions } from "expo-camera"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform } from "react-native"
import { Camera, CheckCircle, RefreshCw, Zap, ZapOff } from "lucide-react-native"
import { useIsFocused } from "@react-navigation/native" 
// Importación del hook y la interfaz (ahora disponible)
import { useCiudadanoSearch, CiudadanoData } from "@/hooks/useCiudadanoSearch" 
import CiudadanoResultModal from "../components/CiudadanoResultModal"

// Interface temporal para el resultado del parsing de ID 
interface ParsedIdResult {
  identificacion: string;
  parsingSuccess: boolean;
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [barcode, setBarcode] = useState<string | null>(null) // ID para la búsqueda
  const [modalVisible, setModalVisible] = useState(false)
  const [torch, setTorch] = useState(false) 
  
  const isFocused = useIsFocused()
  const { searchCiudadano, ciudadano, error, isLoading } = useCiudadanoSearch() 

  // Efecto para abrir el modal cuando la búsqueda termina (con o sin error/datos)
  useEffect(() => {
    if (scanned && !isLoading && (ciudadano || error || barcode === null)) {
      setModalVisible(true);
    }
  }, [ciudadano, error, isLoading, scanned]);

  // Efecto para resetear el estado cuando la pantalla gana foco (vuelve a la pestaña)
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
    
    console.log("Datos crudos leídos (PDF417):", data); 
    
    // Extraemos la ID usando la lógica mejorada 
    const cedulaIdentificada = parseCedulaId(data, type);

    if (cedulaIdentificada.parsingSuccess && cedulaIdentificada.identificacion !== 'N/A') {
      console.log("Cédula Limpia SELECCIONADA (FINAL):", cedulaIdentificada.identificacion); 
      setScanned(true)
      Vibration.vibrate()
      setBarcode(cedulaIdentificada.identificacion)
      // Usamos el ID correcto para buscar en la BD
      await searchCiudadano(cedulaIdentificada.identificacion); 
    } else {
        // Fallo en la extracción de la ID
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
              Apunta al código. La lectura exitosa consultará tu BD.
            </Text>
          </View>
        </CameraView>
      )}

      {/* Pantalla de Carga/Resultado */}
      {scanned && !modalVisible && (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
             {isLoading ? (
               <View style={{alignItems: 'center'}}>
                  <RefreshCw size={40} color="#388E3C" style={{ opacity: 1 }} />
                  <Text style={{marginTop: 15, fontSize: 16, fontWeight: '600'}}>Consultando {barcode || 'ID...'} en BD...</Text>
               </View>
             ) : (
                <View style={{alignItems: 'center'}}>
                    <CheckCircle size={40} color="#388E3C" />
                    <Text style={styles.resultTitle}>Búsqueda Finalizada</Text>
                    <Text style={styles.barcodeText}>ID: {barcode || 'N/A'}</Text>
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
        // Mostrar error de hook, o un error de parsing si se escaneó pero no se extrajo ID
        error={error || (scanned && barcode === null ? "No se pudo extraer una ID válida del código de barras. Intente de nuevo." : null)} 
        onClose={() => {
          setModalVisible(false)
          setScanned(false)
        }}
      />
    </View>
  )
}


function parseCedulaId(raw: string, type: string): ParsedIdResult {
    const base: ParsedIdResult = { identificacion: 'N/A', parsingSuccess: false };

    // Normalizar: decodificar URL encoded y quitar saltos de línea/espacios raros
    try {
        raw = decodeURIComponent(raw);
    } catch (e) {
        // si falla la decodificación, usamos el raw tal cual
    }
    raw = raw.replace(/\r|\n|\s|%0A/g, ' ');



    // 2. EXTRACCIÓN ROBUSTA: Buscar el patrón de 10 dígitos (NUIP) que empieza por '1'
    const nuipRegex = /1\d{9}/; 
    const nuipMatch = raw.match(nuipRegex); 

    if (nuipMatch) {
        // Esto extraerá la cédula moderna incluso si está pegada a otros números
        const extractedNuip = nuipMatch[0];
        console.log("Prioridad 2: Cédula moderna de 10 dígitos encontrada por patrón:", extractedNuip);
        return { identificacion: extractedNuip, parsingSuccess: true };
    }
    
    
    // 3. FALLBACK: Búsqueda general de números (para cédulas antiguas/otros formatos)
    
    // Extraemos todos los bloques numéricos separados por cualquier cosa que no sea dígito
    const matches = raw.replace(/[^0-9]/g, ' ').match(/\d+/g);

    if (matches) {
        for (const rawCandidate of matches) {
            // Eliminamos ceros a la izquierda para tener el número limpio
            const cleanCandidate = Number(rawCandidate).toString();
            const len = cleanCandidate.length;

            // Cédula antigua: 6-8 dígitos (excluyendo lo que parezca fecha de 8 dígitos)
            if (len >= 6 && len <= 8) {
                 if (len === 8 && (cleanCandidate.startsWith('19') || cleanCandidate.startsWith('20'))) {
                     continue; // Es probable que sea una fecha
                 }
                 console.log("Prioridad 3: Cédula antigua (6-8 dígitos) seleccionada:", cleanCandidate);
                 return { identificacion: cleanCandidate, parsingSuccess: true };
            }
        }
    }

    console.log("Fallo total: No se encontró ningún patrón de cédula válido.");
    return base;
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