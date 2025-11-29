import {
  Box,
  Typography,
  useTheme,
  Card,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export default function PedidoProductoCard({ item }) {
  const theme = useTheme();
  const producto = item.producto;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        p: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardActionArea
        component={Link}
        to={`/producto/${producto.id}`}
        sx={{
          display: "flex",
          flexWrap: { xs: "wrap", md: "nowrap" }, 
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Imagen */}
        <Box
          sx={{
            width: 90,
            height: 90,
            flexShrink: 0,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: theme.shadows[3],
          }}
        >
          <img
            src={producto.imagen1}
            alt={producto.nombre}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Información del producto */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color="text.primary"
            sx={{
              mb: 0.5,
              whiteSpace: { xs: "normal", md: "nowrap" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: { xs: 16, md: 18 },
            }}
          >
            {producto.nombre}
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: 15 }}>
            <strong>Precio unitario:</strong> ${item.precio_unitario}
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: 15 }}>
            <strong>Cantidad:</strong> {item.cantidad}
          </Typography>

          <Typography
            color={theme.palette.primary.main}
            fontWeight={700}
            sx={{ mt: 1, fontSize: { xs: 17, md: 18 } }}
          >
            Subtotal: ${(item.cantidad * item.precio_unitario).toFixed(2)}
          </Typography>
        </Box>

        {/* Icono decorativo */}
        <ShoppingBagIcon
          sx={{
            fontSize: 32,
            color: theme.palette.secondary.main,
            opacity: 0.7,
            flexShrink: 0,
            display: { xs: "none", md: "block" },
          }}
        />
      </CardActionArea>
    </Card>
  );
}
