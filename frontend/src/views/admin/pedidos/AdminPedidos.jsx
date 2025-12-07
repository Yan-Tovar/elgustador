// pages/admin/AdminPedidos.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Stack,
  Button,
  Pagination,
  Tooltip,
  useMediaQuery,
  Divider,
  IconButton,
  Modal,
  Paper,
  Grid,
  Select,
  MenuItem,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PaymentIcon from "@mui/icons-material/Payment";
import TimelapseIcon  from "@mui/icons-material/Timelapse";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import CustomSnackbar from "../../../components/common/CustomSnackbar";
import { showAlert,  showConfirm, showToast } from "../../../components/feedback/SweetAlert";

import {
  fetchPedidosUsuario,
  fetchPedidosEmpleados,
  fetchPedidosTodos,
  actualizarEstadoPedido,
  fetchPedidoDetalle,
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
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const theme = useTheme();

  const isMobile = useMediaQuery("(max-width:600px)");

  // Buscador / filtro
  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  // Paginación (solo para empleados: el backend debe devolver { results, total_pages, count })
  const [page, setPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Modales
  const [openModalUsuario, setOpenModalUsuario] = useState(false);
  const [openModalPedido, setOpenModalPedido] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Estados
  const JERARQUIA_ESTADOS = ["pagado", "procesando", "enviado", "entregado"];

  // =========================================
  //   Cargar pedidos desde BACKEND
  // =========================================
  const cargarPedidos = async () => {
    setLoading(true);
    try {
      // Usamos SIEMPRE el servicio de administrador
      const response = await fetchPedidosTodos({
        page,
        estado: estadoFiltro,
        search,
      });

      // Puede venir array o paginado
      if (Array.isArray(response)) {
        setPedidos(response);
        setTotalPaginas(1);
      } else {
        setPedidos(response?.results || []);
        setTotalPaginas(response?.total_pages || 1);
      }

      const cantidad =
        response?.results?.length ??
        (Array.isArray(response) ? response.length : 0);

      if (cantidad === 0) {
        showToast("No se encontraron pedidos", "info");
      }
    } catch (err) {
      console.error(err);
      showAlert(
        "Error",
        "No se pudieron cargar los pedidos como administrador.",
        "error"
      );
      setPedidos([]);
      setTotalPaginas(1);
    }
    setLoading(false);
  };

  // cargar datos cada vez que cambie filtro, buscador o página o vista


  useEffect(() => {
    cargarPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ page, estadoFiltro, search]);

  // =========================================
  //   Cambiar estado con confirmación
  // =========================================
  const handleChangeEstado = async (pedidoId, nuevoEstado) => {
    try {
      // Usar la confirmación de SweetAlert
      const confirmado = await showConfirm(
        "Confirmar cambio",
        `¿Deseas cambiar el estado del pedido a "${nuevoEstado}"?`
      );

      if (!confirmado) return; // Si el usuario cancela, abortamos

      // Actualizar estado en backend
      const { data } = await actualizarEstadoPedido(pedidoId, nuevoEstado);

      // Actualizar estado en frontend
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, estado: data?.estado ?? nuevoEstado } : p
        )
      );

      showToast("Estado actualizado correctamente", "success");
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el estado", "error");
    }
  };

  // =========================================
  //   Abrir modales
  // =========================================
  const abrirModalUsuario = (pedido) => {
    setPedidoSeleccionado(pedido);
    setOpenModalUsuario(true);
  };
  const abrirModalPedido = async (pedido) => {
    try {
      setLoading(true);
      setPedidoSeleccionado(pedido);

      const data = await fetchPedidoDetalle(pedido.id);
      setDetallesPedido(data); 

      setOpenModalPedido(true);
    } catch (error) {
      console.error(error);
      showToast("No se pudieron obtener los detalles del pedido", "error");
    } finally {
      setLoading(false);
    }
  };

  // Render
  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress sx={{ color: "orangered" }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Divider sx={{ mb: 2 }}>Administrar Pedidos</Divider>


        {/* Encabezado de búsqueda y filtro (similar al ejemplo) */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", mb: 2 }}>
          {/* Filtros por estado (botones con iconos) */}
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ alignItems: "center" }}>
            {[
              { label: "Todos", value: "todos", icon: <DoneAllIcon /> },
              { label: "Pendientes", value: "pendiente", icon: <TimelapseIcon /> },
              { label: "Pagado", value: "pagado", icon: <PaymentIcon /> },
              { label: "Procesando", value: "procesando", icon: <AutorenewIcon /> },
              { label: "Enviado", value: "enviado", icon: <LocalShippingIcon /> },
              { label: "Entregado", value: "entregado", icon: <CheckCircleIcon /> },
              { label: "Cancelado", value: "cancelado", icon: <CancelIcon /> },
            ].map((btn) => {
              const content = (
                <Stack direction="row" alignItems="center" spacing={1}>
                  {btn.icon}
                  {!isMobile && btn.label}
                </Stack>
              );

              return isMobile ? (
                <Tooltip key={btn.value} title={btn.label}>
                  <Button
                    variant={estadoFiltro === btn.value ? "contained" : "outlined"}
                    size="small"
                    onClick={() => {
                      setEstadoFiltro(btn.value);
                      setPage(1);
                    }}
                    sx={{ borderRadius: 3, minWidth: 40, padding: "6px 10px" }}
                  >
                    {btn.icon}
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  key={btn.value}
                  variant={estadoFiltro === btn.value ? "contained" : "outlined"}
                  size="small"
                  color="secondary"
                  onClick={() => {
                    setEstadoFiltro(btn.value);
                    setPage(1);
                  }}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: estadoFiltro === btn.value ? "0px 2px 6px rgba(0,0,0,0.12)" : "none",
                  }}
                >
                  {content}
                </Button>
              );
            })}
          </Stack>

          {/* Buscar */}
          <Box sx={{ flex: 1, minWidth: 220, display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              color="text"
              label="Buscar por Número o Fecha"
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ borderRadius: 3, px: 3 }}
              onClick={() => {
                setSearch(pendingSearch);
                setPage(1);
              }}
            >
              Buscar
            </Button>
          </Box>
        </Box>

        {/* Tabla con overflow horizontal en móvil */}
        {pedidos.length === 0 ? (
          <Typography>No hay pedidos disponibles.</Typography>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Paper elevation={0} sx={{ minWidth: 900 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Pedido</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Detalle Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Detalle Pedido</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Cambiar Estado</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pedidos.map((pedido) => (
                    <TableRow key={pedido.id} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{pedido.id}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>
                          {new Date(pedido.fecha_creacion).toLocaleString?.() ??
                            (pedido.fecha || "—")} 
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {/* Desktop: icono + nombre/email. Mobile: icono con tooltip */}
                        {isMobile ? (
                          <Tooltip title={pedido.usuario?.email || "Desconocido"}>
                            <IconButton size="small">
                              <PersonIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 28, height: 28 }}>
                              {pedido.usuario?.nombre?.[0] ?? pedido.usuario?.email?.[0] ?? <PersonIcon />}
                            </Avatar>
                            <Box>
                              <Typography fontSize={13} fontWeight={600}>
                                {pedido.usuario?.nombre || pedido.usuario?.email || "Desconocido"}
                              </Typography>
                              <Typography fontSize={12} color="text.secondary">
                                {pedido.usuario?.email || ""}
                              </Typography>
                            </Box>
                          </Stack>
                        )}
                      </TableCell>

                      <TableCell>${pedido.total ?? pedido.total_precio ?? 0}</TableCell>

                      <TableCell>
                        <Typography textTransform="capitalize">{pedido.estado || "pendiente"}</Typography>
                      </TableCell>

                      {/* Boton Modal Detalle Usuario */}
                      <TableCell align="center">
                        <Tooltip title="Ver información del usuario">
                          <IconButton
                            size="small"
                            onClick={() => abrirModalUsuario(pedido)}
                            aria-label="detalle-usuario"
                          >
                            <PersonIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      {/* Boton Modal Detalle Pedido */}
                      <TableCell align="center">
                        <Tooltip title="Ver pedido">
                          <IconButton onClick={() => abrirModalPedido(pedido)}>
                            <ReceiptLongIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      {/* Cambiar Estado */}
                      <TableCell sx={{ minWidth: 160 }}>
                        <Select
                          value={pedido.estado || "pendiente"}
                          size="small"
                          fullWidth
                          disabled={pedido.estado === "pendiente"} // pendiente no se puede cambiar
                          onChange={(e) => handleChangeEstado(pedido.id, e.target.value)}
                        >
                          {ESTADOS.map((estado) => {
                            let disabled = false;

                            // Solo aplicamos jerarquía a los estados de la cadena principal
                            if (pedido.estado && JERARQUIA_ESTADOS.includes(pedido.estado) && JERARQUIA_ESTADOS.includes(estado)) {
                              const indexActual = JERARQUIA_ESTADOS.indexOf(pedido.estado);
                              const indexNuevo = JERARQUIA_ESTADOS.indexOf(estado);
                              if (indexNuevo < indexActual) disabled = true; // no se puede retroceder
                            }

                            // "pendiente" siempre deshabilitado
                            if (estado === "pendiente") disabled = true;

                            return (
                              <MenuItem key={estado} value={estado} disabled={disabled}>
                                {estado}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}

        {/* PAGINACIÓN (solo si totalPaginas > 1) */}
        {totalPaginas > 1 && (
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPaginas}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
              color="secondary"
              shape="rounded"
            />
          </Box>
        )}
      </Box>

      {/* Modal Detalle Usuario */}
      <Modal open={openModalUsuario} onClose={() => setOpenModalUsuario(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 600 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Información del usuario
          </Typography>

          {!pedidoSeleccionado ? (
            <Typography>No hay información.</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Avatar sx={{ width: 72, height: 72 }}>
                  {pedidoSeleccionado.usuario?.nombre?.[0] ?? <PersonIcon />}
                </Avatar>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography fontWeight={700}>
                  {pedidoSeleccionado.usuario?.nombre + ' ' + pedidoSeleccionado.usuario?.apellido || pedidoSeleccionado.usuario?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Id: {pedidoSeleccionado.usuario?.identificacion}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pedidoSeleccionado.usuario?.email}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Teléfono: {pedidoSeleccionado.usuario?.telefono || "—"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">Dirección</Typography>
                <Typography variant="body2">
                  Municipio: {
                    pedidoSeleccionado.usuario?.municipio.nombre  + ' - ' +
                    pedidoSeleccionado.usuario?.departamento.nombre || "—"}
                </Typography>
                <Typography variant="body2">
                  Dirección: {
                    pedidoSeleccionado.usuario?.direccion_detallada || "—"}
                </Typography>
              </Grid>

              <Grid item xs={12} sx={{color: "orangered", display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button sx={{color: "orangered"}} onClick={() => setOpenModalUsuario(false)}>Cerrar</Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      {/* Modal Detalle Pedido */}
      <Modal open={openModalPedido} onClose={() => setOpenModalPedido(false)}>
        <Box
          sx={{
            backgroundColor: "background.paper",
            p: 3,
            borderRadius: 2,
            width: "95%",
            maxWidth: 600,
            mx: "auto",
            mt: 10,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Detalles del pedido {pedidoSeleccionado?.id}
          </Typography>
          <Typography sx={{ mb: 1 }}>
            Fecha: {pedidoSeleccionado?.fecha_creacion
              ? new Date(pedidoSeleccionado.fecha_creacion).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Typography>
          {!pedidoSeleccionado ? (
              <Typography>No hay información.</Typography>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" color="text.secondary">
                    Usuario: {pedidoSeleccionado.usuario?.identificacion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Id Pedido: {pedidoSeleccionado.id}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                    Estado: {pedidoSeleccionado.estado || "—"}
                  </Typography>
                  <Typography variant="body2">
                    Metodo Pago: {pedidoSeleccionado.metodo_pago || "—"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">Costos</Typography>
                  <Typography variant="body2">
                    Costo Envío: {pedidoSeleccionado.costo_envio || "—"}
                  </Typography>
                  <Typography variant="body2">
                    Subtotal: {pedidoSeleccionado.subtotal || "—"}
                  </Typography>
                  <Typography variant="body2">
                    Total: {pedidoSeleccionado.total || "—"}
                  </Typography>
                </Grid>
              </Grid>
            )}

          <Divider sx={{ mb: 2 }} />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {detallesPedido.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        src={item.producto?.imagen1}
                        alt={item.producto?.nombre}
                        sx={{ width: 40, height: 40 }}
                      />
                      {item.producto?.nombre}
                    </Stack>
                  </TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                  <TableCell>${item.precio_unitario.toLocaleString()}</TableCell>
                  <TableCell>${item.precio_total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ textAlign: "right", mt: 3 }}>
            <Button variant="contained" color="primary" onClick={() => setOpenModalPedido(false)}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar */}
      {/* <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      /> */}
    </DashboardLayout>
  );
}
