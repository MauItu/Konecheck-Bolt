"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { AlertCircle, Camera, RotateCcw } from "lucide-react-native"

export default function BarcodeScanFailedScreen() {
  const handleRetry = () => {
    console.log("Reintentar escaneo")
    // Aquí iría la lógica para volver a escanear
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
        <View style={styles.warningIconContainer}>
          <View style={styles.warningIconInner}>
            <AlertCircle size={56} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>

        <Text style={styles.title}>Error de Escaneo</Text>
        <Text style={styles.subtitle}>No se pudo leer el código de barras</Text>

        <View style={styles.card}>
          <Text style={styles.errorMessage}>
            El código de barras no pudo ser leído correctamente. Por favor, intenta nuevamente o ingresa el número
            manualmente.
          </Text>

          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>Consejos para un mejor escaneo:</Text>
            <Text style={styles.tipItem}>• Asegúrate de tener buena iluminación</Text>
            <Text style={styles.tipItem}>• Mantén la cámara estable</Text>
            <Text style={styles.tipItem}>• Coloca el código dentro del marco</Text>
            <Text style={styles.tipItem}>• Limpia la lente de la cámara</Text>
          </View>

          <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
            <RotateCcw size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.retryButtonText}>ESCANEAR DE NUEVO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.manualButton} onPress={handleManualEntry} activeOpacity={0.8}>
            <Text style={styles.manualButtonText}>INGRESAR MANUALMENTE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBadge}>
            <Camera size={12} color="#388E3C" />
            <Text style={styles.footerText}>Verifica que el código esté en buen estado</Text>
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
    backgroundColor: "#FFA726",
    opacity: 0.08,
    top: -100,
    right: -100,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#FF9800",
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
  warningIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  warningIconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F57C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E65100",
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
    borderColor: "#FFF3E0",
  },
  errorMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  tipsBox: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#66BB6A",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  retryButton: {
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
  retryButtonText: {
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
    maxWidth: 250,
    textAlign: "center",
  },
})
