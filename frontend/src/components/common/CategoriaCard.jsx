import { Box, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CategoriaCard({ categoria }) {
  const { id, nombre, imagen_url } = categoria;
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/categorias/${id}`)}
      sx={{
        width: 130,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      {/* Imagen redonda */}
      <Box
        sx={{
          width: 90,
          height: 90,
          margin: "0 auto",
          borderRadius: "50%",
          overflow: "hidden",
          transition: "transform 0.25s",
          "&:hover": {
            transform: "scale(1.06)",
          },
        }}
      >
        <img
          src={imagen_url || "/default_categoria.png"}
          alt={nombre}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Nombre con tooltip + ellipsis */}
      <Tooltip title={nombre} arrow placement="top">
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {nombre}
        </Typography>
      </Tooltip>
    </Box>
  );
}
