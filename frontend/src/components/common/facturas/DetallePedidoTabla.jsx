import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";

export default function DetallePedidoTabla({ detalle }) {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Detalle del pedido
      </Typography>

      {detalle.length === 0 ? (
        <Typography>No hay detalles para este pedido.</Typography>
      ) : (
        <>
          {/* ===================== DESKTOP / TABLET ===================== */}
          {!isMobile && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="right">Precio unitario</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {detalle.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.producto.nombre}</TableCell>
                    <TableCell align="center">{item.cantidad}</TableCell>
                    <TableCell align="right">
                      ${item.precio_unitario}
                    </TableCell>
                    <TableCell align="right">
                      ${item.precio_total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* ===================== MÓVIL ===================== */}
          {isMobile && (
            <Box>
              {detalle.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    border: "1px solid #eee",
                    borderRadius: 3,
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Typography fontWeight={600}>
                    {item.producto.nombre}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">
                    Cantidad: <strong>{item.cantidad}</strong>
                  </Typography>

                  <Typography variant="body2">
                    Precio unitario:{" "}
                    <strong>${item.precio_unitario}</strong>
                  </Typography>

                  <Typography variant="body2">
                    Total: <strong>${item.precio_total}</strong>
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}
