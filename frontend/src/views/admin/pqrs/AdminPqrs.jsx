// pages/admin/AdminPQRS.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Modal,
  Grid,
  Avatar,
  Divider,
  Button,
  Tooltip,
  MenuItem,
  Select,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import { fetchPqrs, fetchPqrsById, updatePqrsEstado } from "../../../services/pqrsService";
import { showToast, showAlert } from "../../../components/feedback/SweetAlert";
import { exportTableExcel } from '../../../services/exportService';

export default function AdminPqrs() {
  const [pqrs, setPqrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModalUsuario, setOpenModalUsuario] = useState(false);
  const [openModalPQRS, setOpenModalPQRS] = useState(false);
  const [pqrsSeleccionado, setPqrsSeleccionado] = useState(null);

  // =========================================
  // Cargar PQRS (solo admin)
  // =========================================
  const cargarPQRS = async () => {
    setLoading(true);
    try {
      const response = await fetchPqrs();
      setPqrs(response);
      if (response.length === 0) showToast("No hay PQRS registrados", "info");
    } catch (err) {
      console.error(err);
      showAlert("Error", "No se pudieron cargar los PQRS", "error");
      setPqrs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarPQRS();
  }, []);

  // =========================================
  // Abrir modales
  // =========================================
  const abrirModalUsuario = (pqrs) => {
    setPqrsSeleccionado(pqrs);
    setOpenModalUsuario(true);
  };

  const abrirModalPQRS = async (pqrs) => {
    try {
      setLoading(true);
      const detalle = await fetchPqrsById(pqrs.id);
      setPqrsSeleccionado(detalle);
      setOpenModalPQRS(true);
    } catch (err) {
      console.error(err);
      showToast("No se pudo cargar la información del PQRS", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCambioEstado = async (id, nuevoEstado) => {
    try {
      const actualizado = await updatePqrsEstado(id, nuevoEstado);
      setPqrs((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: actualizado.estado } : p))
      );
      showToast(`Estado actualizado a '${nuevoEstado}'`, "success");
    } catch (err) {
      console.error(err);
      showToast("No se pudo actualizar el estado", "error");
    }
  };

  const handleExport = () => {
    exportTableExcel("pqrs", "PQRS");
  };

  // =========================================
  // Render
  // =========================================
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
        <Divider>Administrar PQRS</Divider>
        <Button
            variant="contained"
            size="small"
            color="secondary"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              boxShadow: "secondary",
              mb: 2,
            }}
            onClick={handleExport}
        >
            Descargar Excel
        </Button>

        {pqrs.length === 0 ? (
          <Typography>No hay PQRS disponibles.</Typography>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Paper elevation={0} sx={{ minWidth: 700 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Detalle PQRS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pqrs.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.tipo}</TableCell>

                      {/* Estado con select */}
                      <TableCell>
                        {p.usuario ? (
                          <>
                            {p.loading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Select
                                value={p.estado}
                                size="small"
                                onChange={(e) => handleCambioEstado(p.id, e.target.value)}
                              >
                                <MenuItem value="pendiente">Pendiente</MenuItem>
                                <MenuItem value="en_proceso">En proceso</MenuItem>
                                <MenuItem value="resuelto">Resuelto</MenuItem>
                                <MenuItem value="cancelado">Cancelado</MenuItem>
                              </Select>
                            )}
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {p.estado} (anónimo)
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(p.fecha).toLocaleString("es-CO", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>

                      {/* Usuario */}
                      <TableCell align="center">
                        {p.usuario ? (
                          <Tooltip title="Ver información del usuario">
                            <IconButton size="small" onClick={() => abrirModalUsuario(p)}>
                              <PersonIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Anónimo
                          </Typography>
                        )}
                      </TableCell>

                      {/* Detalle PQRS */}
                      <TableCell align="center">
                        <Tooltip title="Ver detalle PQRS">
                          <IconButton size="small" onClick={() => abrirModalPQRS(p)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Modal Usuario */}
      <Modal open={openModalUsuario} onClose={() => setOpenModalUsuario(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 500 },
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

          {!pqrsSeleccionado?.usuario ? (
            <Typography>Usuario anónimo</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Avatar sx={{ width: 72, height: 72 }}>
                  {pqrsSeleccionado.usuario?.nombre?.[0] ?? <PersonIcon />}
                </Avatar>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography fontWeight={700}>
                  {pqrsSeleccionado.usuario?.nombre} {pqrsSeleccionado.usuario?.apellido}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {pqrsSeleccionado.usuario?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Teléfono: {pqrsSeleccionado.usuario?.telefono ?? "—"}
                </Typography>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button color="error" onClick={() => setOpenModalUsuario(false)}>
                  Cerrar
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      {/* Modal Detalle PQRS */}
      <Modal open={openModalPQRS} onClose={() => setOpenModalPQRS(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Detalle PQRS {pqrsSeleccionado?.id}
          </Typography>

          {pqrsSeleccionado ? (
            <>
              <Typography sx={{ mb: 1 }}>
                Tipo: {pqrsSeleccionado.tipo}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Estado: {pqrsSeleccionado.estado}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Fecha: {new Date(pqrsSeleccionado.fecha).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                Descripción: {pqrsSeleccionado.descripcion}
              </Typography>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button color="error" onClick={() => setOpenModalPQRS(false)}>
                  Cerrar
                </Button>
              </Box>
            </>
          ) : (
            <Typography>No hay información disponible.</Typography>
          )}
        </Box>
      </Modal>
    </DashboardLayout>
  );
}
