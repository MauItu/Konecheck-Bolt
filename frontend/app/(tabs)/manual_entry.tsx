"use client"

import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import { List } from "lucide-react-native"

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
      <View style={styles.iconContainer}>
        <List size={48} color="#388E3C" strokeWidth={2.5} />
      </View>

      <Text style={styles.title}>Ingreso Manual de Cédula</Text>
      <Text style={styles.message}>Ingrese el número de cédula para buscar manualmente</Text>

      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholder="Número de cédula"
        placeholderTextColor="#9E9E9E"
        value={cedula}
        onChangeText={setCedula}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="numeric"
        maxLength={10}
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFocused: {
    borderColor: "#388E3C",
    shadowColor: "#388E3C",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    backgroundColor: "#388E3C",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
})
