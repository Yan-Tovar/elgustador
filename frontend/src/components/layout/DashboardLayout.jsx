// src/components/layout/DashboardLayout.jsx
import { useContext, useEffect, useState } from "react";
import { Box, CssBaseline, Container } from "@mui/material";
import SideBar from "./SideRolBar";
import Navbar from "./Navbar";
import FooterBottomSheet from "./Footer";
import { CartAnimationProvider } from "../../context/CartAnimationContext";
import NotificationsDrawer from "../notifications/NotificationsDrawer";
import OnboardingTutorial from "../common/OnboardingTutorial";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Verifica si el tutorial ya fue mostrado
    const tutorialDone = localStorage.getItem("tutorial_done");

    if (!tutorialDone) {
      // Solo mostrar el tutorial la primera vez después del login
      setShowTutorial(true);
    }
  }, [user]);

  const handleTutorialClose = () => {
    setShowTutorial(false);
    localStorage.setItem("tutorial_done", "true"); // Marca que ya lo vio
  };

  return (
    <CartAnimationProvider>
      {showTutorial && (
      <OnboardingTutorial
        open={showTutorial}
        onClose={handleTutorialClose}
      />
      )}
      <Box sx={{ display: "flex", width: "100%" }}>
        <CssBaseline />

        {/* SIDEBAR */}
        <SideBar id="sidebar-menu" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* PANEL DERECHO DE NOTIFICACIONES */}
        <NotificationsDrawer
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
        />

        {/* CONTENIDO PRINCIPAL */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",

            // Ajuste de padding según tamaño de pantalla
            px: { xs: 1, sm: 2, md: 3 },

            // Cuando el sidebar está abierto en desktop, empuja el contenido
            ml: {
              xs: 0,
              md: sidebarOpen ? "240px" : "0px",
            },

            transition: "margin-left 0.3s ease",
          }}
        >
          <Navbar
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenNotificaciones={() => setNotifOpen(true)}
          />

          {/* CONTENEDOR RESPONSIVE DEL CONTENIDO */}
          <Container
            maxWidth="xl"
            disableGutters
            sx={{
              mt: 2,
              flexGrow: 1,
              overflowX: "hidden",
              overflowY: "auto",

              // Scroll interno para páginas largas
              pb: 4,
            }}
          >
            {children}
          </Container>
          
        </Box>
      </Box>

      <div id="footer-sentinel" style={{ height: 1 }} />
      <FooterBottomSheet />
    </CartAnimationProvider>
  );
}
