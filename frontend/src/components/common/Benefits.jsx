import React from "react";
import {
  Fade,
  Box,
  Container,
  Typography,
  Grid,
  Stack
} from "@mui/material";

export default function Benefits({ showContent }) {
  return (
    <Fade in={showContent} timeout={800}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 2,
        }}
      >
        {/* Barra con logo y nombre */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 4,
            py: 1,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              width: 100,
              height: 100,
              objectFit: "contain",
            }}
          />
          <Typography
            variant="h5"
            fontWeight="bold"
            color="text.secondary"
          >
            El Gustador
          </Typography>
        </Box>

        {/* Beneficios */}
        <Container sx={{ mb: 4 }}>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "gray", mb: 2 }}
          >
            Todos tus datos están protegidos
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {[
              {
                img: "productosIconoVerde.png",
                title: "Variedad de productos",
                subtitle: "Diversidad de precios",
              },
              {
                img: "camionIconoVerde.png",
                title: "Envíos Nacionales",
                subtitle: "Nivel Colombia",
              },
              {
                img: "tarjetaIconoVerde.png",
                title: "Medios de Pago",
                subtitle: "Diferentes Opciones",
              },
              {
                img: "verificadoIconoVerde.png",
                title: "Entrega garantizada",
                subtitle: "Seguimiento de pedidos",
              },
            ].map((item, i) => (
              <Grid item xs={6} sm={6} md={3} key={i}>
                <Stack
                  direction={{ xs: "column", sm: "column", md: "row" }}
                  spacing={1}
                  alignItems="center"
                  textAlign={{ xs: "center", md: "left" }}
                >
                  <Box
                    component="img"
                    src={`/${item.img}`}
                    alt={item.title}
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: "contain",
                      mb: { xs: 1, md: 0 },
                    }}
                  />

                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        color: "rgba(43, 110, 57, 0.94)",
                        fontSize: { xs: "0.85rem", sm: "0.9rem" },
                      }}
                    >
                      {item.title}
                    </Typography>

                    {item.subtitle && (
                      <Typography
                        variant="caption"
                        color="text.primary"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        {item.subtitle}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
}
