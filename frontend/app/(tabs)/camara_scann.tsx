"use client"

import { CameraView, useCameraPermissions } from "expo-camera"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Camera, CheckCircle } from "lucide-react-native"
import { useCiudadanoSearch } from "@/hooks/useCiudadanoSearch"
import CiudadanoResultModal from "../components/CiudadanoResultModal"


export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [barcode, setBarcode] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const { searchCiudadano, ciudadano, error } = useCiudadanoSearch()

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
        <Text style={styles.message}>Necesitamos acceso a tu cámara para escanear códigos de barras</Text>

        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Permitir Acceso</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true)
    setBarcode(data)

    if (type === 'pdf417') {
      const parsed = parseCedulaColombiana(data)
      if (parsed) {
        await searchCiudadano(parsed.identificacion)
        setModalVisible(true)
        return
      }
    }
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["aztec", "ean13", "ean8", "qr", "pdf417", "upc_e", "datamatrix", "code39", "code93", "itf14", "codabar", "code128", "upc_a"],
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
            <Text style={styles.instruction}>Apunta al código de barras para escanearlo</Text>
          </View>
        </CameraView>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <View style={styles.successIconContainer}>
              <CheckCircle size={48} color="#FFFFFF" strokeWidth={2.5} />
            </View>

            <Text style={styles.resultTitle}>Código Escaneado</Text>

            <View style={styles.barcodeContainer}>
              <Text style={styles.resultBarcode}>{barcode}</Text>
            </View>

            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => {
                setScanned(false)
                setBarcode(null)
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.scanAgainText}>Escanear Otro Código</Text>
            </TouchableOpacity>
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
          setBarcode(null)
        }}
      />
    </View>
  )
}

/* ----------  PARSEO CÉDULA COLOMBIANA (PDF417)  ---------- */
interface CedulaPDF417 {
  identificacion: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  lugar_nacimiento: string
}

function parseCedulaColombiana(raw: string): CedulaPDF417 | null {
  const parts = raw.split('@')
  if (parts.length < 5) return null
  return {
    identificacion: parts[0].trim(),
    nombres: parts[1].trim(),
    apellidos: parts[2].trim(),
    fecha_nacimiento: parts[3].trim(),
    lugar_nacimiento: parts[4].trim(),
  }
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
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  messageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  permissionButton: {
    backgroundColor: '#388E3C',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#388E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#66BB6A',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#388E3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#388E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  barcodeContainer: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#66BB6A',
  },
  resultBarcode: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  scanAgainButton: {
    backgroundColor: '#388E3C',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#388E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})