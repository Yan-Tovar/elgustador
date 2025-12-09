// src/components/common/OnboardingTutorial.jsx
import { useState, useEffect } from "react";
import { Box, Typography, Button, Fade, useTheme, useMediaQuery } from "@mui/material";
import PointerIcon from '@mui/icons-material/ArrowDownward';

const steps = [
  {
    id: 1,
    title: "Menú principal",
    description: "Aquí encontrarás todas las secciones disponibles.",
    selector: "#sidebar-menu", // desktop
    selectorMobile: "#mobile-sidebar-toggle", // icono en móvil
  },
  {
    id: 2,
    title: "Usuario y perfil",
    description: "Accede a tu perfil y ajustes aquí.",
    selector: "#navbar-user",
  },
  {
    id: 3,
    title: "Agregar productos",
    description: "Selecciona productos y añádelos al carrito.",
    selector: ".producto-card",
  },
];

export default function OnboardingTutorial({ open, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [messageStyle, setMessageStyle] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (!open) return;

    const step = steps[stepIndex];
    const selector = isMobile && step.selectorMobile ? step.selectorMobile : step.selector;
    const element = document.querySelector(selector);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;
    const width = rect.width;
    const height = rect.height;

    // Caja resaltada
    setHighlightStyle({ top, left, width, height });

    const screenWidth = window.innerWidth;
    const messageWidth = isMobile ? screenWidth * 0.9 : 300;

    let messageLeft;
    // Colocar mensaje al lado opuesto del centro del elemento
    const side = left + width / 2 < screenWidth / 2 ? "right" : "left";
    if (side === "right") {
      messageLeft = left + width + 10;
      if (messageLeft + messageWidth > screenWidth) messageLeft = screenWidth - messageWidth - 10;
    } else {
      messageLeft = left - messageWidth - 10;
      if (messageLeft < 10) messageLeft = 10;
    }

    let messageTop;

    // Ajuste para móviles en primer paso
  if (isMobile && (stepIndex === 0 || stepIndex === 1)) {
    messageTop = top + height + 10; // margin top para que no tape encabezado
  } else if (stepIndex === 2) {
    // Para el producto, centrar en la pantalla
    messageTop = window.scrollY + window.innerHeight / 2 - 50;
    // Aseguramos que el elemento esté visible
    const scrollTop = window.scrollY;
    const scrollBottom = scrollTop + window.innerHeight;
    if (top < scrollTop || top + height > scrollBottom) {
      window.scrollTo({
        top: top - window.innerHeight / 2 + height / 2,
        behavior: "smooth",
      });
    }
  } else {
    // Otros pasos: al lado del elemento
    messageTop = top + height / 2 - 50;
    if (messageTop < 10) messageTop = 10;
    if (messageTop + 120 > window.scrollY + window.innerHeight) messageTop = window.scrollY + window.innerHeight - 130;
  }

    setMessageStyle({ top: messageTop, left: messageLeft, width: messageWidth });

  }, [stepIndex, open, isMobile]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else onClose();
  };

  const handleSkip = () => onClose();

  if (!open) return null;

  const step = steps[stepIndex];

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.6)",
          zIndex: 9999,
          pointerEvents: "auto",
        }}
      >
        {/* Caja resaltada */}
        {highlightStyle.width && (
          <Box
            sx={{
              position: "absolute",
              top: highlightStyle.top,
              left: highlightStyle.left,
              width: highlightStyle.width,
              height: highlightStyle.height,
              border: "3px solid orangered",
              borderRadius: 2,
              boxSizing: "border-box",
              transition: "all 0.3s ease",
            }}
          />
        )}

        {/* Mensaje */}
        {highlightStyle.width && (
          <Box
            sx={{
              position: "absolute",
              top: messageStyle.top,
              left: messageStyle.left,
              width: messageStyle.width,
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 2,
              boxShadow: 5,
              color: "text.primary",
              pointerEvents: "auto",
              zIndex: 10000,
            }}
          >
            <Typography variant="h6">{step.title}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {step.description}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="text" color="inherit" onClick={handleSkip}>
                X
              </Button>
              <Button variant="contained" color="secondary" onClick={handleNext}>
                {stepIndex === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>
            <PointerIcon
              sx={{
                position: "absolute",
                top: -40,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 40,
                color: "orangered",
                animation: "bounce 1s infinite",
              }}
            />
          </Box>
        )}

        {/* Animación */}
        <style>
          {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
}
