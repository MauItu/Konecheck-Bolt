import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from "react-native"
import { CheckCircle, XCircle, User } from "lucide-react-native"

// Interfaz que coincide con la respuesta del backend (que tiene judicialStatus)
interface CiudadanoData {
  identificacion: string
  nombres: string
  apellidos: string
  estado_judicial: string // Estado sin procesar de la BD
  fecha_nacimiento?: string
  lugar_nacimiento?: string
  rh?: string
  // Propiedad opcional proveniente del hook enriquecido (useCiudadanoSearch)
  judicialStatus?: {
    label: string
    color: string
    isRequired: boolean
  }
}

interface CiudadanoResultModalProps {
  visible: boolean
  ciudadano: CiudadanoData | null
  error: string | null // Volvemos a incluir el error
  onClose: () => void
}

const CiudadanoResultModal: React.FC<CiudadanoResultModalProps> = ({ visible, ciudadano, error, onClose }) => {
  // Usar la propiedad judicialStatus si está disponible (viene del hook)
  const judicial = ciudadano?.judicialStatus

  // Determinar si es requerido: prioridad -> error, luego judicial.isRequired si existe, si no, fallback
  const fallbackRequerido =
    ciudadano?.estado_judicial?.toUpperCase().includes("REQUERIDO") ||
    ciudadano?.estado_judicial?.toUpperCase().includes("ACTIVO")

  const isRequerido = Boolean(error) ? true : (judicial ? judicial.isRequired : fallbackRequerido)

  const estadoLabel = judicial ? judicial.label : ciudadano?.estado_judicial || "SIN ESTADO DEFINIDO"
  const estadoColor = judicial ? judicial.color : (isRequerido ? "#D32F2F" : "#388E3C")

  const nombreCompleto = ciudadano ? `${ciudadano.nombres} ${ciudadano.apellidos}` : "N/A"
  const cedulaFormateada = ciudadano?.identificacion || "N/A"

  const statusTitle = isRequerido ? "¡ATENCIÓN: REQUERIDO!" : "Sin Novedad Judicial"
  const statusIcon = isRequerido ? <XCircle size={32} color="white" /> : <CheckCircle size={32} color="white" />
  const statusMessage = isRequerido
    ? `El ciudadano presenta el estado: ${estadoLabel}. Se recomienda proceder con cautela.`
    : `El ciudadano figura con estado: ${estadoLabel}.`;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.modalView}>

            {/* Encabezado de Estado Judicial */}
            <View style={[styles.statusHeader, { backgroundColor: estadoColor }]}>
                {statusIcon}
                <Text style={styles.statusHeaderText}>{statusTitle}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Información del Ciudadano (BD)</Text>

              {error ? (
                // Mostrar error si la consulta a la BD falló
                <View style={styles.errorContainer}>
                    <XCircle size={40} color="#D32F2F" />
                    <Text style={styles.errorText}>Error de Búsqueda: {error}</Text>
                </View>
              ) : (
                // Mostrar datos si la consulta fue exitosa
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre Completo:</Text>
                    <Text style={styles.infoValue}>{nombreCompleto.toUpperCase()}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Cédula (ID):</Text>
                    <Text style={styles.infoValue}>{cedulaFormateada}</Text>
                  </View>
                  
                  {/* Se muestran estos campos si vienen de la BD, aunque no son obligatorios en la interfaz */}
                  {ciudadano?.fecha_nacimiento && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Fecha Nacimiento:</Text>
                      <Text style={styles.infoValue}>{ciudadano.fecha_nacimiento}</Text>
                    </View>
                  )}
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estado Judicial (Raw):</Text>
                    <Text style={styles.infoValue}>{ciudadano?.estado_judicial || 'N/A'}</Text>
                  </View>
                </>
              )}
            </View>
            
            <View style={styles.statusMessageCard}>
                <Text style={styles.statusMessageText}>{statusMessage}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cerrar / Nueva Lectura</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    gap: 10,
    // El color de fondo se define dinámicamente
  },
  statusHeaderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    width: "100%",
    // Bordes suavizados para no chocar con el header
    borderBottomLeftRadius: 16, 
    borderBottomRightRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "400",
    color: "#424242",
  },
  statusMessageCard: {
      backgroundColor: '#F5F5F5',
      padding: 15,
      width: '100%',
      // borderTopWidth: 1,
      // borderTopColor: '#E0E0E0',
  },
  statusMessageText: {
    fontSize: 14,
    color: '#616161',
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    color: "#D32F2F"
  },
  button: {
    backgroundColor: "#388E3C",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "90%",
    maxWidth: 300,
    marginVertical: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
})

export default CiudadanoResultModal