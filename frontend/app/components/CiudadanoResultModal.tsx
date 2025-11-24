import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from "react-native"
import { CheckCircle, XCircle, User } from "lucide-react-native"

interface CiudadanoData {
  identificacion: string
  nombres: string
  apellidos: string
  estado_judicial: string
  fecha_nacimiento?: string
  lugar_nacimiento?: string
  rh?: string
  // Propiedad opcional proveniente del hook enriquecido
  judicialStatus?: {
    label: string
    color: string
    isRequired: boolean
  }
}

interface CiudadanoResultModalProps {
  visible: boolean
  ciudadano: CiudadanoData | null
  error: string | null
  onClose: () => void
}

const CiudadanoResultModal: React.FC<CiudadanoResultModalProps> = ({ visible, ciudadano, error, onClose }) => {
  // Usar la propiedad judicialStatus si está disponible (viene del hook)
  const judicial = ciudadano?.judicialStatus

  // Determinar si es requerido: prioridad -> error (muestra como error), luego judicial.isRequired si existe, si no, fallback a inspección del string
  const fallbackRequerido =
    ciudadano?.estado_judicial?.toUpperCase().includes("REQUERIDO") ||
    ciudadano?.estado_judicial?.toUpperCase().includes("ACTIVO")

  const isRequerido = Boolean(error) ? true : (judicial ? judicial.isRequired : fallbackRequerido)

  // Labels/colores: si tenemos judicialStatus preferimos sus datos; en UI mostramos las etiquetas solicitadas:
  // "Búsqueda Activa" cuando isRequired === true, "No Requerido" cuando isRequired === false.
  const estadoLabel = error
    ? "Error"
    : judicial
    ? (judicial.isRequired ? "Búsqueda Activa" : "No Requerido")
    : (isRequerido ? "Búsqueda Activa" : "No Requerido")

  const estadoColor = error
    ? "#D32F2F"
    : judicial
    ? judicial.color
    : (isRequerido ? "#D32F2F" : "#388E3C")

  const nombreCompleto = ciudadano ? `${ciudadano.nombres} ${ciudadano.apellidos}` : "USUARIO"
  const cedulaFormateada = ciudadano?.identificacion || "N/A"

  // Mensaje según el estado
  let mensajeEstado = "El ciudadano no representa antecedentes judiciales vigentes."
  if (error) {
    mensajeEstado = error
  } else if (isRequerido) {
    mensajeEstado = "El ciudadano presenta requerimientos judiciales activos."
  } else {
    mensajeEstado = "No Requerido."
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.modalView}>
            {/*
                  <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                    <User size={32} color="#FFFFFF" strokeWidth={2.5} />
                    </View>
                    <Text style={styles.userName}>{nombreCompleto.toUpperCase()}</Text>
                  </View>
            */}

            <Text style={styles.mainTitle}>Consulta de Ciudadano</Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Registro de Ciudadano</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nombre:</Text>
                <Text style={styles.infoValue}>{nombreCompleto}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cédula:</Text>
                <Text style={styles.infoValue}>{cedulaFormateada}</Text>
              </View>

              <View style={styles.statusContainer}>
                {isRequerido ? (
                  <XCircle size={24} color={estadoColor} strokeWidth={2.5} fill={estadoColor} />
                ) : (
                  <CheckCircle size={24} color={estadoColor} strokeWidth={2.5} fill={estadoColor} />
                )}
                <Text style={[styles.statusText, { color: estadoColor }]}>
                  Estado Judicial: {estadoLabel}
                </Text>
              </View>

              <Text style={styles.statusMessage}>{mensajeEstado}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Nueva Consulta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 40,
  },
  modalView: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 30,
    gap: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9E9E9E",
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 30,
    textAlign: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#424242",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  statusMessage: {
    fontSize: 13,
    fontWeight: "400",
    color: "#616161",
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "100%",
    maxWidth: 300,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
})

export default CiudadanoResultModal
