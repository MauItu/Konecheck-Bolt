import { View, Text, StyleSheet } from 'react-native';
import { List } from 'lucide-react-native';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <List size={60} color="#666" />
      <Text style={styles.title}>Historial de Escaneos</Text>
      <Text style={styles.message}>
        Los códigos escaneados aparecerán aquí
      </Text>
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
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
