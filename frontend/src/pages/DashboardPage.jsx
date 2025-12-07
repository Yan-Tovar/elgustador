// src/pages/PublicDashboardPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Chip,
  Snackbar, // Añadir Snackbar para posibles errores de carga
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

// Reemplazamos DashboardLayout por el nuevo Layout
import PublicLayout from "../components/layout/PublicLayout"; 

// Servicios que pueden ser públicos
import { fetchProductos, searchProductos } from "../services/productosService";
import { fetchCategorias } from "../services/categoriasService";
import { fetchOfertas } from "../services/ofertasService";

// Componentes
import ProductosCard from "../components/common/ProductosCard";
import CarruselComponent from "../components/common/CarruselComponent";


// *************************************************************************
// NOTA: Se ha ELIMINADO la lógica de CarritoContext, loadCarrito,
// handleCantidadChange y handleAddToCarrito ya que el usuario NO está logueado.
// *************************************************************************

export default function PublicDashboardPage() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [search, setSearch] = useState("");
  // Mantenemos snackbar solo para mostrar posibles errores de carga
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
      // NOTA: Los productos deben ser accesibles públicamente en el backend.
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setSnackbar({ open: true, message: "Error al cargar productos", severity: "error" });
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

  // El usuario es redirigido a la página de detalle, no hay función de "añadir al carrito"
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
    <PublicLayout> {/* Usamos el nuevo layout */}
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
              {/* NOTA: ProductosCard debe ser modificado para NO mostrar 
              campos de cantidad/añadir si onAdd es null o no existe */}
              <ProductosCard
                producto={prod}
                // Se pasan propiedades nulas para deshabilitar la funcionalidad del carrito
                cantidad={null} 
                onCantidadChange={null}
                onAdd={null} 
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
    </PublicLayout>
  );
}