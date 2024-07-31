import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const gamesData = [
  {
    title: 'Cafes',
    imageUrl: require('@/assets/images/icono_cafe.png'),
    local: true,
  },
  {
    title: 'Donas',
    imageUrl: require('@/assets/images/icono_dona.png'),
    local: true,
  },
  {
    title: 'Galletas',
    imageUrl: require('@/assets/images/icono_galletas.png'),
    local: true,
  },
  {
    title: 'Hamburguesas',
    imageUrl: require('@/assets/images/icono_hamburguesa.png'),
    local: true,
  },
  {
    title: 'Pastel',
    imageUrl: require('@/assets/images/icono_pastel.png'),
    local: true,
  },
  {
    title: 'Pizzas',
    imageUrl: require('@/assets/images/icono_pizza.png'),
    local: true,
  },

];

// Clona la primera imagen y la agrega al final del array de datos
const gamesDataWithLoop = [...gamesData, gamesData[0]];

const Catalago = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number }; contentSize: { width: number }; layoutMeasurement: { width: number }; }; }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    if (contentOffsetX >= contentWidth - layoutWidth) {
      // Si el usuario llega al final del ScrollView, lo redirige al principio
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, animated: true });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conoce nuestro catálogo</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScrollEndDrag={handleScroll}
        scrollEventThrottle={6}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            // Inicializa el scroll al principio
            scrollViewRef.current.scrollTo({ x: 0, animated: false });
          }
        }}
      >
        {gamesDataWithLoop.map((game, index) => (
          <View key={index} style={styles.slide}>
            <Image source={game.local ? game.imageUrl : { uri: game.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.gameTitle}>{game.title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(29, 29, 29)',
    padding: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: -1,
  },
  scrollViewContent: {
    alignItems: 'center',
    marginHorizontal:Platform.OS === 'android' ? 0 : 129,
    paddingHorizontal:Platform.OS === 'android' ? 129 : 0,
  },
  slide: {
    width:Platform.OS === 'android' ? 390 - 38 : 400 - 38, 
    marginHorizontal: Platform.OS === 'android'  ? -125 : -125,
    borderRadius: 10,
  },
  image: {
    margin: 10,
    marginTop: 19,
    width: '23%',
    height: 60,
    padding: 10,
    borderRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    width: 84,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    padding: 6,
    borderRadius: 10,
  },
  gameTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Catalago;
