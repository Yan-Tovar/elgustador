// src/components/pedidos/PedidoCard.jsx
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Avatar,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// ICONOS por estado
import CheckCircleIcon from "@mui/icons-material/CheckCircle";      // entregado
import LocalShippingIcon from "@mui/icons-material/LocalShipping";  // enviado
import PaymentsIcon from "@mui/icons-material/Payments";            // pagado
import AutorenewIcon from "@mui/icons-material/Autorenew";          // procesando
import PendingIcon from "@mui/icons-material/Pending";              // pendiente
import CancelIcon from "@mui/icons-material/Cancel";                // cancelado

export default function PedidoCard({ pedido }) {
  const navigate = useNavigate();
  const theme = useTheme();

  // Selección del icono y color por estado
  const getEstadoInfo = (estado) => {
    switch (estado) {
      case "pendiente":
        return { icon: <PendingIcon />, color: theme.palette.warning.main };

      case "procesando":
        return { icon: <AutorenewIcon />, color: theme.palette.info.main };

      case "pagado":
        return { icon: <PaymentsIcon />, color: theme.palette.success.main };

      case "enviado":
        return { icon: <LocalShippingIcon />, color: theme.palette.primary.main };

      case "entregado":
        return { icon: <CheckCircleIcon />, color: theme.palette.success.dark };

      case "cancelado":
        return { icon: <CancelIcon />, color: theme.palette.error.main };

      default:
        return { icon: <PendingIcon />, color: theme.palette.text.secondary };
    }
  };

  const estadoInfo = getEstadoInfo(pedido.estado);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Encabezado con ícono */}
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar
            sx={{
              bgcolor: estadoInfo.color,
              width: 46,
              height: 46,
            }}
          >
            {estadoInfo.icon}
          </Avatar>

          <Typography variant="h6" fontWeight={700}>
            Pedido {pedido.id}
          </Typography>
        </Stack>

        {/* Información del pedido */}
        <Typography variant="body2" color="black" mb={1}>
          <strong>Total:</strong> ${pedido.total}
        </Typography>

        <Typography variant="body2" color="black" mb={1}>
          <strong>Estado:</strong>{" "}
          <span style={{ color: estadoInfo.color, fontWeight: "bold" }}>
            {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
          </span>
        </Typography>

        <Typography variant="body2" color="black">
          <strong>Fecha:</strong>{" "}
          {new Date(pedido.fecha_creacion).toLocaleString()}
        </Typography>
      </CardContent>

      {/* Botón inferior */}
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/pedidos/${pedido.id}`)}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Ver Detalle
        </Button>
      </Box>
    </Card>
  );
}
