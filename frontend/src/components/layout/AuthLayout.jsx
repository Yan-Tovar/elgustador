import React from "react";
import { Box, Card, Grid, Divider, Stack } from "@mui/material";
import Benefits from "../common/Benefits";
import Footer from "../common/Footer";
import BotonesTerminosPoliticas from "../common/BotonesTerminosPoliticas";
import CustomSnackbar from "../common/CustomSnackbar";

/**
 * Layout para páginas de autenticación (login, registro, recuperar password, etc.)
 * Uso:
 * <AuthLayout
 *    showContent={true}
 *    snackbar={snackbar}
 *    setSnackbar={setSnackbar}
 *    left={ <TuFormulario/> }
 *    right={ <TuInformacion/> }
 * />
 */
export default function AuthLayout({ showContent, snackbar, setSnackbar, left, right }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Encabezado con beneficios */}
      <Benefits showContent={showContent} />

      {/* Bloque central */}
      <Box sx={{ mt: 2 }}>
        <Card
          elevation={2}
          sx={{
            mb: 1,
            p: 2,
            borderRadius: 3,
            mx: "auto",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* Izquierda (formulario) */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                overflowX: "hidden",
                py: 1,
                flex: 2,
                maxWidth: "600px",
                width: "100%",
                mx: "auto",
              }}
            >
              <Grid item xs={12} md={12}>
                {left}
              </Grid>
            </Box>

            {/* Derecha (información) */}
            <Box
              sx={{
                display: "flex",              
                justifyContent: "center",     
                flex: 1,
                flexDirection: "column",
                maxWidth: "500px",
                width: "100%",                
                mx: "auto",                   
                textAlign: "center",          
              }}
            >
              <Grid item xs={12} md={12}>
                <Divider sx={{ mb: 2 }}>Información</Divider>
                <Stack spacing={1}>{right}</Stack>
              </Grid>
            </Box>
          </Box>

          {/* Legal inferior */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <BotonesTerminosPoliticas />
          </Box>
        </Card>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Snackbar */}
      <CustomSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </Box>
  );
}
