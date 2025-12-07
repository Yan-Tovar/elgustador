import { Box, Typography } from "@mui/material";
import {
  Build,
  CheckCircle,
  LocalShipping,
  Verified,
} from "@mui/icons-material";

export default function PedidoEstadoFlujo({ estado }) {
  const estados = [
    { key: "pagado", label: "Pagado", icon: <CheckCircle /> },
    { key: "procesando", label: "Procesando", icon: <Build /> },
    { key: "enviado", label: "Enviado", icon: <LocalShipping /> },
    { key: "entregado", label: "Entregado", icon: <Verified /> },
  ];

  const indexActual = estados.findIndex((e) => e.key === estado);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {estados.map((e, i) => {
        const completado = i <= indexActual && estado !== "cancelado";

        return (
          <Box
            key={e.key}
            title={e.label} // tooltip nativo
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0, sm: 1 },
              p: 1,
              width: { xs: 50, sm: "auto" }, // en móvil solo iconos
              height: 50,
              borderRadius: 2,
              background: completado
                ? "rgba(0,150,0,0.1)"
                : "rgba(0,0,0,0.05)",
              border: completado
                ? "2px solid green"
                : "1px solid rgba(0,0,0,0.2)",
            }}
          >
            {/* Icono */}
            <Box
              sx={{
                fontSize: { xs: 26, sm: 28 },
                color: completado ? "green" : "text.primary",
                display: "flex",
                alignItems: "center",
              }}
            >
              {e.icon}
            </Box>

            {/* Nombré SOLO en pantallas medianas hacia arriba */}
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: 14,
                fontWeight: 600,
                color: completado ? "green" : "text.primary",
                whiteSpace: "nowrap",
              }}
            >
              {e.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
