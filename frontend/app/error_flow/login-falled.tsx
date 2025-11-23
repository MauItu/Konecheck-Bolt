"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { XCircle, Shield, ArrowLeft } from "lucide-react-native"

export default function LoginFailedScreen() {
  const handleRetry = () => {
    console.log("Reintentar login")
    // Aquí iría la navegación de vuelta al login
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <View style={styles.content}>
        <View style={styles.errorIconContainer}>
          <View style={styles.errorIconInner}>
            <XCircle size={56} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>

        <Text style={styles.title}>Acceso Denegado</Text>
        <Text style={styles.subtitle}>No se pudo verificar tu identidad</Text>

        <View style={styles.card}>
          <Text style={styles.errorMessage}>
            Las credenciales ingresadas son incorrectas. Por favor, verifica tu identificación y contraseña.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Posibles causas:</Text>
            <Text style={styles.infoItem}>• Identificación incorrecta</Text>
            <Text style={styles.infoItem}>• Contraseña incorrecta</Text>
            <Text style={styles.infoItem}>• Usuario no autorizado</Text>
          </View>

          <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
            <ArrowLeft size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.retryButtonText}>INTENTAR DE NUEVO</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBadge}>
            <Shield size={12} color="#D32F2F" />
            <Text style={styles.footerText}>Si el problema persiste, contacta al administrador</Text>
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
    backgroundColor: "#EF5350",
    opacity: 0.08,
    top: -100,
    right: -100,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#D32F2F",
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
  errorIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  errorIconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#D32F2F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#C62828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#C62828",
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
    borderColor: "#FFEBEE",
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
