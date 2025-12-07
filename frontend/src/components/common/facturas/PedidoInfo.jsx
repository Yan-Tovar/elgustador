import { Paper, Typography, Divider } from "@mui/material";

export default function PedidoInfo({ pedido }) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
        {/* INFO PRINCIPAL */}
        <Typography>
            <strong>Estado:</strong> {pedido.estado}
        </Typography>

        <Typography>
            <strong>Fecha:</strong>{" "}
            {new Date(pedido.fecha_creacion).toLocaleString()}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* ENVÍO */}
        <Typography>
            <strong>Municipio:</strong> {pedido.municipio.nombre} - {pedido.departamento.nombre}
        </Typography>

        <Typography>
            <strong>Dirección:</strong> {pedido.direccion_detallada}
        </Typography>

        <Typography>
            <strong>Costo de Envío:</strong> ${pedido.costo_envio}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* PAGO */}
        <Typography>
            <strong>Método de Pago:</strong> {pedido.metodo_pago}
        </Typography>

        <Typography variant="h6" mt={1}>
            Total: ${pedido.total}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
            <strong>ID del pedido:</strong> {pedido.id}
        </Typography>
    </Paper>
  );
}
