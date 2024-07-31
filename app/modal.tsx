import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { View } from '@/components/Themed';
import { useAuth } from './context/AuthContext';
import EditScreenInfo from '@/components/EditScreenInfo';



export default function ModalScreen() {
  const { authState, onLogout } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://192.168.100.22:8002/api/user', {
          headers: {
            Authorization: `Bearer ${authState.token}`, // Asumiendo que tienes un token en authState
          },
        });
        setUserName(response.data.name); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (authState.token) {
      fetchUserData();
    }
  }, [authState.token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.userName}>{userName ? `Hola, ${userName} !` : 'Cargando...'}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button onPress={onLogout} title="Sign Out" color={"yellow"}/>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  userName: {
    fontSize: 18,
    marginVertical: 20,
    color:'white',
  },
});
