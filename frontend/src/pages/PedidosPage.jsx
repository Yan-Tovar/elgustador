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
  const [searchInput, setSearchInput] = useState(""); 
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const [page, setPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width:600px)");

  // =========================================
  //   Cargar pedidos desde BACKEND
  // =========================================
  const cargarPedidos = async () => {
    try {
      setLoading(true);

      const response = await fetchPedidosUsuario({
        page,
        estado: estadoFiltro,
        search,
      });

      // El backend ya debe enviar:
      // { results: [], total_pages: X, count: Y }
      setPedidos(response?.results || []);
      setTotalPaginas(response?.total_pages || 1);

      if (response?.results?.length === 0) {
        showToast("No se encontraron pedidos", "info");
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

  // cargar datos cada vez que cambie filtro, buscador o página
  useEffect(() => {
    cargarPedidos();
  }, [page, estadoFiltro, search]);

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

            {/* Botones de filtro (izquierda) */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ display: "flex", justifyContent: "center" }}>
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
                        estadoFiltro === btn.value ? "0px 2px 6px rgba(0,0,0,0.15)" : "none",
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
            <Stack direction="row" spacing={1}>
              
              <TextField
                fullWidth
                color="text"
                label="Buscar por Número o Fecha"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 3 },
                }}
              />

              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 3 }}
                onClick={() => {
                  setSearch(searchInput); // ahora sí ejecuta la búsqueda
                  setPage(1);             // reiniciar a página 1
                }}
              >
                Buscar
              </Button>

            </Stack>
          </Box>
        }
      />

      {/* LISTADO */}
      <Box p={4}>
        <PedidosListado pedidos={pedidos} />

        {/* PAGINACIÓN BACKEND */}
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
    </DashboarLayout>
  );
}
