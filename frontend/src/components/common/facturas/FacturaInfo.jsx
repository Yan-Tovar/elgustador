import { Paper, Typography, Button, Box, Divider } from "@mui/material";

export default function FacturaInfo({
  factura,
  enviandoId,
  onDescargar,
  onEnviarCorreo,
}) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="text" >
        Número de Factura: <b>{factura.numero_factura}</b> 
      </Typography>

      <Typography sx={{ mt: 1 }}>
        Iva Incluído: <b>${factura.impuestos}</b>
      </Typography>

      <Typography sx={{ mt: 1 }}>
        Subtotal: <b>${factura.subtotal}</b>
      </Typography>

      <Typography sx={{ mt: 1 }}>
        Costo Total: <b>${factura.total}</b>
      </Typography>

      <Typography>Fecha: {new Date(factura.fecha).toLocaleString()}</Typography>

      <Divider>Opciones</Divider>
      <Box
        sx={{
            diplay: "flex",
            justifyContent: "center",
            padding: 1,
        }}
      >

      <Button
        variant="outlined"
        color="black"
        size="small"
        onClick={() => onDescargar(factura.id)}
        sx={{m: 1}}
      >
        Descargar
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        disabled={enviandoId === factura.id}
        onClick={() => onEnviarCorreo(factura.id)}
        sx={{m: 1}}
      >
        {enviandoId === factura.id ? "Enviando..." : "Enviar Email"}
      </Button>

    </Box>
    </Paper>
  );
}
