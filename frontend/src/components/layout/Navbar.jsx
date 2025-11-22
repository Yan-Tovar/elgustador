// src/components/navigation/Navbar.jsx
import { AppBar, Toolbar, Typography, Box, IconButton, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeToggle from "../common/DarkModeToggle";
import { useState } from "react";

export default function Navbar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <AppBar
      position="statick"
      elevation={1}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Branding o botón menú para móvil (SideBar ya tiene el suyo) */}
        <Typography variant="h6" fontWeight="bold">
          Dashboard
        </Typography>

        {/* Botón modo oscuro */}
        <Box>
          <DarkModeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
