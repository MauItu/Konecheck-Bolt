import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from "react-native"
import { CheckCircle, XCircle, User } from "lucide-react-native"

// Nueva interfaz para datos PARSEADOS localmente
interface CiudadanoData {
  identificacion: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string
  lugar_nacimiento: string
  rh: string
  tipo_documento: string
  parsingSuccess: boolean
}

interface CiudadanoResultModalProps {
  visible: boolean
  ciudadano: CiudadanoData | null
  // Ya no necesitamos 'error', el fallo de parsing es manejado en 'ciudadano'
  onClose: () => void
}

const CiudadanoResultModal: React.FC<CiudadanoResultModalProps> = ({ visible, ciudadano, onClose }) => {
  
  // Comprobación para el caso de fallo total
  const parsingFailed = !ciudadano || !ciudadano.parsingSuccess

  const nombreCompleto = ciudadano ? `${ciudadano.nombres} ${ciudadano.apellidos}` : "DATOS NO ENCONTRADOS"
  const cedulaFormateada = ciudadano?.identificacion || "N/A"

  // Estilos y labels basados en el resultado del parsing
  const statusColor = parsingFailed ? "#D32F2F" : "#388E3C"
  const statusLabel = parsingFailed ? "FALLO DE LECTURA" : "LECTURA EXITOSA"
  const mensajeEstado = parsingFailed 
    ? "No se pudo extraer toda la información del documento. Intente de nuevo o verifique la iluminación."
    : "Información extraída directamente del código de barras (PDF417)."

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.modalView}>

            <Text style={styles.mainTitle}>{statusLabel}</Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Datos del Documento ({ciudadano?.tipo_documento || 'PDF417'})</Text>

              {parsingFailed ? (
                // Mostrar error si el parsing falló
                <View style={styles.errorContainer}>
                    <XCircle size={40} color={statusColor} />
                    <Text style={[styles.errorText, { color: statusColor }]}>{mensajeEstado}</Text>
                </View>
              ) : (
                // Mostrar datos si el parsing fue exitoso
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre Completo:</Text>
                    <Text style={styles.infoValue}>{nombreCompleto.toUpperCase()}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Cédula (ID):</Text>
                    <Text style={styles.infoValue}>{cedulaFormateada}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha Nacimiento:</Text>
                    <Text style={styles.infoValue}>{ciudadano.fecha_nacimiento}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Lugar Nacimiento:</Text>
                    <Text style={styles.infoValue}>{ciudadano.lugar_nacimiento}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>RH:</Text>
                    <Text style={styles.infoValue}>{ciudadano.rh}</Text>
                  </View>

                  <View style={styles.statusContainer}>
                    <CheckCircle size={24} color={statusColor} strokeWidth={2.5} fill={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>Datos Extraídos Localmente</Text>
                  </View>
                  <Text style={styles.statusMessage}>{mensajeEstado}</Text>
                </>
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Nueva Lectura</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50", // Cambio de color para resaltar
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
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
    paddingTop: 5,
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