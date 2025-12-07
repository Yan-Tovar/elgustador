import { createContext, useEffect, useState } from "react";
import { fetchCarrito } from "../services/carritoService";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCarrito = async () => {
    try {
      const { data } = await fetchCarrito();
      setCarrito(data || []);
    } catch (error) {
      console.error("Error cargando carrito", error);
    } finally {
      setLoading(false);
    }
  };

  // Inicialmente cargar carrito
  useEffect(() => {
    loadCarrito();
  }, []);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        setCarrito,
        loadCarrito,
        loading,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
