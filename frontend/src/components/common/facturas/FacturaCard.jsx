// src/components/facturas/FacturaCard.jsx
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function FacturaCard({ factura, enviandoId, onDescargar, onEnviar }) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography fontWeight={700}>Factura #{factura.numero_factura}</Typography>
      <Typography>Total: ${factura.total.toLocaleString()}</Typography>

      <Typography variant="body2" color="gray">
        Fecha: {new Date(factura.fecha).toLocaleString()}
      </Typography>

      <Box display="flex" flexDirection="column" gap={1} mt={2}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`/factura/${factura.id}`)}
          endIcon={<ArrowForwardIosIcon />}
        >
          Ver Detalle
        </Button>

        <Button
          variant="outlined"
          color="black"
          fullWidth
          startIcon={<PictureAsPdfIcon />}
          onClick={onDescargar}
        >
          Descargar PDF
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          startIcon={<EmailIcon />}
          disabled={enviandoId === factura.id}
          onClick={onEnviar}
        >
          {enviandoId === factura.id ? "Enviando..." : "Enviar Email"}
        </Button>
      </Box>
    </Paper>
  );
}
