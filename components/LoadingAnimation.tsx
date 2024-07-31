import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const LoadingAnimation: React.FC = () => {
  const animatedValues: Animated.Value[] = [];

  // Crear valores animados para cada barra
  for (let i = 0; i < 8; i++) {
    animatedValues[i] = new Animated.Value(0); // Iniciar con un valor bajo
  }

  // Animación para las barras
  const barAnimations = () => {
    const animations = animatedValues.map((value, index) => (
      Animated.sequence([
        Animated.timing(value, {
          toValue: 0.8, // Valor medio para mantener las barras visibles
          duration: 750, // Duración de la animación
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(value, {
          toValue: 0.3, // Volver al valor inicial para parpadear
          duration: 950, // Duración de la animación de parpadeo
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ])
    ));
    Animated.stagger(45, animations).start(); // Iniciar animaciones en secuencia sin reiniciar
  };

  useEffect(() => {
    barAnimations();
  }, []);

  return (
    <View style={styles.container}>
      {/* Contenedor para las barras */}
      <View style={styles.barsContainer}>
        {/* Renderizar las barras */}
        {animatedValues.map((value, index) => (
          <Animated.View
            key={index}
            style={[
              styles.blockG,
              {
                transform: [
                  { rotate: `${45 * index}deg` },
                  { translateY: -15 }, // Ajustar la posición vertical de las barras si es necesario
                  { scale: value }
                ]
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barsContainer: {
    width: 100,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockG: {
    width: 6,
    height: 18,
    backgroundColor: 'yellow',
    borderRadius: 3,
    position: 'absolute',
    transformOrigin: 'bottom center',
  },
});

export default LoadingAnimation;