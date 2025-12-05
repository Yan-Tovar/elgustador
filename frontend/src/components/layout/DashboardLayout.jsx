// src/components/layout/DashboardLayout.jsx
import { useState } from "react";
import { Box, CssBaseline, Container } from "@mui/material";
import SideBar from "./SideRolBar";
import Navbar from "./Navbar";
import FooterBottomSheet from "./Footer";
import { CartAnimationProvider } from "../../context/CartAnimationContext";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CartAnimationProvider>
      <Box sx={{ display: "flex", width: "100%" }}>
        <CssBaseline />

        {/* SIDEBAR */}
        <SideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

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
