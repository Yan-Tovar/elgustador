// pages/admin/AdminPedidos.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  CircularProgress,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import SnackbarAlert from "../../../components/feedback/SnackbarAlert";
import {
  fetchPedidosUsuario,
  fetchPedidosEmpleados,
  fetchPedidosTodos,
  actualizarEstadoPedido,
} from "../../../services/pedidosService";

const ESTADOS = [
  "pendiente",
  "procesando",
  "pagado",
  "enviado",
  "entregado",
  "cancelado",
];

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [vista, setVista] = useState("usuario"); // usuario | empleado | admin

  // Función para cargar pedidos según la vista
  const loadPedidos = async (tipo) => {
    setLoading(true);
    try {
      let data = [];
      if (tipo === "usuario") {
        data = await fetchPedidosUsuario(); // API devuelve array
      } else if (tipo === "empleado") {
        data = await fetchPedidosEmpleados();
      } else if (tipo === "admin") {
        data = await fetchPedidosTodos();
      }
      // Asegurar que siempre sea un array
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Error cargando pedidos", severity: "error" });
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos(vista);
  }, [vista]);

  const handleChangeEstado = async (pedidoId, nuevoEstado) => {
    const confirm = await Swal.fire({
      title: "Confirmar cambio",
      text: `¿Deseas cambiar el estado del pedido a "${nuevoEstado}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const { data } = await actualizarEstadoPedido(pedidoId, nuevoEstado);
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoId ? { ...p, estado: data.estado } : p))
        );
        setSnackbar({ open: true, message: "Estado actualizado", severity: "success" });
      } catch (error) {
        console.error(error);
        setSnackbar({ open: true, message: "Error actualizando estado", severity: "error" });
      }
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Administración de Pedidos
        </Typography>

        {/* Botones para cambiar de vista */}
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Button
            variant={vista === "usuario" ? "contained" : "outlined"}
            onClick={() => setVista("usuario")}
          >
            Mis pedidos
          </Button>
          <Button
            variant={vista === "empleado" ? "contained" : "outlined"}
            onClick={() => setVista("empleado")}
          >
            Pedidos empleados
          </Button>
          <Button
            variant={vista === "admin" ? "contained" : "outlined"}
            onClick={() => setVista("admin")}
          >
            Todos los pedidos
          </Button>
        </Box>

        {pedidos.length === 0 ? (
          <Typography>No hay pedidos disponibles.</Typography>
        ) : (
          <Grid container spacing={3}>
            {pedidos.map((pedido) => (
              <Grid item xs={12} md={6} lg={4} key={pedido.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Pedido #{pedido.id}</Typography>
                    <Typography variant="body2">
                      Usuario: {pedido.usuario?.email || "Desconocido"}
                    </Typography>
                    <Typography variant="body2">Total: ${pedido.total || 0}</Typography>
                    <Typography variant="body2" mt={1}>
                      Estado:
                    </Typography>
                    <Select
                      value={pedido.estado || "pendiente"}
                      onChange={(e) => handleChangeEstado(pedido.id, e.target.value)}
                      fullWidth
                      size="small"
                    >
                      {ESTADOS.map((estado) => (
                        <MenuItem value={estado} key={estado}>
                          {estado}
                        </MenuItem>
                      ))}
                    </Select>

                    <Box mt={2}>
                      <Typography variant="subtitle2">Detalles:</Typography>
                      <ul>
                        {Array.isArray(pedido.detalles) && pedido.detalles.length > 0 ? (
                          pedido.detalles.map((item) => (
                            <li key={item.id}>
                              {item.producto?.nombre || "Producto"} x {item.cantidad || 0} - $
                              {item.precio_total || 0}
                            </li>
                          ))
                        ) : (
                          <li>No hay detalles</li>
                        )}
                      </ul>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      /> */}
    </DashboardLayout>
  );
}
