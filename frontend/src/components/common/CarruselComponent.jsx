import { useEffect, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchCarruselPublic } from "../../services/carruselService";

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function CarruselComponent() {
  const theme = useTheme();
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadCarrusel();
  }, []);

  const loadCarrusel = async () => {
    try {
      const res = await fetchCarruselPublic();
      setItems(res.data.filter((i) => i.estado).sort((a, b) => a.orden - b.orden));
    } catch (err) {
      console.error("Error cargando carrusel:", err);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  /**
   * Función que construye la URL absoluta de la imagen.
   */
  const getAbsoluteImageUrl = (relativePath) => {
    if (!relativePath) return 'none'; // O una imagen de placeholder
    if (relativePath.startsWith("http")) {
      return relativePath;
    }
    return `${API_BASE_URL}${relativePath}`;
  };

  /**
   * Maneja el clic en el slide (si tiene URL de destino).
   */
  const handleSlideClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    // Hemos corregido el padding/margen: width: "100%", mx: "auto" para centrar
    <Box sx={{ width: "90%", maxWidth: 1200, mx: "auto", mb: 4, px: { xs: 1, sm: 2 } }}>
      <Slider {...sliderSettings}>
        {items.map((item) => {
          const imageUrl = getAbsoluteImageUrl(item.imagen);
          const hasUrl = !!item.url_destino;

          return (
            // Contenedor principal del slide: define el fondo, la altura y la interacción de clic
            <Box
              key={item.id}
              onClick={() => handleSlideClick(item.url_destino)}
              sx={{
                position: "relative",
                height: { xs: 200, sm: 300, md: 350 },
                cursor: hasUrl ? "pointer" : "default", // Cambia el cursor si hay URL
                
                // Estilos de la imagen de fondo
                backgroundImage: `url(${imageUrl})`, 
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 2,
                overflow: "hidden",
                
                // Centrado del contenido (nuevo contenedor para el texto)
                display: "flex",
                alignItems: "center", // Centrado vertical del contenido
                justifyContent: "center", // Centrado horizontal del contenido
                
                // Añade un overlay para mejorar la legibilidad del texto
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)", // Overlay oscuro suave
                    zIndex: 1,
                },
              }}
            >
              {/* Contenedor del Texto (z-index mayor para estar por encima del overlay) */}
              <Box 
                sx={{
                    position: "relative",
                    zIndex: 2, 
                    textAlign: "center",
                    color: "#fff",
                    p: { xs: 2, sm: 4 },
                    maxWidth: "80%", // Limita el ancho del texto
                }}
              >
                {/* TITULO (Solo si existe) */}
                {item.titulo && (
                  <Typography
                    variant="h3"
                    component="h1" // Usa h1 para jerarquía en la página principal
                    sx={{
                      fontWeight: 900,
                      mb: 1.5,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.6)", // Sombra para mejor contraste
                      fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    {item.titulo}
                  </Typography>
                )}

                {/* DESCRIPCION (Solo si existe) */}
                {item.descripcion && (
                  <Typography
                    variant="body1"
                    sx={{
                      mb: hasUrl ? 2 : 0,
                      fontWeight: 400,
                      textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                      fontSize: { xs: "0.9rem", sm: "1.1rem" },
                    }}
                  >
                    {item.descripcion}
                  </Typography>
                )}

              </Box>
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
}