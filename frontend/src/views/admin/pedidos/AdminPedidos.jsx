// pages/admin/AdminPedidos.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  useTheme,
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
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [vista, setVista] = useState("usuario"); // usuario | empleado | admin
  const theme = useTheme();

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
        <CircularProgress sx={{color: "orangered"}} />
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
            color="text"
            variant={vista === "usuario" ? "contained" : "outlined"}
            onClick={() => setVista("usuario")}
          >
            Mis pedidos
          </Button>
          <Button
            color="text"
            variant={vista === "empleado" ? "contained" : "outlined"}
            onClick={() => setVista("empleado")}
          >
            Pedidos empleados
          </Button>
          <Button
            color="text"
            variant={vista === "admin" ? "contained" : "outlined"}
            onClick={() => setVista("admin")}
          >
            Todos los pedidos
          </Button>
        </Box>

        {pedidos.length === 0 ? (
          <Typography>No hay pedidos disponibles.</Typography>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Box
              component="table"
              sx={{
                width: "100%",
                minWidth: "900px", // Fuerza scroll en móviles
                borderCollapse: "collapse",
                backgroundColor: "",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {/* ENCABEZADOS */}
              <Box component="thead" sx={{ bgcolor: theme.palette.background.paper, }}>
                <Box component="tr">
                  <Box component="th" sx={{ p: 2, textAlign: "left", fontWeight: 700 }}>
                    Pedido
                  </Box>
                  <Box component="th" sx={{ p: 2, textAlign: "left", fontWeight: 700 }}>
                    Usuario
                  </Box>
                  <Box component="th" sx={{ p: 2, textAlign: "left", fontWeight: 700 }}>
                    Total
                  </Box>
                  <Box component="th" sx={{ p: 2, textAlign: "left", fontWeight: 700 }}>
                    Estado
                  </Box>
                  <Box component="th" sx={{ p: 2, textAlign: "left", fontWeight: 700 }}>
                    Detalles
                  </Box>
                </Box>
              </Box>

              {/* FILAS */}
              <Box component="tbody" sx={{ bgcolor: theme.palette.background.paper, }}>
                {pedidos.map((pedido) => (
                  <Box
                    component="tr"
                    key={pedido.id}
                    sx={{
                      borderBottom: "1px solid #ddd",
                      "&:hover": { bgcolor: "#ca4d2e73" },
                    }}
                  >
                    {/* ID */}
                    <Box component="td" sx={{ p: 2 }}>
                      <Typography fontWeight={600}>#{pedido.id}</Typography>
                    </Box>

                    {/* Usuario */}
                    <Box component="td" sx={{ p: 2 }}>
                      {pedido.usuario?.email || "Desconocido"}
                    </Box>

                    {/* Total */}
                    <Box component="td" sx={{ p: 2 }}>
                      ${pedido.total}
                    </Box>

                    {/* Estado con Select */}
                    <Box component="td" sx={{ p: 2, minWidth: 160 }}>
                      <Select
                        value={pedido.estado || "pendiente"}
                        size="small"
                        fullWidth
                        onChange={(e) =>
                          handleChangeEstado(pedido.id, e.target.value)
                        }
                      >
                        {ESTADOS.map((estado) => (
                          <MenuItem key={estado} value={estado}>
                            {estado}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

                    {/* Detalles */}
                    <Box component="td" sx={{ p: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/pedidos/${pedido.id}`)}
                        sx={{ borderRadius: 2, px: 3 }}
                      >
                        Ver Detalle
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
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
