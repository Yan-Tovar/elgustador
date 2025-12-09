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
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import {
  ShoppingCart,
  Category,
  Inventory2,
  LocalOffer,
  NotesOutlined,
  Receipt,
  People,
  PersonPin,
  ExpandLess,
  ExpandMore,
  Home,
  Store,
  Map,
  MapOutlined,
  FolderCopy,
  Checklist,
  Note
} from "@mui/icons-material";

import { useContext, useEffect, useState } from "react";
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

  const [openUserMenu, setOpenUserMenu] = useState(true); // ← Para admin queda abierto

  const primerNombre = user?.nombre
    ? user.nombre.trim().split(" ")[0]
    : "Usuario";

  // -----------------------------
  // ICONOS
  // -----------------------------
  const icons = {
    productos: <Store />,
    categorias: <Category />,
    carrito: <ShoppingCart />,
    pedidos: <Checklist />,
    facturas: <Receipt />,
    perfil: <PersonPin />,
    notas: <NotesOutlined />,
    departamentos: <Map />,
    municipios: <MapOutlined />,
    ofertas: <LocalOffer />,
    adminProductos: <Inventory2 />,
    carrusel: <FolderCopy />,
    adminPedidos: <Checklist />,
    adminFacturas: <Receipt />,
    adminUsuarios: <People />,
    dashboard: <Home />,
    adminPqrs: <Note />,
  };

  // -----------------------------
  // Ajuste de footer
  // -----------------------------
  const [offsetBottom, setOffsetBottom] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer-sentinel");
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      const isNearFooter = rect.top < window.innerHeight;

      if (isNearFooter) {
        setOffsetBottom(window.innerHeight - rect.top + 20);
      } else {
        setOffsetBottom(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // -----------------------------
  // ITEMS POR ROL
  // -----------------------------
  const adminItems =
    user?.rol === "admin"
      ? [
          { text: "Dashboard", icon: icons.dashboard, path: "/admin/dashboard" },
          { text: "Departamentos", icon: icons.departamentos, path: "/admin/departamentos" },
          { text: "Municipios", icon: icons.municipios, path: "/admin/municipios" },
          { text: "Categorías", icon: icons.categorias, path: "/admin/categorias" },
          { text: "Carrusel", icon: icons.carrusel, path: "/admin/carrusel" },
          { text: "Productos", icon: icons.adminProductos, path: "/admin/productos" },
          { text: "Ofertas", icon: icons.ofertas, path: "/admin/ofertas" },
          { text: "Empleado Pedidos", icon: icons.adminPedidos, path: "/empleado/pedidos" },
          { text: "Admin Pedidos", icon: icons.adminPedidos, path: "/admin/pedidos" },
          { text: "Admin Facturas", icon: icons.adminFacturas, path: "/admin/facturas" },
          { text: "Usuarios", icon: icons.adminUsuarios, path: "/admin/usuarios" },
          { text: "Pqrs", icon: icons.adminPqrs, path: "/admin/pqrs" },
        ]
      : [];

  // CLIENTE siempre ve estos (menos Notas)
  const clientItems = [
    { text: "Inicio", icon: icons.productos, path: "/" },
    { text: "Productos", icon: icons.productos, path: "/productos" },
    { text: "Categorías", icon: icons.categorias, path: "/categorias" },
    { text: "Carrito", icon: icons.carrito, path: "/carrito" },
    { text: "Pedidos", icon: icons.pedidos, path: "/pedidos" },
    { text: "Facturas", icon: icons.facturas, path: "/facturas" },
    { text: "Perfil", icon: icons.perfil, path: "/perfil" },
  ];

  // EMPLEADO ve lo de cliente + notas + adminPedidos
  const employeeItems =
    user?.rol === "empleado"
      ? [
          ...clientItems,
          { text: "Notas", icon: icons.notas, path: "/notas" },
          { text: "Gestion Pedidos", icon: icons.adminPedidos, path: "/empleado/pedidos" },
        ]
      : [];

  // -----------------------------
  // SIDEBAR CONTENT
  // -----------------------------
  const drawerContent = (
    <Box   sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ bgcolor: theme.palette.background.paper }}>
        <Typography variant="h6" fontWeight="bold">
          Hola {primerNombre}
        </Typography>
      </Toolbar>

      <Divider />

      <Box id="sidebar-menu" sx={{ overflowY: "auto", flexGrow: 1 }}>
        <List>
          {/* ADMIN ITEMS */}
          {user?.rol === "admin" && (
            <>
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: "14px",
                  fontWeight: "bold",
                  opacity: 0.6,
                }}
              >
                Panel Administrativo
              </Typography>

              {adminItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) toggleDrawer();
                  }}
                  sx={{cursor: "pointer"}}
                >
                  <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}

              <Divider sx={{ my: 1 }} />
            </>
          )}

          {/* ADMIN → botón Usuario desplegable */}
          {user?.rol === "admin" && (
            <>
              <ListItem button onClick={() => setOpenUserMenu(!openUserMenu)} sx={{cursor: "pointer"}}>
                <ListItemIcon sx={{ color: theme.palette.info.main }}>
                  <PersonPin />
                </ListItemIcon>
                <ListItemText primary="Usuario" />
                {openUserMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openUserMenu} timeout="auto" unmountOnExit>
                {clientItems.map((item) => (
                  <ListItem
                    button
                    key={item.text}
                    sx={{ pl: 4, cursor: "pointer" }}
                    onClick={() => navigate(item.path)}
                  >
                    <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                      {icons[item.text.toLowerCase()] || item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </Collapse>
            </>
          )}

          {/* EMPLEADO → items fijos */}
          {user?.rol === "empleado" &&
            employeeItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{cursor: "pointer"}}
              >
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}

          {/* CLIENTE → items fijos (sin notas) */}
          {user?.rol === "cliente" &&
            clientItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{cursor: "pointer"}}
              >
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <DarkModeToggle />
        <LogoutButton />
      </Box>
    </Box>
  );

  // -----------------------------
  // DRAWERS
  // -----------------------------
  return (
    <>
      {/* Mobile toggle */}
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: theme.zIndex.drawer + 3,
          }}
          id="mobile-sidebar-toggle"
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Desktop */}
      {!isMobile && (
        <Drawer
          id="sidebar-menu"
          variant="permanent"
          sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              top: NAVBAR_HEIGHT,
              height: `calc(100vh - ${NAVBAR_HEIGHT}px - ${offsetBottom}px)`,
              transition: "height 0.25s ease",
              borderTopRightRadius: "15px",
              borderBottomRightRadius: "15px",
              overflow: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggleDrawer}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              top: NAVBAR_HEIGHT,
              height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
              borderTopRightRadius: "15px",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
