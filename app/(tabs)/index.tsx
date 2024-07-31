import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Image, ActivityIndicator } from 'react-native';

// Importar componentes específicos necesarios
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import ImageCarousel from '@/components/ImageCarousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simular la carga de datos
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Cambia el tiempo según sea necesario
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="yellow" style={styles.centered} />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '', dark: 'rgb(0, 12, 60' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.customTitle}>
          ¿Qué se te antoja?
        </ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.subtitle} type="subtitle">Paso 1: Elige un producto</ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">Paso 2: Ordenalo</ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">Paso 3: Pruébalo</ThemedText>
        <ThemedText style={styles.subtitle}>
          Descubre nuestras recetas y productos alimenticios. Explora y encuentra lo que más te guste.
        </ThemedText>
      </ThemedView>

      {/* Insertar ImageCarousel */}
      <ImageCarousel />

      {/* Estructura de la tarjeta estilo Bootstrap */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerContent}>
              <Image
                source={require('@/assets/images/kukultech-logo.png')}
                style={styles.cardImage}
              />
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Acerca de nuestro equipo</Text>
            <Text style={styles.cardText}>
              Descubre más sobre nuestro equipo y lo que hacemos.
            </Text>
            {/* Botón */}
            <View style={styles.buttonContainer}>
              <Text style={styles.button}>Conocenos</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>
              {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {

    alignItems: 'center'
  },
  container: {
    backgroundColor: '#0000',
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parallaxContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 220,
    bottom: 9,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customTitle: {
    fontSize: 28, // Ajusta este valor según el tamaño deseado
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 2,
  },
  stepContainer: {
    gap: 10,
    padding: 17,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgb(243, 239, 121)',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgb(0, 12, 60',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  stepText: {
    fontSize: 8,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: 'bold',
  },
  // Estilos para la tarjeta Bootstrap simulada en React Native
  cardContainer: {
    marginTop: 26,
    paddingHorizontal: 0,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgb(36, 36, 36)',
  },
  cardHeader: {
    backgroundColor: 'rgb(29, 29, 29)',
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center', // Alinear elementos al centro
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  cardText: {
    fontSize: 8,
    marginBottom: 10,
    color: '#fff',
  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgb(29, 29, 29)',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  cardImage: {
    width: 100,
    height: 20,
    marginRight: 8,
  },
  button: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 8,
    backgroundColor: 'rgb(34, 33, 33)',
  },
  cardFooterText: {
    color: '#6c757d',
    textAlign: 'center',
    fontSize: 14,
  },
});