// src/components/common/carrusel/CarruselListado.jsx
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function CarruselListado({
  items,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
}) {
  const { user } = useContext(AuthContext); // <--- para detectar rol

  const isAdmin = user?.rol === "admin";

  return (
    <Box width="100%">
      {/* Contenedor del carrusel */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          pb: 2,
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 10,
          },
        }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            sx={{
              minWidth: { xs: "80%", sm: "60%", md: "45%", lg: "30%" },
              scrollSnapAlign: "start",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={
                item.imagen?.startsWith("http")
                  ? item.imagen
                  : `${process.env.REACT_APP_API_URL}${item.imagen}`
              }
              alt={item.titulo}
            />
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {item.titulo}
              </Typography>

              {item.descripcion && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.descripcion}
                </Typography>
              )}

              {item.url_destino && (
                <Typography
                  component="a"
                  href={item.url_destino}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "primary.main",
                    textDecoration: "underline",
                    fontSize: "0.9rem",
                  }}
                >
                  Ir al enlace →
                </Typography>
              )}

              {/* Botones SOLO para admin */}
              {isAdmin && (
                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onEdit(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={() => onDelete(item.id)}
                  >
                    Eliminar
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* PAGINACIÓN para administrador */}
      {hasMore && isAdmin && (
        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={onLoadMore}>
            Cargar más
          </Button>
        </Box>
      )}
    </Box>
  );
}
