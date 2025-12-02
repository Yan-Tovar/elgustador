// src/components/navigation/SideBar.jsx
import {
  Box,
  Drawer,
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
import {
  ShoppingCart,
  People,
  Settings,
  Category,
  Inventory2,
  LocalOffer,
  NotesOutlined,
  AutoAwesomeMosaic,
  ScatterPlot,
  ViewStream,
  Receipt,
  PersonPin,
} from "@mui/icons-material";

import { useContext, useEffect, useState, useRef  } from "react";

import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import DarkModeToggle from "../common/DarkModeToggle";


const drawerWidth = 260;
const NAVBAR_HEIGHT = 70;

export default function SideBar() {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  // --------------------------------------------
  // OBTENER PRIMER NOMBRE DEL USUARIO
  // --------------------------------------------
  const primerNombre = user?.nombre
    ? user.nombre.trim().split(" ")[0]
    : "Usuario";

  // --------------------------------------------
  // MENÚ POR ROLES
  // --------------------------------------------
  const menuItems = [
    ...(user?.rol === "cliente"
      ? [
          { text: "Productos", icon: <AutoAwesomeMosaic />, path: "/productos" },
          { text: "Categorias", icon: <ScatterPlot />, path: "/categorias" },
          { text: "Carrito", icon: <ShoppingCart />, path: "/carrito" },
          { text: "Pedidos", icon: <ViewStream />, path: "/pedidos" },
          { text: "Facturas", icon: <Receipt />, path: "/facturas" },
          { text: "Perfil", icon: <PersonPin />, path: "/perfil" },
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
          { text: "Categorías", icon: <Category />, path: "/admin/categorias" },
          { text: "Productos", icon: <Inventory2 />, path: "/admin/productos" },
          { text: "Comprar Productos", icon: <Inventory2 />, path: "/productos" },
          { text: "Ofertas", icon: <LocalOffer />, path: "/admin/ofertas" },
          { text: "Notas", icon: <NotesOutlined />, path: "/notas" },
          { text: "Carrito", icon: <NotesOutlined />, path: "/carrito" },
          { text: "Facturas", icon: <NotesOutlined />, path: "/facturas" },
          { text: "Pedidos", icon: <NotesOutlined />, path: "/pedidos" },
          { text: "Perfil", icon: <NotesOutlined />, path: "/perfil" },
          { text: "Carrito Eventos", icon: <NotesOutlined />, path: "/carrito-eventos" },
          { text: "Admin Pedidos", icon: <NotesOutlined />, path: "/admin/pedidos" },
          { text: "Admin Facturas", icon: <NotesOutlined />, path: "/admin/facturas" },
        ]
      : []),
  ];

  // --------------------------------------------
  // CONTENIDO DEL DRAWER
  // --------------------------------------------
  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER FIJO */}
      <Toolbar
        sx={{
          position: "relative",
          top: 0,
          zIndex: 10,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Hola {primerNombre}
        </Typography>
      </Toolbar>

      <Divider />

      {/* ZONA SCROLLEABLE */}
      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (isMobile) toggleDrawer();
              }}
              sx={{
                cursor:"pointer"
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      {/* FOOTER FIJO */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <DarkModeToggle />
        <LogoutButton />
      </Box>
    </Box>
  );

  const [stickToTop, setStickToTop] = useState(true);

  useEffect(() => {
    const sentinel = document.getElementById("footer-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Cuando el footer aparece → el sidebar debe subir con el contenido
        setStickToTop(!entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Menu mobile */}
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: theme.zIndex.drawer + 3,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              height: stickToTop
                ? `calc(100vh - ${NAVBAR_HEIGHT}px)`  // Comportamiento normal fijo
                : "calc(100vh - ${NAVBAR_HEIGHT}px)",                            // Cuando llega al footer
              top: stickToTop ? `${NAVBAR_HEIGHT}px` : "auto",
              position: stickToTop ? "fixed" : "absolute",
              bottom: stickToTop ? "auto" : "10px",
              overflow: "hidden",
              borderTopRightRadius: "15px",
              borderBottomRightRadius: "15px"
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer Mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggleDrawer}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
              top: `${NAVBAR_HEIGHT}px`,
              overflow: "hidden",
              borderTopRightRadius:"15px",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
