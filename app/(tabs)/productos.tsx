import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Modal, TouchableWithoutFeedback } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import InfiniteScrollAnimation from '@/components/InfiniteScrollAnimation';
import SearchBar from '@/components/SearchBar';
import { useCart } from '@/app/context/CartContext'; // Importa el contexto
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  disponible: boolean;
  categoria_id: number;
};

export default function Productos() {
  const { addToCart } = useCart(); // Usa el hook del contexto
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const productosPorPagina = 5;

  const fetchProductos = async (page: number) => {
    try {
      const response = await fetch(`http://192.168.100.22:8002/api/productos?per_page=${productosPorPagina}&page=${page}`);
      const data = await response.json();
      if (data.length > 0) {
        const nuevosProductos = data.filter((producto: Producto) => 
          !productos.some((p) => p.id === producto.id)
        );
        setProductos(prev => [...prev, ...nuevosProductos]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos(page);
  }, []);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom && hasMore && !loading) {
      setLoading(true);
      fetchProductos(page);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      fetchProductos(page);
    }
  };

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productosPaginados = filteredProductos.slice(0, page * productosPorPagina);

  const openModal = (producto: Producto) => {
    setSelectedProduct(producto);
    setCantidad(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
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
    if (selectedProduct) {
      const productoConCantidad = { ...selectedProduct, cantidad }; // Añade la cantidad al producto
      addToCart(productoConCantidad, productoConCantidad.cantidad); // Proporciona tanto el producto como la cantidad
    }
    closeModal();
  };

  if (loading && productos.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="yellow" style={styles.centered} />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<InfiniteScrollAnimation />}
    >
      <SearchBar value={searchTerm} onChangeText={handleSearch} />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Nuestros Productos</ThemedText>
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <View style={styles.container}>
          {productosPaginados.length > 0 ? (
            <View style={styles.imagesContainer}>
              {productosPaginados.map((producto) => (
                <TouchableOpacity
                  key={producto.id.toString()} // Aquí nos aseguramos de que el id es único
                  style={styles.productContainer}
                  onPress={() => openModal(producto)}
                >
                  {producto.imagen ? (
                    <Image
                      source={{ uri: producto.imagen }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imagePlaceholderText}>No Image</Text>
                    </View>
                  )}
                  <View style={styles.productTextContainer}>
                    <Text style={styles.productName}>{producto.nombre}</Text>
                    <Text style={styles.productPrice}>${producto.precio.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text>No hay productos disponibles.</Text>
          )}

          {loading && productosPaginados.length > 0 && (
            <ActivityIndicator size="large" color="yellow" />
          )}

          {!loading && hasMore && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
            >
              <Text style={styles.loadMoreButtonText}>Ver más</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedProduct}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            {selectedProduct && (
              <View style={styles.modalContent}>
                {selectedProduct.imagen ? (
                  <Image
                    source={{ uri: selectedProduct.imagen }}
                    style={styles.modalImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>No Image</Text>
                  </View>
                )}
                <Text style={styles.modalProductName}>{selectedProduct.nombre}</Text>
                <Text style={styles.modalProductPrice}>${selectedProduct.precio.toFixed(2)}</Text>
                
                <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decrementarCantidad} style={styles.quantityButton}>
                      <MaterialCommunityIcons name="minus-circle-outline" size={24} color="rgba(221, 221, 221, 0.986)" />
                    </TouchableOpacity>
                  <Text style={styles.quantityText}>{cantidad}</Text>
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
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  centered: {

    alignItems: 'center'
  },
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
  loadMoreButton: {
    backgroundColor: 'rgb(18, 18, 18)', // Fondo oscuro
    borderRadius: 13, // Bordes redondeados
    paddingVertical: 6, // Espaciado vertical
    paddingHorizontal: 2, // Espaciado horizontal
    alignItems: 'center', // Alineación central
    justifyContent: 'center', // Alineación central
    width: 128, // Ancho del botón
    shadowColor: 'yellow', // Color de sombra
    shadowOffset: { width: 0.1, height: -0.2 }, // Desplazamiento de sombra
    shadowOpacity: 0.5, // Opacidad de sombra
    shadowRadius: 0.7, // Radio de la sombra
    elevation: 5, // Elevación para Android
    alignSelf: 'center', // Centrar el botón horizontalmente
  },
  loadMoreButtonText: {
    color: 'rgb(233, 241, 78)', // Texto blanco
    fontSize: 16, // Tamaño de fuente
    fontWeight: '600', // Fuente en negrita
    textShadowColor: 'black', // Color de contorno de texto
    textShadowOffset: { width: -1, height: -1 }, // Desplazamiento del contorno de texto
    textShadowRadius: 3, // Radio de contorno de texto
  },
  container: {
    backgroundColor: '#0000',
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 9,
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 9,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  imagePlaceholderText: {
    color: 'white',
  },
  productTextContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productContainer: {
    width: '48%',
    marginBottom: 16,
  },
  productName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 12,
    color: 'rgb(216, 216, 216)',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalProductName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  modalProductPrice: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 20,
  },
  quantityText: {
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
});

function setModalVisible(arg0: boolean) {
  throw new Error('Function not implemented.');
}
