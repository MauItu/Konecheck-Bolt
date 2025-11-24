import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native"
import { Shield, Loader } from "lucide-react-native"
import { useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"

// ------------------------------------------------------------------
// ⚠️ CONFIGURACIÓN CRÍTICA: BASE URL DEL BACKEND
// Reemplaza esto con la IP LAN de la red wifi y el puerto 3000.
const API_BASE_URL = "http://192.168.5.107:3000/api"
// ------------------------------------------------------------------

// Función auxiliar para guardar el token de forma condicional
// Esto resuelve el error en el navegador (web) y usa SecureStore en nativo.
async function saveToken(token: string) {
  if (Platform.OS === "web") {
    // Advertencia: Usar localStorage en la web no es seguro para producción.
    console.log("Usando localStorage para guardar el token en la web (solo desarrollo).")
    localStorage.setItem("userToken", token)
  } else {
    // iOS y Android (Seguro)
    await SecureStore.setItemAsync("userToken", token)
  }
}

export default function LoginPage() {
  const [identification, setIdentification] = useState("")
  const [password, setPassword] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const Login = async () => {
    // 1. Prevenir doble envío y validar campos
    if (isLoading) return

    if (!identification || !password) {
      Alert.alert("Error", "Debe ingresar su identificación y contraseña.")
      return
    }

    setIsLoading(true) // Activa el indicador de carga

    try {
      // 2. Realizar la petición POST al endpoint de Login
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identificacion: identification,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // 3. Login Exitoso (Status 200)

        // Guardar el JWT Token de forma segura/condicional
        await saveToken(data.token)

        // 4. Navegación a la cámara scanner
        // Usamos 'replace' para que no pueda volver a Login con el botón atrás
        router.replace("/camara_scann")

        // Limpiar campos
        setIdentification("")
        setPassword("")
      } else {
        // 5. Login Fallido (Status 400, 401, 404, etc.)
        const errorMessage = data.mensaje || "Credenciales inválidas o error desconocido."
        Alert.alert("Error de Login", errorMessage)
      }
    } catch (error) {
      // 6. Error de Red/Servidor
      console.error("Error de conexión:", error)
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor. Verifique la URL de la API y su conexión.")
    } finally {
      setIsLoading(false) // Desactiva el indicador de carga
    }
  }



  // Renderizado del componente
  return (
    <View style={styles.container}>
      {/* Efectos de fondo */}
      <View style={styles.backgroundBubble1} />
      <View style={styles.backgroundBubble2} />

      {/* Contenedor principal */}
      <View style={styles.card}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Shield size={40} color="white" strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>KonCheck</Text>
          <Text style={styles.subtitle}>Sistema de Consulta</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Identificación</Text>
            <TextInput
              style={[styles.input, focusedField === "identification" && styles.inputFocused]}
              onFocus={() => setFocusedField("identification")}
              onBlur={() => setFocusedField(null)}
              onChangeText={setIdentification}
              value={identification}
              placeholder="Ingrese su identificación"
              placeholderTextColor="#9CA3AF"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[styles.input, focusedField === "password" && styles.inputFocused]}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              onChangeText={setPassword}
              value={password}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={Login}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.buttonContent}>
                <Loader size={20} color="white" className="animate-spin" />
                <Text style={styles.buttonText}>VERIFICANDO...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>INGRESAR</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>🛡️ Sistema exclusivo para Personal de la Fuerza Pública</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#388e3c",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  backgroundBubble1: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: [{ scale: 1.2 }],
  },
  backgroundBubble2: {
    position: "absolute",
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    transform: [{ scale: 1.2 }],
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#388e3c",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#388e3c",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#388e3c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  inputFocused: {
    borderColor: "#388e3c",
    backgroundColor: "#F0F9F0",
  },
  button: {
    backgroundColor: "#388e3c",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#388e3c",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: "#66a86a",
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 28,
    alignItems: "center",
  },
  footerContainer: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
})
