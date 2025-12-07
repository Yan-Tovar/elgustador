// src/components/navigation/PublicNavbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery, 
  IconButton, // Importado para los iconos en móvil
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// Importar los iconos para móvil
import PersonAddIcon from "@mui/icons-material/PersonAdd"; 
import LoginIcon from "@mui/icons-material/Login"; 

export default function PublicNavbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  // Definición de móvil (hasta 600px)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

  const NAVBAR_HEIGHT = 70;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          // Aplicamos el color orangered
          backgroundColor: "orangered", 
          // Color de texto de contraste (blanco o negro)
          zIndex: theme.zIndex.drawer + 2,
          height: NAVBAR_HEIGHT,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2, md: 3 }
          }}
        >
          {/* ================= IZQUIERDA: LOGO y NOMBRE ================= */}
          <Box 
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} 
            onClick={() => navigate("/")}
          >
            {/* LOGO (Asumiendo que public/logo.png es accesible en /logo.png) */}
            <Box
              component="img"
              src="/logo.png" // Ruta pública
              alt="Logo El Gustador"
              sx={{ height: 40, width: 40, objectFit: 'contain' }}
            />
            
            {/* NOMBRE DEL GUSTADOR */}
            <Typography variant="h6" color="white" fontWeight="bold">
              El Gustador
            </Typography>
          </Box>

          {/* ================= DERECHA: ACCIONES ================= */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            
            {/* ACCIONES DE AUTENTICACIÓN (ESCRITORIO: Botones) */}
            {!isMobile && (
              <>
                {/* BOTÓN REGISTRARSE (Solo Escritorio) */}
                <Button
                  variant="contained"
                  size="medium"
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                  onClick={() => navigate("/register")}
                >
                  Registrarse
                </Button>
                
                {/* BOTÓN INICIAR SESIÓN (Solo Escritorio) */}
                <Button
                  variant="contained"
                  size="medium"
                  color="inherit" 
                  onClick={() => navigate("/login")}
                >
                  Iniciar Sesión
                </Button>
              </>
            )}

            {/* ACCIONES DE AUTENTICACIÓN (MÓVIL: Iconos) */}
            {isMobile && (
              <>
                {/* ICONO REGISTRARSE (Móvil) */}
                <IconButton 
                    color="inherit" 
                    onClick={() => navigate("/register")}
                    aria-label="Registrarse"
                >
                  <PersonAddIcon />
                </IconButton>

                {/* ICONO INICIAR SESIÓN (Móvil) */}
                <IconButton 
                    color="inherit" 
                    onClick={() => navigate("/login")}
                    aria-label="Iniciar Sesión"
                >
                  <LoginIcon />
                </IconButton>
              </>
            )}
            
          </Box>
        </Toolbar>
      </AppBar>

      {/* Espacio para evitar que el contenido quede debajo del navbar */}
      <Box sx={{ height: NAVBAR_HEIGHT }} />
    </>
  );
}