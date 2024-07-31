// CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Producto = {
    id: number;
    nombre: string;
    precio: number;
    imagen: string | null;
    disponible: boolean;
    categoria_id: number;
    cantidad: number; // Asegúrate de que esta propiedad esté incluida
  };

type CartContextType = {
  cartItems: Producto[];
  addToCart: (product: Producto, quantity: number) => void;
  removeFromCart: (productId: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Producto[]>([]);

  const addToCart = (product: Producto, quantity: number) => {
    // Primero verifica si el producto ya está en el carrito
    const existingProduct = cartItems.find(item => item.id === product.id);
  
    if (existingProduct) {
      // Si el producto ya está en el carrito, actualiza su cantidad
      const updatedCartItems = cartItems.map(item =>
        item.id === product.id
          ? { ...item, cantidad: quantity }
          : item
      );
      // Actualiza el estado del carrito
      setCartItems(updatedCartItems);
    } else {
      // Si el producto no está en el carrito, añádelo
      setCartItems([...cartItems, { ...product, cantidad: quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
