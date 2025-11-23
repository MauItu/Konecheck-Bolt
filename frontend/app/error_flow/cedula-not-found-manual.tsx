"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { SearchX, AlertTriangle, ArrowLeft } from "lucide-react-native"

export default function CedulaNotFoundManualScreen() {
  const handleRetry = () => {
    console.log("Reintentar búsqueda")
    // Aquí iría la navegación de vuelta a entrada manual
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
        <Text style={styles.subtitle}>No hay registros para este número</Text>

        <View style={styles.card}>
          <Text style={styles.errorMessage}>
            El número de cédula ingresado no se encuentra en la base de datos del sistema.
          </Text>

          <View style={styles.warningBox}>
            <AlertTriangle size={20} color="#F57C00" style={styles.warningIcon} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Verifica el número</Text>
              <Text style={styles.warningText}>
                Asegúrate de haber ingresado correctamente todos los dígitos de la cédula.
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Posibles razones:</Text>
            <Text style={styles.infoItem}>• Número de cédula incorrecto</Text>
            <Text style={styles.infoItem}>• Ciudadano no registrado en el sistema</Text>
            <Text style={styles.infoItem}>• Error de digitación</Text>
          </View>

          <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
            <ArrowLeft size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.retryButtonText}>BUSCAR OTRA CÉDULA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBadge}>
            <SearchX size={12} color="#388E3C" />
            <Text style={styles.footerText}>Verifica el número antes de consultar</Text>
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
  errorMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  warningBox: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E65100",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#66BB6A",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
  },
  infoItem: {
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
