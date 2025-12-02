// src/components/layout/DashboardLayout.jsx
import { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import FooterBottomSheet from "./Footer";
import { CartAnimationProvider } from "../../context/CartAnimationContext";

export default function DashboardLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <CartAnimationProvider>
      <Box sx={{ display: "flex" }}>
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
          }}
        >
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

          <Box sx={{ flexGrow: 1, p: 1 }}>{children}</Box>

          
        </Box>
      </Box>
      <div id="footer-sentinel" style={{ height: 1 }} />
      <FooterBottomSheet />
    </CartAnimationProvider>
  );
}
