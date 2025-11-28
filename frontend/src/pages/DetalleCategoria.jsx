import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";
import { fetchCategoria } from "../services/categoriasService";
import { fetchProductosPorCategoria } from "../services/productosService";

import ProductosCard from "../components/common/ProductosCard";

export default function DetalleCategoria() {
  const { id } = useParams();

  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Cargar categoría
        const resCat = await fetchCategoria(id);
        setCategoria(resCat.data);

        // 2. Cargar productos por categoría (SERVICIO CORRECTO)
        const resProd = await fetchProductosPorCategoria(id);
        setProductos(resProd.data);

        // Inicializar cantidades
        const inicioCant = {};
        resProd.data.forEach((p) => (inicioCant[p.id] = 1));
        setCantidades(inicioCant);

      } catch (error) {
        console.error("Error al cargar detalle de categoría:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Cambiar cantidad local
  const handleCantidadChange = (productoId, nuevaCantidad) => {
    setCantidades((prev) => ({
      ...prev,
      [productoId]: nuevaCantidad,
    }));
  };

  const handleAddToCart = async (producto) => {
    console.log("Agregar al carrito:", producto);
  };

  const handleDetalleProducto = (producto) => {
    console.log("Ver detalle:", producto);
  };

  if (loading) return <DashboardLayout><Typography>Cargando...</Typography></DashboardLayout>;
  if (!categoria) return <DashboardLayout><Typography>No se encontró la categoría.</Typography></DashboardLayout> ;

  return (
    <DashboardLayout>
      <Box sx={{ p: 1 }}>
        {/* ENCABEZADO HORIZONTAL ELEGANTE */}
        <Box
        sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            gap: 3,
            p: 1,
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: 2,
            mb: 2,
        }}
        >
        {/* Imagen */}
        <Box
            component="img"
            src={categoria.imagen_url || "/default_categoria.png"}
            alt={categoria.nombre}
            sx={{
            width: 100,
            height: "auto",
            objectFit: "contain",
            borderRadius: 2,
            mx: { xs: "auto", md: 0 },
            }}
        />

        {/* Información */}
        <Box sx={{ flex: 1 }}>
            <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
                mb: 1,
                textAlign: { xs: "center", md: "left" },
            }}
            >
            {categoria.nombre}
            </Typography>

            <Typography
            variant="body1"
            color="text.secondary"
            sx={{
                mb: 2,
                textAlign: { xs: "center", md: "left" },
                maxWidth: "90%",
            }}
            >
            {categoria.descripcion || "Sin descripción disponible."}
            </Typography>

            {/* Datos adicionales */}
            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                textAlign: { xs: "center", md: "left" },
            }}
            >
            </Box>
        </Box>
        </Box>

        {/* PRODUCTOS */}
        <Typography variant="h5" mt={1} mb={1} sx={{display:"flex", justifyContent:"center"}}>
          Productos de esta categoría
        </Typography>

        <Grid container spacing={2} sx={{display:"flex", justifyContent:"center"}}>
          {productos.length === 0 && (
            <Typography>No hay productos en esta categoría.</Typography>
          )}

          {productos.map((producto) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
              <ProductosCard
                producto={producto}
                cantidad={cantidades[producto.id] || 1}
                onCantidadChange={handleCantidadChange}
                onAdd={handleAddToCart}
                onDetalle={handleDetalleProducto}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
