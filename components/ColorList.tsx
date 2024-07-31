import { View, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import TypingDemo from './TypingDemo'; // Asegúrate de que la ruta sea correcta

// Define el tipo de las propiedades del componente
interface ColorListProps {
  color: string; // Define que 'color' debe ser una cadena
}

const ColorList: React.FC<ColorListProps> = ({ color }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.color, { backgroundColor: color }]}>
        <TypingDemo text="Nuestros clientes nos aman. ¡Descubre por qué!" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  color: {
    width: '95%',
    left:'2.5%',
    height: 150,
    borderRadius: 25, // Corregido de borderCurve a borderRadius
    marginBottom: 15,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    padding: 10, // Espacio interno para que el texto no toque los bordes
  },
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default ColorList;
