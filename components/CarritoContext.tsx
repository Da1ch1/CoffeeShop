import React, { createContext, useState, ReactNode } from 'react';

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  disponible: boolean;
  categoria_id: number;
  cantidad?: number;
};

type CarritoContextType = {
  pedidos: Producto[];
  total: number;
  agregarAlCarrito: (producto: Producto, cantidad: number) => void;
  editarPedido: (pedidoEdit: Producto) => void;
  eliminarProducto: (id: number) => void;
  confirmPedido: () => void;
  isPedidoEmpty: () => boolean;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);

  const calTotal = () => {
    const nuevoTotal = pedidos.reduce((total, pedido) => total + (pedido.precio * (pedido.cantidad || 1)), 0);
    setTotal(nuevoTotal);
  };

  const agregarAlCarrito = (producto: Producto, cantidad: number) => {
    setPedidos(prev => {
      const index = prev.findIndex(p => p.id === producto.id);
      if (index !== -1) {
        // Producto ya está en el carrito, actualiza la cantidad
        const updatedPedidos = [...prev];
        updatedPedidos[index].cantidad = (updatedPedidos[index].cantidad || 0) + cantidad;
        calTotal();
        return updatedPedidos;
      } else {
        // Agrega nuevo producto
        const nuevoPedido = { ...producto, cantidad };
        calTotal();
        return [...prev, nuevoPedido];
      }
    });
  };

  const editarPedido = (pedidoEdit: Producto) => {
    setPedidos(prev => {
      const index = prev.findIndex(p => p.id === pedidoEdit.id);
      if (index !== -1) {
        const updatedPedidos = [...prev];
        updatedPedidos[index].cantidad = pedidoEdit.cantidad;
        calTotal();
        return updatedPedidos;
      }
      return prev;
    });
  };

  const eliminarProducto = (id: number) => {
    setPedidos(prev => {
      const updatedPedidos = prev.filter(p => p.id !== id);
      calTotal();
      return updatedPedidos;
    });
  };

  const confirmPedido = () => {
    // Aquí puedes implementar la lógica para enviar los pedidos a un servidor
    console.log("Confirmando pedido:", pedidos);
    setPedidos([]);
    setTotal(0);
  };

  const isPedidoEmpty = () => pedidos.length === 0;

  return (
    <CarritoContext.Provider value={{ pedidos, total, agregarAlCarrito, editarPedido, eliminarProducto, confirmPedido, isPedidoEmpty }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = React.useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};
