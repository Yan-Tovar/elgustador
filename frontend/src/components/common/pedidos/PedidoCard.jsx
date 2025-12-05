// src/components/pedidos/PedidoCard.jsx
import {
  Card,
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// ICONOS por estado
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";

export default function PedidoCard({ pedido }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 600px)");

  // Estado visual
  const getEstadoInfo = (estado) => {
    switch (estado) {
      case "pendiente":
        return { icon: <PendingIcon />, label: "Pendiente", color: theme.palette.info.main };
      case "procesando":
        return { icon: <AutorenewIcon />, label: "Procesando", color: theme.palette.info.main };
      case "pagado":
        return { icon: <PaymentsIcon />, label: "Pagado", color: theme.palette.success.main };
      case "enviado":
        return { icon: <LocalShippingIcon />, label: "Enviado", color: theme.palette.secondary.main };
      case "entregado":
        return { icon: <CheckCircleIcon />, label: "Entregado", color: theme.palette.success.main };
      case "cancelado":
        return { icon: <CancelIcon />, label: "Cancelado", color: theme.palette.error.main };
      default:
        return { icon: <PendingIcon />, label: "Desconocido", color: theme.palette.text.secondary };
    }
  };

  const estadoInfo = getEstadoInfo(pedido.estado);

  const productos = pedido.detalles || [];

  return (
    <Card
      sx={{
        width: {
          xs: "100%",
          sm: "100%",
          md: "calc(100vw - 260px)", // Ajuste para sidebar fijo
        },
        maxWidth: "100%",
        minWidth: "100%",
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        mb: 1,
        backgroundColor: theme.palette.background.paper,

        height: { xs: "auto", sm: 230, md: 220 }, // altura uniforme
        display: "flex",
        flexDirection: "column",
        mx: { xs: 0, md: "auto" },
      }}
    >
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {estadoInfo.label} el{" "}
          {new Date(pedido.fecha_creacion).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Typography>

        {!isMobile && (
          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate(`/pedidos/${pedido.id}`)}
            sx={{ fontWeight: "bold" }}
          >
            Ver detalles del pedido
          </Button>
        )}
      </Stack>

      {/* CONTENIDO */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mt={2}
        flex={1}
      >
        {/* IMÁGENES */}
        <Box
          sx={{
            width: { xs: "100%", sm: 200, lg: 450 },
            height: "100%",
            overflowX: "auto",
            whiteSpace: "nowrap",
            scrollBehavior: "smooth",
            borderRadius: 2,
          }}
        >
          {productos.map((item, i) => (
            <Box
              key={i}
              component="img"
              src={item.producto?.imagen1 || "/placeholder-product.png"}
              alt={`Producto ${i}`}
              sx={{
                width: { xs: 95, sm: 125 },
                height: { xs: 95, sm: 125 },
                borderRadius: 2,
                objectFit: "cover",
                display: "inline-block",
                mr: 1,
              }}
            />
          ))}
        </Box>

        {/* INFO GENERAL */}
        <Stack flex={1} spacing={0.8} justifyContent="center">
          <Typography fontSize={15} fontWeight={700} color="text.primary">
            {productos.length} artículos
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Total: ${pedido.total}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            ID del pedido: {pedido.codigo || pedido.id}
          </Typography>
        </Stack>

        {/* ACCIONES */}
        <Stack
          spacing={1.5}
          justifyContent="center"
          alignItems="center"
          sx={{ width: { xs: "100%", sm: 200 } }}
        >
          {!isMobile && (
            <>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate(`/pedidos/${pedido.id}`)}
                sx={{ borderRadius: 4 }}
              >
                Ver detalle del pedido
              </Button>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: estadoInfo.color }}>
                  {estadoInfo.icon}
                </Avatar>
                <Typography color="text.primary" fontWeight={600} fontSize={14}>
                  {estadoInfo.label}
                </Typography>
              </Stack>
            </>
          )}

          {isMobile && (
            <>
              <Tooltip title="Detalle del pedido" arrow>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate(`/pedidos/${pedido.id}`)}
                  sx={{ p: 1.2, borderRadius: 3 }}
                >
                  <CheckCircleIcon />
                </Button>
              </Tooltip>

              <Tooltip title={estadoInfo.label} arrow>
                <Avatar
                  sx={{
                    bgcolor: estadoInfo.color,
                    width: 46,
                    height: 46,
                  }}
                >
                  {estadoInfo.icon}
                </Avatar>
              </Tooltip>
            </>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
