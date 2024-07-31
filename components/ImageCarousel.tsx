import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Image, StyleSheet, Dimensions, Text, Platform, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { useCart } from '@/app/context/CartContext'; // Importa el contexto
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponible: boolean;
  categoria_id: number;
  created_at: string;
  updated_at: string;
}

const categorias = [
  { title: 'Cafes', imagen: require('@/assets/images/icono_cafe.png'), categoria: 'Cafe' },
  { title: 'Donas', imagen: require('@/assets/images/icono_dona.png'), categoria: 'Donas' },
  { title: 'Galletas', imagen: require('@/assets/images/icono_galletas.png'), categoria: 'Galletas' },
  { title: 'Hamburguesas', imagen: require('@/assets/images/icono_hamburguesa.png'), categoria: 'Hamburguesas' },
  { title: 'Pastel', imagen: require('@/assets/images/icono_pastel.png'), categoria: 'Pasteles' },
  { title: 'Pizzas', imagen: require('@/assets/images/icono_pizza.png'), categoria: 'Pizzas' },
];

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Cafe');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const productosScrollViewRef = useRef<ScrollView>(null);
  const { addToCart } = useCart(); // Usa el hook del contexto

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`http://192.168.100.22:8002/api/categorias/${categoriaSeleccionada.toLowerCase()}`);
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchProductos();
  }, [categoriaSeleccionada]);

  const onScrollProductos = (event: { nativeEvent: { layoutMeasurement: { width: any; }; contentOffset: { x: any; }; }; }) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    let index = Math.floor(contentOffsetX / slideSize);
    if (index >= productos.length) {
      index = 0;
    } else if (index < 0) {
      index = productos.length - 1;
    }
    setActiveIndex(index);
  };

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number }; contentSize: { width: number }; layoutMeasurement: { width: number }; }; }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    if (contentOffsetX >= contentWidth - layoutWidth) {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, animated: true });
      }
    } else if (contentOffsetX <= 0) {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  const openModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProducto(null);
    setCantidad(1);
  };

  const incrementarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };



  const agregarAlCarrito = () => {
    if (selectedProducto) {
      const productoConCantidad = { ...selectedProducto, cantidad }; // Añade la cantidad al producto
      addToCart(productoConCantidad, productoConCantidad.cantidad); // Proporciona tanto el producto como la cantidad
    }
    closeModal();
  };

  return (
    <ScrollView>
      <View style={styles.carouselContainer}>
      <ScrollView
        ref={productosScrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScrollProductos}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
          {productos.map((producto) => (
            <TouchableOpacity key={producto.id.toString()} style={styles.productSlide} onPress={() => openModal(producto)}>
              <Image source={{ uri: producto.imagen }} style={styles.productImage} resizeMode="cover" />
              <View style={styles.productTextContainer}>
                <Text style={styles.productTitle}>{producto.nombre}</Text>
                <Text style={styles.productDescription}>${producto.precio.toFixed(2)}</Text>
                <Text style={styles.productDescription}>Disponible: {producto.disponible ? 'Sí' : 'No'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.dotsContainer}>
          {productos.map((_, index) => (
            <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
          ))}
        </View>
      </View>

      <View style={styles.catalogContainer}>
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
              scrollViewRef.current.scrollTo({ x: 0, animated: false });
            }
          }}
        >
          {categorias.map((categoria, index) => (
            <TouchableOpacity key={index} style={styles.slide} onPress={() => setCategoriaSeleccionada(categoria.categoria)}>
              <Image source={categoria.imagen} style={styles.image} resizeMode="cover" />
              <View style={styles.textContainer}>
                <Text style={styles.gameTitle}>{categoria.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedProducto}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProducto && (
              <>
                <Image
                  source={{ uri: selectedProducto.imagen }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalProductName}>{selectedProducto.nombre}</Text>
                <Text style={styles.modalProductPrice}>${selectedProducto.precio.toFixed(2)}</Text>
                <Text style={styles.modalProductAvailability}>Disponible: {selectedProducto.disponible ? 'Sí' : 'No'}</Text>
                <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decrementarCantidad} style={styles.quantityButton}>
                      <MaterialCommunityIcons name="minus-circle-outline" size={24} color="rgba(221, 221, 221, 0.986)" />
                    </TouchableOpacity>
                  <Text style={styles.modalInput}>{cantidad}</Text>
                  <TouchableOpacity onPress={incrementarCantidad} style={styles.quantityButton}>
                      <MaterialCommunityIcons name="plus-circle-outline" size={24} color="rgba(221, 221, 221, 0.986)" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={agregarAlCarrito}
                >
                  <Text style={styles.addToCartButtonText}>Añadir al carrito</Text>
                </TouchableOpacity>
                <Button title="Cerrar" onPress={closeModal} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addToCartButton: {
    backgroundColor: 'rgb(18, 18, 18)', // Fondo oscuro
    borderRadius: 13, // Bordes redondeados
    paddingVertical: 6, // Espaciado vertical
    paddingHorizontal: 12, // Espaciado horizontal
    alignItems: 'center', // Alineación central
    justifyContent: 'center', // Alineación central
    marginTop: 10, // Margen superior
    shadowColor: 'yellow', // Color de sombra
    shadowOffset: { width: 0.1, height: -0.2 }, // Desplazamiento de sombra
    shadowOpacity: 0.5, // Opacidad de sombra
    shadowRadius: 0.7, // Radio de la sombra
    elevation: 5, // Elevación para Android
  },
  addToCartButtonText: {
    color: 'rgb(233, 241, 78)', // Texto blanco
    fontSize: 15, // Tamaño de fuente
    fontWeight: '500', // Fuente en negrita
    textShadowColor: 'black', // Color de contorno de texto
    textShadowOffset: { width: -1, height: 1 }, // Desplazamiento del contorno de texto
    textShadowRadius: 3, // Radio del contorno de texto
  },
  catalogContainer: {
    flex: 1,
    backgroundColor: 'rgb(29, 29, 29)',
    marginTop: 30,
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
    marginHorizontal: Platform.OS === 'android' ? 0 : 129,
    paddingHorizontal: Platform.OS === 'android' ? 129 : 0,
  },
  slide: {
    width: Platform.OS === 'android' ? 390 - 38 : 400 - 38, 
    marginHorizontal: Platform.OS === 'android' ? -125 : -125,
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
  carouselContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: width,
    marginBottom: 10,
  },
  productSlide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%',
    left: -130,
    height: 380,
    borderRadius: 16,
  },
  productTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: -80,
    width: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  productTitle: {
    padding: 3,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  productDescription: {
    padding: 3,
    fontSize: 9,
    color: '#fff',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bbb',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'yellow',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgb(22, 22, 22)',
    borderRadius: 10,
    padding: 29,
    alignItems: 'center',
    width: '80%',
    shadowColor: 'yellow', // Color de sombra
    shadowOffset: { width: 0.1, height: -0.2 }, // Desplazamiento de sombra
    shadowOpacity: 0.4, // Opacidad de sombra
    shadowRadius: 2.4, // Radio de la sombra
  },
  modalImage: {
    width: '60%',
    height: 240,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  modalProductPrice: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  quantityButton: {
    marginHorizontal: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: 60,
    textAlign: 'center',
    paddingVertical: 5,
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
  },
  modalProductAvailability: {
    fontSize: 14,
    marginBottom: 20,
    color: 'white',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: 'white',
  },
});

export default ImageCarousel;
