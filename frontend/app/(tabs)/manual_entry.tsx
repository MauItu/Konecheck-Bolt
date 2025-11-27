"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native"
import { Search, Shield, Loader } from "lucide-react-native"

import { useCiudadanoSearch } from "../../hooks/useCiudadanoSearch"
import CiudadanoResultModal from "../components/CiudadanoResultModal"

export default function ManualCedulaScreen() {
  const [cedula, setCedula] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const { ciudadano, isLoading, error, searchCiudadano } = useCiudadanoSearch()

  const handleSubmit = async () => {
    if (isLoading) return

    const cleaned = cedula.trim()
    // Validación básica
    if (!/^\d{5,12}$/.test(cleaned)) {
      Alert.alert("Número inválido", "Ingrese un número de cédula válido.")
      return
    }

    // Buscamos (esto devuelve un objeto ya sea de BD o 'No Registrado')
    const result = await searchCiudadano(cleaned)

    // Si hay resultado (cualquiera) o error, mostramos modal
    if (result || error) {
      setModalVisible(true)
    }
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setCedula("") // Limpiar campo
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconInner}>
              <Shield size={56} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>Consulta Manual</Text>
          <Text style={styles.subtitle}>Ingrese el documento para verificar</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Número de Cédula</Text>

            <View style={styles.inputWrapper}>
              <Search size={20} color={isFocused ? "#388E3C" : "#9E9E9E"} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isFocused && styles.inputFocused]}
                placeholder="Ej: 1000123456"
                placeholderTextColor="#9E9E9E"
                value={cedula}
                onChangeText={setCedula}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="numeric"
                maxLength={12}
                returnKeyType="search"
                onSubmitEditing={handleSubmit}
                editable={!isLoading}
              />
            </View>

            {isLoading && (
              <View style={styles.feedbackContainer}>
                <Loader size={20} color="#388E3C" className="animate-spin" />
                <Text style={styles.loadingText}>Consultando...</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>{isLoading ? "VERIFICANDO..." : "BUSCAR AHORA"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CiudadanoResultModal visible={modalVisible} ciudadano={ciudadano} error={error} onClose={handleModalClose} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
  backgroundCircle1: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "#66BB6A", opacity: 0.1, top: -100, right: -100 },
  backgroundCircle2: { position: "absolute", width: 250, height: 250, borderRadius: 125, backgroundColor: "#388E3C", opacity: 0.08, bottom: -80, left: -80 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, width: "100%" },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  iconInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#388E3C", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800", color: "#2E7D32", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 30 },
  card: { width: "100%", backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, elevation: 4 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 15 },
  inputWrapper: { position: "relative", width: "100%", marginBottom: 16 },
  inputIcon: { position: "absolute", left: 16, top: 16, zIndex: 1 },
  input: { width: "100%", paddingLeft: 48, paddingRight: 16, paddingVertical: 14, borderWidth: 1.5, borderColor: "#E0E0E0", borderRadius: 12, fontSize: 16, backgroundColor: "#FAFAFA" },
  inputFocused: { borderColor: "#388E3C", backgroundColor: "#FFFFFF" },
  feedbackContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 15, gap: 10 },
  loadingText: { color: "#388E3C", fontWeight: "600" },
  button: { backgroundColor: "#388E3C", paddingVertical: 16, borderRadius: 12, alignItems: "center", width: "100%" },
  buttonDisabled: { backgroundColor: "#A5D6A7" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
})