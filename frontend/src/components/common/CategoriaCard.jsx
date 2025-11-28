import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CategoriaCard({ categoria }) {
  const { id, nombre, imagen_url, fecha_creacion } = categoria;

  const navigate = useNavigate();

  const formattedDate = new Date(fecha_creacion).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      onClick={() => navigate(`/categorias/${id}`)}
      sx={{
        width: "100%",
        maxWidth: 240,
        minWidth: 240,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
        transition: "0.25s",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
        },
        textAlign: "center",
        paddingY: 2,
      }}
    >
      {/* Imagen centrada */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <img
          src={imagen_url || "/default_categoria.png"}
          alt={nombre}
          style={{
            width: "90px",
            height: "90px",
            objectFit: "contain",
            borderRadius: "12px",
          }}
        />
      </Box>

      <CardContent sx={{ paddingX: 2, paddingBottom: 1 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {nombre}
        </Typography>
      </CardContent>
    </Card>
  );
}
