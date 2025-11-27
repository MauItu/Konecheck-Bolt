import type React from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native"
import { CheckCircle, XCircle, AlertTriangle, Database, UserX } from "lucide-react-native"

interface CiudadanoData {
  identificacion: string
  nombres: string
  apellidos: string
  estado_judicial: string
  origen_datos?: 'BASE_DE_DATOS' | 'LECTURA_FISICA'
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
  const judicial = ciudadano?.judicialStatus
  const isRequerido = judicial?.isRequired || false
  const isInDatabase = ciudadano?.origen_datos === 'BASE_DE_DATOS'

  let headerColor = "#607D8B"
  let headerIcon = <AlertTriangle size={36} color="white" />
  let headerTitle = "No Registrado"

  if (error) {
    headerColor = "#D32F2F"
    headerIcon = <XCircle size={36} color="white" />
    headerTitle = "Error"
  } else if (isRequerido) {
    headerColor = "#D32F2F" 
    headerIcon = <XCircle size={36} color="white" />
    headerTitle = "¡REQUERIDO!"
  } else if (isInDatabase) {
    headerColor = "#388E3C" 
    headerIcon = <CheckCircle size={36} color="white" />
    headerTitle = "Sin Novedad"
  } else {
    // Si no está en BD
    headerColor = "#78909C" 
    headerIcon = <UserX size={36} color="white" />
    headerTitle = "No Registrado"
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>

          {/* Header */}
          <View style={[styles.statusHeader, { backgroundColor: headerColor }]}>
              {headerIcon}
              <Text style={styles.statusHeaderText}>{headerTitle}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.contentContainer}>
            
            {error ? (
               <View style={styles.messageBox}>
                 <Text style={styles.errorText}>{error}</Text>
               </View>
            ) : (
              <>
                <View style={styles.badgeContainer}>
                   {isInDatabase ? (
                     <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
                        <Database size={14} color="#2E7D32" />
                        <Text style={[styles.badgeText, { color: '#2E7D32' }]}>Verificado en Base de Datos</Text>
                     </View>
                   ) : (
                     <View style={[styles.badge, { backgroundColor: '#ECEFF1' }]}>
                        <UserX size={14} color="#546E7A" />
                        <Text style={[styles.badgeText, { color: '#546E7A' }]}>Sin registro en BD</Text>
                     </View>
                   )}
                </View>

                <View style={styles.infoCard}>
                  
                  {/* 🔥 LÓGICA DE VISUALIZACIÓN DE ID */}
                  {isInDatabase ? (
                    <View style={styles.row}>
                      <Text style={styles.label}>Cédula Identificada:</Text>
                      <Text style={styles.valueLarge}>{ciudadano?.identificacion}</Text>
                    </View>
                  ) : (
                    <View style={styles.notFoundContainer}>
                      <Text style={styles.notFoundText}>
                        La identificación escaneada no se encuentra registrada en el sistema.
                      </Text>
                    </View>
                  )}

                  <View style={styles.divider} />

                  {isInDatabase && (
                    <>
                      <View style={styles.row}>
                        <Text style={styles.label}>Nombres:</Text>
                        <Text style={styles.value}>{ciudadano?.nombres}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Apellidos:</Text>
                        <Text style={styles.value}>{ciudadano?.apellidos}</Text>
                      </View>
                      <View style={styles.divider} />
                    </>
                  )}

                  {/* Estado Judicial (Solo si está en BD, o mensaje genérico si no) */}
                  {isInDatabase && (
                    <View style={[styles.statusBox, { backgroundColor: judicial?.color || '#eee' }]}>
                        <Text style={styles.statusLabel}>ESTADO JUDICIAL</Text>
                        <Text style={styles.statusValue}>{judicial?.label}</Text>
                    </View>
                  )}
                </View>
              </>
            )}

            <TouchableOpacity style={[styles.button, { backgroundColor: headerColor }]} onPress={onClose}>
              <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalView: { width: "90%", maxWidth: 380, backgroundColor: "white", borderRadius: 16, overflow: 'hidden', maxHeight: '85%' },
  statusHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  statusHeaderText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  contentContainer: { padding: 20 },
  badgeContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  infoCard: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6' },
  row: { marginBottom: 12 },
  label: { fontSize: 12, color: '#78909C', fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  value: { fontSize: 16, color: '#263238', fontWeight: '500' },
  valueLarge: { fontSize: 32, color: '#263238', fontWeight: 'bold', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 12 },
  statusBox: { marginTop: 8, padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statusLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  statusValue: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  
  notFoundContainer: { padding: 10, alignItems: 'center' },
  notFoundText: { color: '#546E7A', fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
  
  messageBox: { padding: 20, alignItems: 'center' },
  errorText: { color: '#D32F2F', fontSize: 16, textAlign: 'center', fontWeight: '500' },
  button: { marginTop: 24, padding: 16, borderRadius: 10, alignItems: 'center', elevation: 2 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
})

export default CiudadanoResultModal