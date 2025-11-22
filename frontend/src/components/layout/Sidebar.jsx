import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { ShoppingCart, People, Settings } from "@mui/icons-material";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";

import LogoutButton from "../auth/LogoutButton";
import DarkModeToggle from "../common/DarkModeToggle";

const drawerWidth = 260;

export default function SideBar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Menú según rol
  const menuItems = [
    ...(user?.rol === "cliente"
      ? [
          { text: "Productos", icon: <ShoppingCart />, path: "/productos" },
          { text: "Mis pedidos", icon: <People />, path: "/mis-pedidos" },
        ]
      : []),

    ...(user?.rol === "empleado"
      ? [
          { text: "Gestión Pedidos", icon: <Settings />, path: "/gestion-pedidos" },
          { text: "Clientes", icon: <People />, path: "/clientes" },
        ]
      : []),

    ...(user?.rol === "admin"
      ? [
          { text: "Departamentos", icon: <Settings />, path: "/admin/departamentos" },
        ]
      : []),
  ];

  // Contenido del drawer (reutilizable)
  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Mi App
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <DarkModeToggle />
        <LogoutButton />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* APPBAR SUPERIOR (solo en móvil/tablet) */}
      {isMobile && (
        <AppBar
          position="fixed"
          color="default"
          elevation={1}
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Botón hamburguesa */}
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {user?.rol?.toUpperCase()}
            </Typography>

            <DarkModeToggle />
          </Toolbar>
        </AppBar>
      )}

      {/* DRAWER ESCRITORIO (permanente) */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* DRAWER MOVIL (deslizable) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* CONTENIDO DEL DASHBOARD */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: isMobile ? "64px" : 0, // espacio por el AppBar en móvil
          ml: !isMobile ? `${drawerWidth}px` : 0, // espacio por sidebar en desktop
          transition: "all 0.3s ease",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
