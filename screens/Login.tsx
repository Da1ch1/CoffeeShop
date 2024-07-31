import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../app/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importa MaterialCommunityIcons

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const { onLogin, onRegister } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const result = await onLogin!(email, password);
    if (result && result.error) {
      alert(result.msg);
    } else {
      router.replace('/app/index'); // Navega a la página principal después de iniciar sesión
    }
  };

  const handleRegister = async () => {
    const result = await onRegister!(email, password);
    if (result && result.error) {
      alert(result.msg);
    } else {
      handleLogin();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')} // Asegúrate de que la ruta de la imagen es correcta
        style={styles.logo}
      />
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Inicio</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.passwordLabelContainer}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Olvide mi contraseña?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(prev => !prev)}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="#1f2937"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Inicio</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          No soy miembro?{' '}
          <Text onPress={handleRegister} style={styles.footerLink}>
            Contrata Premium
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 1,
  },
  logo: {
    width: 150, // Ajusta el ancho según sea necesario
    height: 130, // Ajusta la altura según sea necesario
    alignSelf: 'center',
    marginBottom: 20, // Espacio debajo del logo
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  formContainer: {
    marginTop: 5,
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  input: {
    marginTop: 8,
    width: '98%', // Ajusta el ancho según sea necesario
    height: 40,
    borderRadius: 13,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: '#d1d5db',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    fontSize: 14,
    color: '#1f2937',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginTop: 7,
  },
  passwordInput: {
    width: '100%', // Asegúrate de que el input ocupe todo el espacio disponible
    height: 40,
    borderRadius: 13,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: '#d1d5db',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    fontSize: 14,
    color: '#1f2937',
  },
  eyeIcon: {
    position: 'absolute',
    right: 13,
  },
  passwordLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: 12,
    fontWeight: '600',
    color: 'yellow',
  },
  button: {
    marginTop: 24,
    width: '70%',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'yellow',
  },
  footerText: {
    marginTop: 24,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  footerLink: {
    fontWeight: '600',
    color: 'yellow',
  },
});
