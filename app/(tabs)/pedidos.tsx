import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, Button, Modal, TextInput, TouchableWithoutFeedback, ScrollView, ActivityIndicator } from 'react-native';
import { useCart } from '@/app/context/CartContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ColorList from '@/components/ColorList';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { useAuth } from '@/app/context/AuthContext';
interface Producto {
  id: number;
  nombre: string;
  imagen: string | null;
  precio: number;
  cantidad: number;
  disponible: boolean;
  categoria_id: number;
}

export default function Pedidos() {
  const { authState } = useAuth(); // Obtener el estado de autenticación
  const { cartItems, removeFromCart, addToCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [quantity, setQuantity] = useState('0');
  const [confirmationVisible, setConfirmationVisible] = useState(false); 
  const [loading, setLoading] = useState(false); 

  const calcularSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2);
  };

  const handleEditPress = (product: Producto) => {
    setSelectedProduct(product);
    setQuantity(product.cantidad.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (selectedProduct) {
      const newQuantity = parseInt(quantity, 10);
      if (newQuantity > 0) {
        const currentQuantity = selectedProduct.cantidad;
        if (newQuantity === 0) {
          removeFromCart(selectedProduct.id);
        } else if (newQuantity !== currentQuantity) {
          addToCart({ ...selectedProduct, cantidad: newQuantity }, newQuantity);
        }
      }
      setModalVisible(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => (parseInt(prev, 10) + 1).toString());
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (parseInt(prev, 10) > 1 ? (parseInt(prev, 10) - 1).toString() : '1'));
  };

  const handleDelete = () => {
    if (selectedProduct) {
      removeFromCart(selectedProduct.id);
      setModalVisible(false);
    }
  };

  const handleConfirmarpedido = async () => {
    // Verificar si el carrito está vacío
    if (cartItems.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de confirmar el pedido.');
      return;
    }
  
    setLoading(true);
    const productos = cartItems.map(item => ({
      id: item.id,
      cantidad: item.cantidad,
    }));
  
    const data = {
      productos: productos,
      total: parseFloat(calcularSubtotal()),
    };
  
    try {
      const response = await fetch('http://192.168.100.22:8002/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`, // Usa comillas invertidas para interpolar la variable
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      const result = await response.json();
      console.log('Pedido confirmado:', result);
      // Vaciar el carrito
      cartItems.forEach(item => removeFromCart(item.id));
      // Mostrar el modal de confirmación
      setConfirmationVisible(true);
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View>
        <ColorList color="#232323" />
      </View>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Carrito</ThemedText>
      </ThemedView>
      <ThemedText style={styles.infoText}>
        ¡Has añadido los siguientes productos a tu carrito! {'\n'} Revisa los detalles a continuación y confirma tu pedido para proceder al pago.
      </ThemedText>

      {/* Muestra la imagen si el carrito está vacío */}
      {cartItems.length === 0 && (
        <View style={styles.emptyCartContainer}>
          <Image
            source={require('@/assets/images/carrito.png')} // Ruta de la imagen carrito.png
            style={styles.emptyCartImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyCartText}>Tu carrito está vacío.</Text>
        </View>
      )}

      {cartItems.length > 0 && (
        <View style={styles.cartContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Fresh Coffee</Text>
          </View>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.productWrapper}>
              <View style={styles.productContent}>
                <Image
                  source={{ uri: item.imagen || '' }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.nombre}</Text>
                  <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
                  <Text style={styles.productQuantity}>Cantidad: {item.cantidad}</Text>
                  <TouchableOpacity onPress={() => handleEditPress(item)}>
                    <Text style={styles.removeButton}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.borderBottom} />
            </View>
          ))}
          <View style={styles.footer}>
            <Text style={styles.subtotal}>Total: ${calcularSubtotal()}</Text>
            <TouchableOpacity style={styles.submitButton} onPress={handleConfirmarpedido}>
              <Text style={styles.submitButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Producto</Text>
              {selectedProduct && (
                <>
                  {selectedProduct.imagen && (
                    <Image
                      source={{ uri: selectedProduct.imagen }}
                      style={styles.productImagemodal}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.modalProductName}>{selectedProduct.nombre}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                      <MaterialCommunityIcons name="minus-circle-outline" size={24} color="rgba(221, 221, 221, 0.986)" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.modalInput}
                      keyboardType="numeric"
                      value={quantity}
                      onChangeText={setQuantity}
                      textAlign="center"
                    />
                    <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                      <MaterialCommunityIcons name="plus-circle-outline" size={24} color="rgba(221, 221, 221, 0.986)" />
                    </TouchableOpacity>
                  </View>
                  <Button title="Guardar" color="white" onPress={handleSave} />
                  <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <MaterialCommunityIcons name="delete" size={24} color="rgba(187, 179, 66, 0.959)" />
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={confirmationVisible}
        onRequestClose={() => setConfirmationVisible(false)}
        animationType="fade"
      >
        <View style={styles.confirmationModalBackground}>
          <View style={styles.confirmationModalContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <>
                <Text style={styles.confirmationModalTitle}>¡Pedido Enviado!</Text>
                <Text style={styles.confirmationModalMessage}>Tu pedido ha sido confirmado con éxito.</Text>
                <TouchableOpacity onPress={() => setConfirmationVisible(false)} style={styles.confirmationButton}>
                  <Text style={styles.confirmationButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.Collapsible}>
      <Collapsible title="Elige tu forma de pago">
      <ThemedText>
        Puedes decidir tu formato de pago: <ThemedText type="defaultSemiBold">Efectivo</ThemedText> ó{' '}
        <ThemedText type="defaultSemiBold">Digital</ThemedText>.
      </ThemedText>
      <ThemedText>
        Tú decides! <ThemedText type="defaultSemiBold"></ThemedText> ahora tú tienes el control <ThemedText type="defaultSemiBold"></ThemedText> disfruta de nuestro servicio.
      </ThemedText>
      <ExternalLink href="https://docs.expo.dev/router/introduction">
        <ThemedText type="link">Descubre más</ThemedText>
      </ExternalLink>
    </Collapsible>
          <Collapsible title="Navegación en la aplicación">
      <ThemedText>
        Nuestra aplicación ofrece dos secciones principales: <ThemedText type="defaultSemiBold">Inicio</ThemedText> y{' '}
        <ThemedText type="defaultSemiBold">Menú</ThemedText>.
      </ThemedText>
      <ThemedText>
        La sección de <ThemedText type="defaultSemiBold">Inicio</ThemedText> te muestra la bienvenida y las últimas ofertas, mientras que el <ThemedText type="defaultSemiBold">Menú</ThemedText> te permite explorar nuestros platos y realizar pedidos.
      </ThemedText>
      <ExternalLink href="https://docs.expo.dev/router/introduction">
        <ThemedText type="link">Descubre más</ThemedText>
      </ExternalLink>
    </Collapsible>
    <Collapsible title="Compatibilidad con Android, iOS y web">
      <ThemedText>
        Puedes disfrutar de nuestra aplicación en Android, iOS y la web. Para acceder a la versión web, simplemente presiona{' '}
        <ThemedText type="defaultSemiBold">w</ThemedText> en la terminal donde se esté ejecutando el proyecto.
      </ThemedText>
    </Collapsible>
    <Collapsible title="Imágenes de productos">
      <ThemedText>
        Para garantizar la mejor experiencia visual, utilizamos imágenes en diferentes resoluciones. Si ves imágenes de alta calidad, como los platos de nuestro menú, estas están optimizadas para mostrar el mejor aspecto en tu dispositivo.
      </ThemedText>
      <Image
  source={require('@/assets/images/logo.png')}
  style={{ alignSelf: 'center', width: 130, height: 110 }}
/>
    </Collapsible>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
    width: '80%', // Adjust width as needed
    left: '11%',
    height: 200,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0.1,
    elevation: 5,
   
    borderWidth: 0.2,
  },
  emptyCartImage: {
    width: 100,
    height: 100,
  },
  emptyCartText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  infoText: {
    fontSize: 14,
    padding:15,
    color: '#344',
    marginBottom: 20,
    textAlign: 'center',
  },

  titleContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  cartContainer: {
    marginVertical: 20,
    width: 370,
    padding: 10,
    left:'7%',
    
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 5,
    
    borderWidth: 0.3,
  },
  Collapsible:{
    marginVertical: 1,
    width: '80%', // Adjust width as needed
    left: '11%',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderWidth: 0.5,
    marginTop: 50,
    marginBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  productWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  productContent: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  productDetails: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  productPrice: {
    fontSize: 16,
    color: 'rgba(193, 196, 196, 0.938)',
  },
  productQuantity: {
    fontSize: 15,
    color: '#888',
  },
  removeButton: {
    fontSize: 14,
    color: 'rgba(255, 253, 114, 0.904)',
  },
  footer: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#181818', // Fondo oscuro
    borderRadius: 13, // Bordes redondeados
    paddingVertical: 6, // Espaciado vertical
    paddingHorizontal: 25, // Espaciado horizontal
    alignItems: 'center', // Alineación central
    justifyContent: 'center', // Alineación central
    marginTop: 10, // Margen superior
    shadowColor: 'yellow', // Color de sombra
    shadowOffset: { width: 0.1, height: -0.2 }, // Desplazamiento de sombra
    shadowOpacity: 0.5, // Opacidad de sombra
    shadowRadius: 0.7, // Radio de la sombra
    elevation: 5, // Elevación para Android
  },
  submitButtonText: {
    color: 'rgb(233, 241, 78)', // Texto blanco
    fontSize: 15, // Tamaño de fuente
    fontWeight: '500', // Fuente en negrita
    textShadowColor: 'black', // Color de contorno de texto
    textShadowOffset: { width: -1, height: 1 }, // Desplazamiento del contorno de texto
    textShadowRadius: 3, // Radio del contorno de texto
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgb(22, 22, 22)',
    borderRadius: 10,
    padding: 50,
    alignItems: 'center',
    shadowColor: 'yellow', // Color de sombra
    shadowOffset: { width: 0.1, height: -0.2 }, // Desplazamiento de sombra
    shadowOpacity: 0.4, // Opacidad de sombra
    shadowRadius: 2.4, // Radio de la sombra
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  modalProductName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  deleteButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    marginLeft: 5,
    color: 'rgba(187, 179, 66, 0.959)',
  },
  productImagemodal: {
    width: 84,
    height: 104,
    borderRadius: 14,
    marginBottom: 12,
  },
  borderBottom: {
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(221, 221, 221, 0.2)', // Ajusta el color y el ancho del borde aquí
    marginVertical: 10,
    width: '69%',
    alignSelf: 'center',
  },

    // Nuevos estilos para el modal de confirmación
    confirmationModalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    confirmationModalContent: {
      width: '80%',
      padding: 35,
      borderRadius: 13,
      backgroundColor: '#444',
      alignItems: 'center',
    },
    confirmationModalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'white',
    },
    confirmationModalMessage: {
      fontSize: 13,
      marginBottom: 24,
      color: 'white',
    },
    confirmationButton: {
      backgroundColor: '#181818',
      padding: 10,
      borderRadius: 5,
    },
    confirmationButtonText: {
      color: 'rgb(233, 241, 78)',
      fontSize: 14,
    },
  });

