// src/components/navigation/Navbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";

import Badge from "@mui/material/Badge";

import { CartAnimationContext } from "../../context/CartAnimationContext";
import { CarritoContext } from "../../context/CarritoContext";
import useNotificaciones from "../../hooks/useNotificaciones";

import DarkModeToggle from "../common/DarkModeToggle";
import LogoutButton from "../auth/LogoutButton";

export default function Navbar({ onOpenSidebar, onOpenNotificaciones }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cartRef } = useContext(CartAnimationContext);
  const { carrito } = useContext(CarritoContext);

  const { notificaciones } = useNotificaciones();
  const noLeidas = notificaciones.filter((n) => !n.leido).length;

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Estado menú del perfil
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const NAVBAR_HEIGHT = 70;

  // Evitar errores si carrito es null o undefined
  const totalItems = carrito?.items
    ? carrito.items.reduce((acc, item) => acc + item.cantidad, 0)
    : 0;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          boxShadow: "none",
          zIndex: theme.zIndex.drawer + 2,
          height: NAVBAR_HEIGHT,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* ================= IZQUIERDA ================= */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton onClick={onOpenSidebar} color="inherit" sx={{ mr: 1 }}>
                {/* Aquí puedes agregar MenuIcon si lo deseas */}
              </IconButton>
            )}

            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              El Gustador
            </Typography>
          </Box>

          {/* ================= DERECHA ================= */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* CARRITO */}
            <IconButton color="inherit" ref={cartRef} onClick={() => navigate("/carrito")}>
              <Badge
                badgeContent={totalItems}
                color="error"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>

            {/* NOTIFICACIONES */}
            <IconButton onClick={onOpenNotificaciones}>
              <Badge badgeContent={noLeidas} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Toggle Modo Claro / Oscuro */}
            <DarkModeToggle />

            {/* PERFIL */}
            <IconButton color="inherit" onClick={handleOpenMenu}>
              <AccountCircle />
            </IconButton>

            {/* MENÚ PERFIL */}
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  navigate("/perfil");
                }}
              >
                Mi perfil
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  navigate("/perfil");
                }}
              >
                Cambiar Dirección
              </MenuItem>

              <MenuItem onClick={handleCloseMenu}>
                <LogoutButton fullWidth />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Espacio para evitar que el contenido quede debajo del navbar */}
      <Box sx={{ height: NAVBAR_HEIGHT }} />
    </>
  );
}
