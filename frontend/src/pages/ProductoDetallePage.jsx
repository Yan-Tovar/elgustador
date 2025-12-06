import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { styled } from "@mui/material/styles";

import DashboardLayout from "../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../components/layout/TwoColumnInnerLayout";

import { fetchProducto } from "../services/productosService";
import { addToCarrito } from "../services/carritoService";         // <── CORRECTO
import { CarritoContext } from "../context/CarritoContext";
import { CartAnimationContext } from "../context/CartAnimationContext";

// ---- PRICE STYLE ----
const Price = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 800,
  fontSize: "1.6rem",
}));

export default function ProductoDetallePage() {
  const { id } = useParams();
  const { loadCarrito } = useContext(CarritoContext);              // <── Solo lo que SÍ existe
  const { cartRef } = useContext(CartAnimationContext);

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const mainImgRef = useRef(null);
  const addBtnRef = useRef(null);
  const plusBtnRef = useRef(null);
  const minusBtnRef = useRef(null);

  useEffect(() => {
    cargarProducto();
    setCantidad(1);
    setSelectedImgIndex(0);
  }, [id]);

  // =========================
  //  CARGAR PRODUCTO
  // =========================
  const cargarProducto = async () => {
    setLoading(true);
    try {
      const res = await fetchProducto(id);
      setProducto(res.data);
    } catch (err) {
      console.error("Error cargando producto:", err);
      setSnackbar({
        open: true,
        message: "Error cargando el producto",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  //  BUBBLES ANIMATION
  // =========================
  const spawnBubble = (originEl, color = "#4caf50") => {
    if (!originEl) return;
    const rect = originEl.getBoundingClientRect();

    const bubble = document.createElement("div");
    bubble.style.position = "fixed";
    bubble.style.left = `${rect.left + rect.width / 2}px`;
    bubble.style.top = `${rect.top + rect.height / 2}px`;
    bubble.style.width = "14px";
    bubble.style.height = "14px";
    bubble.style.borderRadius = "50%";
    bubble.style.background = color;
    bubble.style.zIndex = 9999;
    bubble.style.opacity = "1";
    bubble.style.transform = "translateY(0)";
    bubble.style.transition =
      "transform 600ms cubic-bezier(.2,.8,.2,1), opacity 600ms linear";

    document.body.appendChild(bubble);

    requestAnimationFrame(() => {
      bubble.style.transform = "translateY(-60px) scale(1.2)";
      bubble.style.opacity = "0";
    });

    setTimeout(() => bubble.remove(), 650);
  };

  // =========================
  //   FLY TO CART
  // =========================
  const flyToCart = () => {
    const target = cartRef?.current;
    const imgEl = mainImgRef.current;
    if (!imgEl || !target) return Promise.resolve(true);

    const rectImg = imgEl.getBoundingClientRect();
    const rectCart = target.getBoundingClientRect();

    const clone = imgEl.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = `${rectImg.left}px`;
    clone.style.top = `${rectImg.top}px`;
    clone.style.width = `${rectImg.width}px`;
    clone.style.height = `${rectImg.height}px`;
    clone.style.objectFit = "contain";
    clone.style.zIndex = 9999;
    clone.style.transition =
      "transform 700ms cubic-bezier(.2,.8,.2,1), left 700ms linear, top 700ms linear";

    document.body.appendChild(clone);

    const dx =
      rectCart.left + rectCart.width / 2 - (rectImg.left + rectImg.width / 2);
    const dy =
      rectCart.top + rectCart.height / 2 - (rectImg.top + rectImg.height / 2);

    requestAnimationFrame(() => {
      clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.15)`;
      clone.style.opacity = "0.4";
    });

    return new Promise((resolve) =>
      setTimeout(() => {
        clone.remove();
        resolve(true);
      }, 750)
    );
  };

  // =========================
  //   CANTIDAD
  // =========================
  const handleIncrement = () => {
    if (!producto) return;
    const next = Math.min(producto.stock, cantidad + 1);
    if (next === cantidad) {
      spawnBubble(plusBtnRef.current, "#ff9800");
      setSnackbar({
        open: true,
        message: `Stock máximo disponible (${producto.stock})`,
        severity: "warning",
      });
      return;
    }
    spawnBubble(plusBtnRef.current);
    setCantidad(next);
  };

  const handleDecrement = () => {
    const next = Math.max(1, cantidad - 1);
    spawnBubble(minusBtnRef.current, "#ff9800");
    setCantidad(next);
  };

  // =========================
  //   AGREGAR AL CARRITO
  // =========================
  const handleAddToCart = async () => {
    if (!producto) return;

    if (producto.stock <= 0) {
      setSnackbar({
        open: true,
        message: "Producto sin stock",
        severity: "error",
      });
      return;
    }

    spawnBubble(addBtnRef.current);

    try {
      await flyToCart();

      const res = await addToCarrito({
        producto_id: producto.id,
        cantidad,
      });

      await loadCarrito();

      setSnackbar({
        open: true,
        message: res.data?.warning
          ? res.data.message
          : "Producto agregado al carrito",
        severity: res.data?.warning ? "warning" : "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error al agregar al carrito",
        severity: "error",
      });
    }
  };

  if (loading || !producto) {
    return (
      <DashboardLayout>
        <Typography sx={{ p: 3 }}>Cargando producto...</Typography>
      </DashboardLayout>
    );
  }

  const imagenes = [
    producto.imagen1,
    producto.imagen2,
    producto.imagen3,
  ].filter(Boolean);

  return (
    <DashboardLayout>
      <Box p={2}>
        <TwoColumnInnerLayout
          left={
            <Box>
              <Card sx={{ p: 2, mb: 2 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    {producto.nombre}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Código {producto.codigo}
                  </Typography>

                  <Price>${producto.precio}</Price>

                  {producto.precio_anterior && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      Antes: ${producto.precio_anterior}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    sx={{ mt: 1, display: "flex", gap: 1, alignItems: "center" }}
                  >
                    <LocalShippingIcon fontSize="small" /> Envío estimado: 3–5 días
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    Stock:{" "}
                    <strong
                      style={{
                        color:
                          producto.stock > 0 ? "#1EBE4E" : "#d32f2f",
                      }}
                    >
                      {producto.stock}
                    </strong>
                  </Typography>

                  {/* Cantidad */}
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    <IconButton
                      onClick={handleDecrement}
                      ref={minusBtnRef}
                      disabled={cantidad <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography variant="h6">{cantidad}</Typography>

                    <IconButton
                      onClick={handleIncrement}
                      ref={plusBtnRef}
                      disabled={cantidad >= producto.stock}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  {/* Botones */}
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={handleAddToCart}
                      ref={addBtnRef}
                      disabled={producto.stock <= 0}
                    >
                      Agregar al carrito
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {producto.ingredientes && (
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">Ingredientes</Typography>
                  <Typography sx={{ whiteSpace: "pre-line" }}>
                    {producto.ingredientes}
                  </Typography>
                </Card>
              )}

            </Box>
          }
          right={
            <Box sx={{ p: 2 }}>
              {/* Imagen principal */}
              <Box
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <Box
                  component="img"
                  src={imagenes[selectedImgIndex]}
                  ref={mainImgRef}
                  sx={{
                    width: "100%",
                    maxHeight: 520,
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {imagenes.map((img, i) => (
                  <Box
                    key={i}
                    onClick={() => setSelectedImgIndex(i)}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: "hidden",
                      border:
                        i === selectedImgIndex
                          ? "2px solid #aa00ff"
                          : "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Stack>

              <Card sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6">Descripción</Typography>
                <Typography sx={{ whiteSpace: "pre-line" }}>
                  {producto.descripcion || "—"}
                </Typography>
              </Card>

              {producto.instrucciones_uso && (
                <Card sx={{ p: 2, mt: 2, mb: 2 }}>
                  <Typography variant="h6">Instrucciones de uso</Typography>
                  <Typography sx={{ whiteSpace: "pre-line" }}>
                    {producto.instrucciones_uso}
                  </Typography>
                </Card>
              )}
            </Box>
          }
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
