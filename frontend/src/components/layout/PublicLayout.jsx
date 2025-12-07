// src/components/layout/PublicLayout.jsx
import { Box } from "@mui/material";
import PublicNavbar from "../common/PublicNavbar";
import Footer from "../common/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />
      <Box component="main" sx={{ minHeight: "80vh" }}>
        {children}
      </Box>
      <Footer />
    </>
  );
}