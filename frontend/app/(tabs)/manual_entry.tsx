"use client"

import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import { Search, Shield, CheckCircle } from "lucide-react-native"

export default function ManualCedulaScreen() {
  const [cedula, setCedula] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = () => {
    const cleaned = cedula.trim()
    if (!/^\d{6,10}$/.test(cleaned)) {
      Alert.alert("Número inválido", "Ingrese un número de cédula válido (solo dígitos, 6-10 caracteres).")
      return
    }
    // Aquí iría la lógica de búsqueda/consulta con la cédula
    Alert.alert("Cédula enviada", `Cédula: ${cleaned}`)
    setCedula("")
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconInner}>
            <Shield size={56} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Consulta Manual</Text>
        <Text style={styles.subtitle}>Sistema de Verificación Ciudadana</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingrese el número de cédula</Text>

          <View style={styles.inputWrapper}>
            <Search size={20} color={isFocused ? "#388E3C" : "#9E9E9E"} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isFocused && styles.inputFocused]}
              placeholder="Ej: 1234567890"
              placeholderTextColor="#9E9E9E"
              value={cedula}
              onChangeText={setCedula}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="done"
            />
          </View>
          
          {/* <View style={styles.infoBadges}>
            <View style={styles.badge}>
              <CheckCircle size={14} color="#388E3C" />
              <Text style={styles.badgeText}>Búsqueda rápida</Text>
            </View>
            <View style={styles.badge}>
              <CheckCircle size={14} color="#388E3C" />
              <Text style={styles.badgeText}>Datos verificados</Text>
            </View>
          </View> */}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.buttonText}>CONSULTAR AHORA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBadge}>
            <Shield size={12} color="#388E3C" />
            <Text style={styles.footerText}>Sistema exclusivo para Personal de la Fuerza Pública</Text>
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
    backgroundColor: "#66BB6A",
    opacity: 0.1,
    top: -100,
    right: -100,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#388E3C",
    opacity: 0.08,
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
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  iconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#388E3C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2E7D32",
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
    borderColor: "#E8F5E9",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 16,
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    width: "100%",
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#333",
    fontWeight: "500",
  },
  inputFocused: {
    borderColor: "#388E3C",
    backgroundColor: "#FFFFFF",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  infoBadges: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#388E3C",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
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
