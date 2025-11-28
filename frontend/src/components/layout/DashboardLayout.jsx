// src/components/layout/DashboardLayout.jsx
import { Box, CssBaseline } from "@mui/material";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CartAnimationProvider } from "../../context/CartAnimationContext";

export default function DashboardLayout({ children }) {
  return (
    <CartAnimationProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* SIDEBAR */}
        <SideBar />

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
          <Navbar />

          <Box sx={{ flexGrow: 1, p: 1 }}>{children}</Box>

          <Footer />
        </Box>
      </Box>
    </CartAnimationProvider>
  );
}
