import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function DetallePedidoTabla({ detalle }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Detalle del pedido
      </Typography>

      {detalle.length === 0 ? (
        <Typography>No hay detalles para este pedido.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio unitario</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {detalle.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.producto.nombre}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>${item.precio_unitario}</TableCell>
                <TableCell>${item.precio_total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
