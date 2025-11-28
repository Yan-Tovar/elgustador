// src/components/navigation/Navbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeToggle from "../common/DarkModeToggle";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useContext } from "react";
import { CartAnimationContext } from "../../context/CartAnimationContext";

export default function Navbar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { cartRef } = useContext(CartAnimationContext);

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          Dashboard
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Carrito (OPCIÓN B: a la izquierda del modo oscuro) */}
          <IconButton
            color="inherit"
            aria-label="ver-carrito"
            ref={cartRef}
            sx={{ mr: 1 }}
          >
            <ShoppingCartOutlinedIcon />
          </IconButton>

          {/* Botón modo oscuro */}
          <Box>
            <DarkModeToggle />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
