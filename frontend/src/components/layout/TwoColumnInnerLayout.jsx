// src/components/layout/TwoColumnInnerLayout.jsx
import { Box } from "@mui/material";

export default function TwoColumnInnerLayout({ left, right }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr",       // tablets → 1 columna
          lg: "65% 30%",   // desktop → división interna real
        },
      }}
    >
      {/* COLUMNA IZQUIERDA */}
      <Box>{left}</Box>

      {/* COLUMNA DERECHA */}
      <Box
        sx={{
          position: "relative",
          top: 0,
        }}
      >
        {right}
      </Box>
    </Box>
  );
}
