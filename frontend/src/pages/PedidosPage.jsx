// src/pages/PedidosPage.jsx
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import DashboarLayout from "../components/layout/DashboardLayout";
import { fetchPedidosUsuario } from "../services/pedidosService";

import PedidosListado from "../components/common/pedidos/PedidosListado";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPedidos = async () => {
    try {
      const response = await fetchPedidosUsuario();
      setPedidos(response || []);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      alert("No se pudieron cargar los pedidos.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  if (loading) {
    return (
      <DashboarLayout>
        <Box p={4} textAlign="center">
          <CircularProgress />
        </Box>
      </DashboarLayout>
      
    );
  }

  return (
    <DashboarLayout>
      <Box p={4}>
        

        <PedidosListado pedidos={pedidos} />
      </Box>
    </DashboarLayout>
  );
}
