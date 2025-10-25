import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { List } from 'lucide-react-native';

export default function ManualCedulaScreen() {
  const [cedula, setCedula] = useState('');

  const handleSubmit = () => {
    const cleaned = cedula.trim();
    if (!/^\d{6,10}$/.test(cleaned)) {
      Alert.alert('Número inválido', 'Ingrese un número de cédula válido (solo dígitos, 6-10 caracteres).');
      return;
    }
    // Aquí iría la lógica de búsqueda/consulta con la cédula
    Alert.alert('Cédula enviada', `Cédula: ${cleaned}`);
    setCedula('');
  };

  return (
    <View style={styles.container}>
      <List size={60} color="#666" />
      <Text style={styles.title}>Ingreso manual de cédula</Text>
      <Text style={styles.message}>Ingrese el número de cédula para buscar manualmente</Text>

      <TextInput
        style={styles.input}
        placeholder="Número de cédula"
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
        maxLength={10}
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
