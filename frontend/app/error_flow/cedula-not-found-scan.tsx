"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { SearchX, Camera, Edit3, RotateCcw } from "lucide-react-native"

export default function CedulaNotFoundScanScreen() {
  const handleScanAgain = () => {
    console.log("Escanear de nuevo")
    // Aquí iría la navegación de vuelta al escáner
  }

  const handleManualEntry = () => {
    console.log("Ir a entrada manual")
    // Aquí iría la navegación a entrada manual
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <View style={styles.content}>
        <View style={styles.notFoundIconContainer}>
          <View style={styles.notFoundIconInner}>
            <SearchX size={56} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>

        <Text style={styles.title}>Cédula No Encontrada</Text>
        <Text style={styles.subtitle}>El código escaneado no está registrado</Text>

        <View style={styles.card}>
          <View style={styles.scannedCodeBox}>
            <Camera size={18} color="#388E3C" />
            <Text style={styles.scannedCodeLabel}>Código escaneado:</Text>
            <Text style={styles.scannedCode}>1234567890</Text>
          </View>

          <Text style={styles.errorMessage}>
            El código de barras fue leído correctamente, pero no se encontró información asociada en la base de datos.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Opciones disponibles:</Text>
            <Text style={styles.infoItem}>• Escanear otro código de barras</Text>
            <Text style={styles.infoItem}>• Ingresar el número manualmente</Text>
            <Text style={styles.infoItem}>• Verificar que el código sea correcto</Text>
          </View>

          <TouchableOpacity style={styles.scanButton} onPress={handleScanAgain} activeOpacity={0.8}>
            <RotateCcw size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.scanButtonText}>ESCANEAR OTRO CÓDIGO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.manualButton} onPress={handleManualEntry} activeOpacity={0.8}>
            <Edit3 size={20} color="#388E3C" style={styles.buttonIcon} />
            <Text style={styles.manualButtonText}>INGRESAR MANUALMENTE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBadge}>
            <SearchX size={12} color="#388E3C" />
            <Text style={styles.footerText}>Verifica que el código pertenezca a una cédula válida</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    position: "relative",
  },
  backgroundCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#90A4AE",
    opacity: 0.08,
    top: -100,
    right: -100,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#607D8B",
    opacity: 0.06,
    bottom: -80,
    left: -80,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    zIndex: 1,
  },
  notFoundIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#ECEFF1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#607D8B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  notFoundIconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#607D8B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#455A64",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#455A64",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "500",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#ECEFF1",
  },
  scannedCodeBox: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#66BB6A",
  },
  scannedCodeLabel: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
  },
  scannedCode: {
    fontSize: 15,
    color: "#2E7D32",
    fontWeight: "800",
    letterSpacing: 1,
  },
  errorMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E65100",
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  manualButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "#388E3C",
  },
  manualButtonText: {
    color: "#388E3C",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footerText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    maxWidth: 280,
    textAlign: "center",
  },
})
