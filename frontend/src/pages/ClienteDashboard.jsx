import { useEffect, useState, useContext } from "react";
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

import DashboardLayout from "../components/layout/DashboardLayout";

import { fetchProductos, searchProductos } from "../services/productosService";
import { fetchCategorias } from "../services/categoriasService";
import { fetchOfertas } from "../services/ofertasService";
import { addToCarrito } from "../services/carritoService";

import { CarritoContext } from "../context/CarritoContext";

import ProductosCard from "../components/common/ProductosCard";
import CategoriaCard from "../components/common/CategoriaCard";
import CarruselComponent from "../components/common/CarruselComponent";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { loadCarrito } = useContext(CarritoContext);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Cargar datos al montar página
  useEffect(() => {
    loadProductos();
    loadCategorias();
    loadOfertas();
  }, []);

  // Debounce búsqueda
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") {
        loadProductos();
      } else {
        handleSearch(search);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  // ============================ CARGAR DATOS ============================
  const loadProductos = async () => {
    try {
      const res = await fetchProductos();
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const loadCategorias = async () => {
    try {
      const res = await fetchCategorias();
      setCategorias(res.data);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  const loadOfertas = async () => {
    try {
      const res = await fetchOfertas();
      setOfertas(res.data);
    } catch (err) {
      console.error("Error cargando ofertas:", err);
    }
  };

  const handleSearch = async (texto) => {
    try {
      const res = await searchProductos(texto);
      setProductos(res.data);
    } catch (err) {
      console.error("Error buscando productos:", err);
    }
  };

  // ============================ MANEJO DE CANTIDADES ============================
  const handleCantidadChange = (productoId, value, stock) => {
    let cantidad = Number(value);
    if (cantidad < 1) cantidad = 1;
    if (cantidad > stock) cantidad = stock;

    setCantidades((prev) => ({ ...prev, [productoId]: cantidad }));
  };

  const handleAddToCarrito = async (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    try {
      const res = await addToCarrito({ producto_id: producto.id, cantidad });
      await loadCarrito();
      setSnackbar({
        open: true,
        message: res.data.warning ? res.data.message : "Producto agregado al carrito",
        severity: res.data.warning ? "warning" : "success",
      });
      setCantidades((prev) => ({ ...prev, [producto.id]: 1 }));
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      setSnackbar({ open: true, message: "Error al agregar al carrito", severity: "error" });
    }
  };

  const handleDetalle = (producto) => navigate(`/producto/${producto.id}`);

  const handleOfertaClick = (oferta) => {
    if (oferta.producto_id) navigate(`/producto/${oferta.producto_id}`);
  };

  // Configuración de carrusel (Para el carrusel de categorías)
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <DashboardLayout>
      <Box sx={{ padding: 1 }}>
        {/* CARRUSEL PRINCIPAL DE BANNERS */}
        <CarruselComponent /> 
        
        {/* BUSCADOR */}
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <TextField
            fullWidth
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: "background.paper", borderRadius: 2, maxWidth: 400 }}
          />
        </Box>

        {/* CARRUSEL DE CATEGORÍAS */}
        {categorias.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Slider {...sliderSettings}>
              {categorias.map((cat) => (
                <Box key={cat.id} sx={{ px: 1 }}>
                  <CategoriaCard categoria={cat} />
                </Box>
              ))}
            </Slider>
          </Box>
        )}

        {/* OFERTAS */}
        {ofertas.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Ofertas
            </Typography>
            <Grid container spacing={2}>
              {ofertas.map((oferta) => (
                <Grid item xs={12} sm={6} md={4} key={oferta.id}>
                  <Card
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOfertaClick(oferta)}
                  >
                    <CardContent>
                      <Typography variant="h6">{oferta.nombre}</Typography>
                      <Typography variant="body2">
                        {oferta.descuento_porcentaje
                          ? `Descuento: ${oferta.descuento_porcentaje}%`
                          : `Descuento: $${oferta.descuento_valor}`}
                      </Typography>
                      <Typography variant="body2">
                        Desde: {new Date(oferta.fecha_inicio).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Hasta: {new Date(oferta.fecha_fin).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={oferta.estado ? "Activa" : "Inactiva"}
                        color={oferta.estado ? "success" : "default"}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* LISTA DE PRODUCTOS */}
        <Grid container spacing={2} justifyContent="center">
          {productos.map((prod) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2}
              key={prod.id}
              display="flex"
              justifyContent="center"
            >
              <ProductosCard
                producto={prod}
                cantidad={cantidades[prod.id] || 1}
                onCantidadChange={handleCantidadChange}
                onAdd={handleAddToCarrito}
                onDetalle={handleDetalle}
              />
            </Grid>
          ))}
        </Grid>

        {/* SNACKBAR */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
