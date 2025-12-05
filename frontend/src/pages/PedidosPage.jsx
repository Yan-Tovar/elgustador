// src/pages/PedidosPage.jsx
import { useEffect, useState, useMemo } from "react";
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
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PaymentIcon from "@mui/icons-material/Payment";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import DashboarLayout from "../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../components/layout/TwoColumnInnerLayout";
import { fetchPedidosUsuario } from "../services/pedidosService";

import PedidosListado from "../components/common/pedidos/PedidosListado";

// SweetAlert
import { showAlert, showToast } from "../components/feedback/SweetAlert";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const [page, setPage] = useState(1);
  const porPagina = 10;

  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width:600px)");

  const cargarPedidos = async () => {
    try {
      const response = await fetchPedidosUsuario();
      setPedidos(response || []);

      if (!response || response.length === 0) {
        showToast("Aún no tienes pedidos registrados", "info");
      }
    } catch (err) {
      showAlert(
        "Error",
        "No se pudieron cargar los pedidos. Por favor, intenta nuevamente.",
        "error"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // ===========================
  //   FILTRO POR TEXTO
  // ===========================
  const filtrarBusqueda = (pedido) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase();

    const fecha = new Date(pedido.fecha_creacion)
      .toLocaleDateString("es-CO")
      .toLowerCase();

    return (
      pedido.id?.toString().includes(query) ||
      fecha.includes(query)
    );
  };

  // ===========================
  //   FILTRO POR ESTADO
  // ===========================
  const filtrarEstado = (pedido) => {
    if (estadoFiltro === "todos") return true;
    return pedido.estado === estadoFiltro;
  };

  // ===========================
  //   COMBINAR FILTROS
  // ===========================
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => filtrarBusqueda(p) && filtrarEstado(p));
  }, [pedidos, search, estadoFiltro]);

  // ===========================
  //   PAGINACIÓN MANUAL
  // ===========================
  const totalPaginas = Math.ceil(pedidosFiltrados.length / porPagina);

  const pedidosPaginados = useMemo(() => {
    const inicio = (page - 1) * porPagina;
    return pedidosFiltrados.slice(inicio, inicio + porPagina);
  }, [page, pedidosFiltrados]);

  if (loading) {
    return (
      <DashboarLayout>
        <Box p={4} textAlign="center" color="orangered">
          <CircularProgress />
        </Box>
      </DashboarLayout>
    );
  }

  return (
    <DashboarLayout>

      <TwoColumnInnerLayout
        left={
          <Box>

            <Divider sx={{ mb: 2 }}>Pedidos</Divider>

            {/* Botones de filtro (ahora a la izquierda) */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{display: "flex", justifyContent: "center"}}>
              {[
                { label: "Todos", value: "todos", icon: <DoneAllIcon /> },
                { label: "Pagado", value: "pagado", icon: <PaymentIcon /> },
                { label: "Procesando", value: "procesando", icon: <AutorenewIcon /> },
                { label: "Enviado", value: "enviado", icon: <LocalShippingIcon /> },
                { label: "Entregado", value: "entregado", icon: <CheckCircleIcon /> },
                { label: "Cancelado", value: "cancelado", icon: <CancelIcon /> },
              ].map((btn) => {
                const buttonContent = (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {btn.icon}
                    {!isMobile && btn.label}
                  </Stack>
                );

                return isMobile ? (
                  <Tooltip key={btn.value} title={btn.label}>
                    <Button
                      variant={estadoFiltro === btn.value ? "contained" : "outlined"}
                      color="secondary"
                      size="small"
                      onClick={() => {
                        setEstadoFiltro(btn.value);
                        setPage(1);
                      }}
                      sx={{
                        borderRadius: 3,
                        minWidth: 40,
                        padding: "6px 10px",
                      }}
                    >
                      {btn.icon}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    key={btn.value}
                    variant={estadoFiltro === btn.value ? "contained" : "outlined"}
                    color="secondary"
                    size="small"
                    onClick={() => {
                      setEstadoFiltro(btn.value);
                      setPage(1);
                    }}
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      boxShadow:
                        estadoFiltro === btn.value
                          ? "0px 2px 6px rgba(0,0,0,0.15)"
                          : "none",
                    }}
                  >
                    {buttonContent}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        }
        right={
          <Box sx={{ mt: { xs: 2, sm: 2, lg: 2 } }}>
            {/* Buscador (ahora derecha, parte corta) */}
            <TextField
              fullWidth
              color="text"
              label="Buscar por Número o Fecha"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        }
      />

      {/* LISTADO */}
      <Box p={4}>
        <PedidosListado pedidos={pedidosPaginados} />

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPaginas}
              page={page}
              onChange={(e, val) => setPage(val)}
              color="secondary"
              shape="rounded"
            />
          </Box>
        )}
      </Box>
    </DashboarLayout>
  );
}
