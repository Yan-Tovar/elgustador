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
import { ShoppingCart, People, Settings } from "@mui/icons-material";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import DarkModeToggle from "../common/DarkModeToggle";

const drawerWidth = 260;

export default function SideBar() {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  // Items por rol
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

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
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
              if (isMobile) toggleDrawer();
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
    <>
      {/* Botón hamburguesa (solo en móvil) */}
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: "fixed", top: 10, left: 10, zIndex: theme.zIndex.drawer + 2 }}
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
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer Móvil */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggleDrawer}
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
    </>
  );
}
