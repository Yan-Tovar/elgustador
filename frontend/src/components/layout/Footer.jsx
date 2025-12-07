import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";

// ===== MATERIAL UI ICONS =====
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
// =================================

export default function Footer() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(true);

  return (
    <Box
      component="footer"
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: 10,
        backgroundColor: "#2f2e2e",
        color: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        pt: 3,
        pb: 4,
        maxHeight: "95vh",
        overflow: "hidden",
        top:"85vh",
        mt: "auto",
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Footer legal */}
          <Box sx={{ ml: 4 }}>
            <Typography variant="body2" align="center" sx={{ color: "#cfcfcf" }}>
              © {new Date().getFullYear()} Appelgustador. Todos los derechos reservados.
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1, color: "#ff3c00ff" }}>
              Dirección: Ibagué Tolima | Tel: +57 300 123 4567
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1, color: "#e0e0e0" }}>
              contacto@appelgustador.com
            </Typography>
          </Box>
      </Container>
    </Box>
  );
}
