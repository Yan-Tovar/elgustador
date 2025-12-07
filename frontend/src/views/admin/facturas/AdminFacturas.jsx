// pages/admin/AdminFacturas.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Stack,
  Button,
  Pagination,
  Tooltip,
  IconButton,
  Modal,
  Paper,
  Grid,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TableViewIcon from "@mui/icons-material/TableView";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import DashboardLayout from "../../../components/layout/DashboardLayout";

// 🔥 Servicios actualizados
import {
  getFacturasAdmin,
  descargarFacturaPDF,
  buscarFacturasAdmin,
  exportarFacturasExcel,
} from "../../../services/facturasService";

import {
  fetchPedidoDetalle,
  getPedido,
} from "../../../services/pedidosService";

export default function AdminFacturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Búsqueda avanzada
  const [search, setSearch] = useState({});
  const [pendingSearch, setPendingSearch] = useState({
    numero_factura: "",
    fecha_from: "",
    fecha_to: "",
    total_min: "",
    total_max: "",
  });

  // Modal
  const [openModalFactura, setOpenModalFactura] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [detalleFactura, setDetalleFactura] = useState([]);
  const [usuarioPedido, setUsuarioPedido] = useState(null);

  // -----------------------------------------
  // CARGAR FACTURAS
  // -----------------------------------------
  const fetchFacturas = async (pageNumber = 1) => {
    setLoading(true);
    setError("");

    try {
      const params = { page: pageNumber, ...search };
      const hayFiltros = Object.values(search).some(v => v !== "");

      const res = hayFiltros
        ? await buscarFacturasAdmin(params)
        : await getFacturasAdmin(params);

      setFacturas(res.data.results ?? []);
      setTotalPaginas(Math.ceil((res.data.count ?? 1) / 10));
    } catch (err) {
      console.error(err);
      setError("Error cargando las facturas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchFacturas(page);
    }, [page, search]);

    useEffect(() => {
    setFacturas([]);
    setPage(1);
    fetchFacturas(1);
  }, [search]);

  // -----------------------------------------
  // MODAL DETALLE FACTURA
  // -----------------------------------------
  const abrirModalFactura = async (factura) => {
    setFacturaSeleccionada(factura);
    setLoading(true);

    try {
      const pedido = await getPedido(factura.pedido);
      setUsuarioPedido(pedido.usuario);

      const detalle = await fetchPedidoDetalle(factura.pedido);
      setDetalleFactura(detalle);

      setOpenModalFactura(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el detalle del pedido.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // DESCARGAR PDF
  // -----------------------------------------
  const handleDescargarPDF = async (facturaId) => {
    try {
      const res = await descargarFacturaPDF(facturaId);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Factura_${facturaId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("No se pudo descargar la factura.");
    }
  };

  // -----------------------------------------
  // EXPORTAR EXCEL
  // -----------------------------------------
  const exportarExcel = async () => {
    try {
      const res = await exportarFacturasExcel(search);

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte_facturas.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("No se pudo exportar el archivo Excel.");
    }
  };

  // -----------------------------------------
  // EXPORTAR CSV
  // -----------------------------------------
  const exportarCSV = async () => {
    try {
      const res = await exportarFacturasExcel({ ...search, formato: "csv" });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte_facturas.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("No se pudo exportar el archivo CSV.");
    }
  };

  return (
    <DashboardLayout>
      <Box p={3}>
        <Typography variant="h4" mb={3}>
          Facturas del Sistema
        </Typography>

        {/* BÚSQUEDA AVANZADA */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" mb={2}>
            Filtros de Búsqueda
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Número de factura"
                size="small"
                fullWidth
                value={pendingSearch.numero_factura}
                onChange={(e) =>
                  setPendingSearch({
                    ...pendingSearch,
                    numero_factura: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                type="date"
                label="Fecha desde"
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={pendingSearch.fecha_from}
                onChange={(e) =>
                  setPendingSearch({
                    ...pendingSearch,
                    fecha_from: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                type="date"
                label="Fecha hasta"
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={pendingSearch.fecha_to}
                onChange={(e) =>
                  setPendingSearch({
                    ...pendingSearch,
                    fecha_to: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Total mínimo"
                size="small"
                type="number"
                fullWidth
                value={pendingSearch.total_min}
                onChange={(e) =>
                  setPendingSearch({
                    ...pendingSearch,
                    total_min: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Total máximo"
                size="small"
                type="number"
                fullWidth
                value={pendingSearch.total_max}
                onChange={(e) =>
                  setPendingSearch({
                    ...pendingSearch,
                    total_max: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setFacturas([]);
                setPage(1);
                setSearch(pendingSearch);
              }}
            >
              Buscar
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setPendingSearch({
                  numero_factura: "",
                  fecha_from: "",
                  fecha_to: "",
                  total_min: "",
                  total_max: "",
                });

                setFacturas([]);
                setPage(1);
                setSearch({});
              }}
            >
              Limpiar
            </Button>
          </Stack>
        </Paper>

        {/* BOTONES DE EXPORTACIÓN */}
        <Stack direction="row" spacing={2} mb={3}>
          <Button
            startIcon={<TableViewIcon />}
            variant="outlined"
            color="success"
            onClick={exportarExcel}
          >
            Exportar Excel
          </Button>

          <Button
            startIcon={<InsertDriveFileIcon />}
            variant="outlined"
            color="warning"
            onClick={exportarCSV}
          >
            Exportar CSV
          </Button>
        </Stack>

        {/* TABLA PRINCIPAL */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : facturas.length === 0 ? (
          <Typography>No hay facturas registradas.</Typography>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Paper sx={{ minWidth: 900, p: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>ID</b></TableCell>
                    <TableCell><b>N° Factura</b></TableCell>
                    <TableCell><b>Pedido</b></TableCell>
                    <TableCell><b>Usuario</b></TableCell>
                    <TableCell><b>Subtotal</b></TableCell>
                    <TableCell><b>Impuestos</b></TableCell>
                    <TableCell><b>Total</b></TableCell>
                    <TableCell><b>Fecha</b></TableCell>
                    <TableCell align="center"><b>Acciones</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {facturas.map((f) => (
                    <TableRow key={f.id} hover>
                      <TableCell>{f.id}</TableCell>
                      <TableCell>{f.numero_factura}</TableCell>
                      <TableCell>Pedido #{f.pedido}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 28, height: 28 }}>
                            {f.usuario_nombre?.[0] ?? <PersonIcon />}
                          </Avatar>
                          <Typography fontSize={13}>
                            {f.usuario_identificacion || f.usuario_email}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>${parseFloat(f.subtotal).toLocaleString()}</TableCell>
                      <TableCell>${parseFloat(f.impuestos).toLocaleString()}</TableCell>
                      <TableCell><b>${parseFloat(f.total).toLocaleString()}</b></TableCell>

                      <TableCell>
                        {new Date(f.fecha).toLocaleString("es-CO")}
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Ver detalle">
                          <IconButton onClick={() => abrirModalFactura(f)}>
                            <ReceiptLongIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Descargar PDF">
                          <IconButton onClick={() => handleDescargarPDF(f.id)}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

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
        )}

        {/* MODAL DETALLE FACTURA */}
        <Modal open={openModalFactura} onClose={() => setOpenModalFactura(false)}>
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
              Detalle Factura #{facturaSeleccionada?.numero_factura}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              Fecha:{" "}
              {facturaSeleccionada?.fecha &&
                new Date(facturaSeleccionada.fecha).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Typography>

            {!facturaSeleccionada ? (
              <Typography>No hay información.</Typography>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">Datos del pedido</Typography>

                  <Typography variant="body2">
                    ID Pedido: {facturaSeleccionada.pedido}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">Costos</Typography>
                  <Typography variant="body2">
                    Subtotal: ${parseFloat(facturaSeleccionada.subtotal).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Impuestos: ${parseFloat(facturaSeleccionada.impuestos).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <b>Total: ${parseFloat(facturaSeleccionada.total).toLocaleString()}</b>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Precio Unitario</TableCell>
                        <TableCell>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {detalleFactura.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.producto?.nombre}</TableCell>
                          <TableCell>{item.cantidad}</TableCell>
                          <TableCell>
                            ${item.precio_unitario.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${item.precio_total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModalFactura(false)}
                  >
                    Cerrar
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        </Modal>
      </Box>
    </DashboardLayout>
  );
}
