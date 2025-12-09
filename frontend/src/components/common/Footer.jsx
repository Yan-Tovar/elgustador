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

  const enviarPqrs = () => {
    navigate("/pqrs");
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#2f2e2e",
        color: "white",
        mt: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        pt: 3,
        pb: 4,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Grid
          container
          spacing={2}
          sx={{
            m: 0,
            width: "100%",
            justifyContent: { xs: "center", md: "space-between" },
          }}
        >
          {/* Empresa */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "#ff3c00ff" }}
            >
              Nosotros
            </Typography>

            <Stack spacing={1} sx={{ mt: 2 }}>
              {/* Teléfono */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "#ff3c00ff" },
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <PhoneAndroidIcon fontSize="small" />
                <Typography variant="body2">+57 300 000 0000</Typography>
              </Stack>

              {/* Email */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "#ff3c00ff" },
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <EmailIcon fontSize="small" />
                <Typography variant="body2">contacto@empresa.com</Typography>
              </Stack>

              {/* Ubicación */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "#ff3c00ff" },
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">Colombia</Typography>
              </Stack>
            </Stack>

            {/* Redes */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 2,
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <FacebookIcon sx={{ cursor: "pointer" }} />
              <InstagramIcon sx={{ cursor: "pointer" }} />
              <TwitterIcon sx={{ cursor: "pointer" }} />
            </Stack>
          </Grid>

          {/* Atención al cliente */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "#ff3c00ff" }}
            >
              Atención al Cliente
            </Typography>

            <Stack spacing={1} sx={{ alignItems: { xs: "center", sm: "flex-start" } }}>
              {[
                "Ayuda",
                "Centro de ayuda",
                "Preguntas frecuentes",
                "Reportar actividad sospechosa",
              ].map((txt) => (
                <Link
                  key={txt}
                  underline="none"
                  color="#e0e0e0"
                  variant="body2"
                  sx={{ cursor: "pointer", "&:hover": { color: "#ff3c00ff" } }}
                >
                  {txt}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Políticas */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "#ff3c00ff" }}
            >
              Políticas
            </Typography>

            <Stack spacing={1} sx={{ alignItems: { xs: "center", sm: "flex-start" } }}>
              {[
                "Política de devolución y reembolso",
                "Política de propiedad intelectual",
                "Política de envíos",
                "Valor mínimo de pedido",
              ].map((txt) => (
                <Typography
                  key={txt}
                  variant="body2"
                  sx={{ cursor: "pointer", "&:hover": { color: "#ff3c00ff" } }}
                >
                  {txt}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Sobre la App */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "#ff3c00ff" }}
            >
              Sobre la App
            </Typography>

            <Stack spacing={1} sx={{ alignItems: { xs: "center", sm: "flex-start" } }}>
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", "&:hover": { color: "#ff3c00" } }}
                  onClick={enviarPqrs}
                >
                  Enviar PQRS
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", "&:hover": { color: "#ff3c00ff" } }}
                  onclick={{enviarPqrs}}
                >
                  Calificanos
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", "&:hover": { color: "#ff3c00ff" } }}
                  onclick={{enviarPqrs}}
                >
                  Centro de Ayuda
                </Typography>
            </Stack>
          </Grid>

          {/* Google Maps */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "#ff3c00ff" }}
            >
              Encuéntranos
            </Typography>

            <Box
              sx={{
                width: "100%",
                height: 160,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1763518350071!6m8!1m7!1slJPQ2aGYBSyYNLoA_QTzCw!2m2!1d4.404593408926065!2d-75.14743290993349!3f260.2213145501373!4f14.740064362471486!5f0.4000000000000002"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Box>
          </Grid>
        </Grid>

        {/* Métodos de pago */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            display: "flex",
            justifyContent: "center",
            borderTop: "1px solid #444",
          }}
        >
          <Stack direction="row" justifyContent="center" spacing={3} flexWrap="wrap">
            <img src="/pse.png" alt="PSE" style={{ height: 50 }} />
            <img src="/paypal.png" alt="PayPal" style={{ height: 50 }} />
          </Stack>

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
        </Box>
      </Container>
    </Box>
  );
}
