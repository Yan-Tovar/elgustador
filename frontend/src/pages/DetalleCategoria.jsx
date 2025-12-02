import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, useTheme  } from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";
import { fetchCategoria } from "../services/categoriasService";
import { fetchProductosPorCategoria } from "../services/productosService";

import ProductosCard from "../components/common/ProductosCard";

export default function DetalleCategoria() {
  const { id } = useParams();
  const theme = useTheme();

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
  if (!categoria)
    return (
      <DashboardLayout>
        <Box
          sx={{
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          <img
            src="/NoCategoria.png"
            alt="Categoría no encontrada"
            style={{
              width: "180px",
              height: "180px",
              objectFit: "contain",
              marginBottom: "20px",
            }}
          />

          <Typography variant="h5" fontWeight="bold">
            No existe esta categoría
          </Typography>

          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            Verifica el enlace o vuelve al listado de categorías.
          </Typography>
        </Box>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <Box sx={{ p: 1 }}>
        {/* ENCABEZADO HORIZONTAL ELEGANTE */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            gap: { xs: 2, md: 4 },
            p: 2,
            mb: 3,
          }}
        >
          {/* Imagen redonda */}
          <Box
            component="img"
            src={categoria.imagen_url || "/default_categoria.png"}
            alt={categoria.nombre}
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: `1px solid ${theme.palette.divider}`,
              padding: 1
            }}
          />

          {/* Contenido principal */}
          <Box sx={{ flex: 1, width: "100%", mt: { xs: 1, md: 0 } }}>
            
            {/* Nombre Centro */}
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                fontFamily: "fangsong",
                textAlign: { xs: "center", md: "left" },
                mb: 2,
              }}
            >
              {categoria.nombre}
            </Typography>

            {/* Globo estilo WhatsApp */}
            <Box
              sx={{
                position: "relative",
                maxWidth: { xs: "95%", md: "80%" },
                backgroundColor: theme.palette.background.paper,
                p: 2,
                borderRadius: 3,
                boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
                textAlign: { xs: "center", md: "left" },
                mx: { xs: "auto", md: 0 },
              }}
            >
              {/* Flecha apuntando a la imagen */}
              <Box
                sx={{
                  position: "absolute",
                  left: { xs: "50%", md: "-12px" },
                  transform: { xs: "translateX(-50%) rotate(90deg)", md: "none" },
                  top: { xs: "-10px", md: "20px" },
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderRight: {
                    md: `12px solid ${theme.palette.background.paper}`,
                    xs: "none",
                  },
                  borderLeft: {
                    xs: `12px solid ${theme.palette.background.paper}`,
                    md: "none",
                  },
                }}
              />

              <Typography variant="body1" color="text.primary">
                {categoria.descripcion || "Sin descripción disponible."}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* PRODUCTOS */}
        <Typography variant="h5" mt={1} mb={1} sx={{display:"flex", justifyContent:"center", fontFamily: "ui-monospace", }}>
          Productos de esta categoría
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            py: 4,
          }}
        >

          {productos.length === 0 ? (
            <Grid
              item
              xs={12}
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Imagen */}
              <Box
                component="img"
                src="/NoProductos.png"
                alt="Sin productos"
                sx={{
                  width: { xs: "140px", sm: "180px" },
                  height: "auto",
                  opacity: 0.9,
                }}
              />

              {/* Texto */}
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mt: 1, fontWeight: 500}}
              >
                No hay productos en esta categoría.
              </Typography>
            </Grid>
          ) : (
            productos.map((producto) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
                <ProductosCard
                  producto={producto}
                  cantidad={cantidades[producto.id] || 1}
                  onCantidadChange={handleCantidadChange}
                  onAdd={handleAddToCart}
                  onDetalle={handleDetalleProducto}
                />
              </Grid>
            ))
          )}

        </Grid>
      </Box>
    </DashboardLayout>
  );
}
