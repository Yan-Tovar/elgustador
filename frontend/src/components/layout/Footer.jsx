// src/components/layout/Footer.jsx
import { Box, Typography, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: 2,
        py: 2,
        textAlign: "center",
        bgcolor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Mi App — Todos los derechos reservados
      </Typography>
    </Box>
  );
}
