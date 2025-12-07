// src/hooks/useNotificaciones.js
import { useEffect, useState } from "react";
import {
  fetchNotificaciones,
  marcarNotificacionLeida,
} from "../services/notificacionesService";

export default function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarNotificaciones = async () => {
    try {
      const res = await fetchNotificaciones();
      setNotificaciones(res.data);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNotificaciones();

    // polling cada 10s
    const interval = setInterval(cargarNotificaciones, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    notificaciones,
    loading,
    recargar: cargarNotificaciones,
    marcarNotificacionLeida,
  };
}
