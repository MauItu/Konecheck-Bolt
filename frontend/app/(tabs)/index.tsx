import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LoginPage() {
  const [identification, setIdentification] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = () => {
    console.log('Intentando iniciar sesión con:', identification, password);
    //router.push('/scanner');
  };

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
              style={[
                styles.input,
                focusedField === 'identification' && styles.inputFocused
              ]}
              onFocus={() => setFocusedField('identification')}
              onBlur={() => setFocusedField(null)}
              onChangeText={setIdentification}
              value={identification}
              placeholder="Ingrese su identificación"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'password' && styles.inputFocused
              ]}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              onChangeText={setPassword}
              value={password}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>INGRESAR</Text>
          </TouchableOpacity>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              🛡️ Sistema exclusivo para Personal de la Fuerza Pública
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#388e3c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  backgroundBubble1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ scale: 1.2 }],
  },
  backgroundBubble2: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ scale: 1.2 }],
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#388e3c',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#388e3c',
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
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputFocused: {
    borderColor: '#388e3c',
    backgroundColor: '#F0F9F0',
  },
  button: {
    backgroundColor: '#388e3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#388e3c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerContainer: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});