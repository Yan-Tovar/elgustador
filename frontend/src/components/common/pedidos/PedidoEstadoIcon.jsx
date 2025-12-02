import {
  PendingActions,
  LocalShipping,
  CheckCircle,
  Inventory,
  Cancel,
  Payment,
} from "@mui/icons-material";

export default function PedidoEstadoIcon({ estado, size = 40 }) {
  const iconStyle = { fontSize: size };

  const icons = {
    pendiente: <PendingActions color="warning" sx={iconStyle} />,
    procesando: <Inventory color="info" sx={iconStyle} />,
    pagado: <Payment color="success" sx={iconStyle} />,
    enviado: <LocalShipping color="primary" sx={iconStyle} />,
    entregado: <CheckCircle color="success" sx={iconStyle} />,
    cancelado: <Cancel color="error" sx={iconStyle} />,
  };

  return icons[estado] || <PendingActions sx={iconStyle} />;
}
