import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

import DashboarLayout from "../components/layout/DashboardLayout"
import { fetchPedidosUsuario } from "../services/pedidosService";

export default function PedidosPage() {
  const navigate = useNavigate();

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
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando pedidos...</Typography>
      </Box>
    );
  }

  return (
    <DashboarLayout>
      <Box p={4}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Mis Pedidos
        </Typography>

        {pedidos.length === 0 ? (
          <Typography>No tienes pedidos registrados aún.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.id}</TableCell>
                    <TableCell>${pedido.total}</TableCell>
                    <TableCell>{pedido.estado}</TableCell>
                    <TableCell>
                      {new Date(pedido.fecha).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/pedidos/${pedido.id}`)}
                      >
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </DashboarLayout>
  );
}
