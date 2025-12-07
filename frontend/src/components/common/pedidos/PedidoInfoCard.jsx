import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import PedidoEstadoIcon from "./PedidoEstadoIcon";

export default function PedidoInfoCard({ pedido }) {
  return (
    <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PedidoEstadoIcon estado={pedido.estado} size={45} />
          <Typography variant="h6" fontWeight={700}>
            Información del Pedido
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography>
          <strong>Estado:</strong> {pedido.estado}
        </Typography>
        <Typography>
          <strong>Fecha:</strong>{" "}
          {new Date(pedido.fecha_creacion).toLocaleString()}
        </Typography>
        <Typography>
          <strong>Total:</strong> ${pedido.total}
        </Typography>
      </CardContent>
    </Card>
  );
}
