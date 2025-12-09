import { Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import TitleMain from "../components/common/TitleMain";
import LoginButton from "../components/common/LoginButton";
import RegisterButton from "../components/common/RegisterButton";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

import PqrsForm from "../components/common/PqrsForm";

export default function PqrsAnonimoPage() {
  const navigate = useNavigate();

  /** Contenido del bloque izquierdo: formulario PQRS */
  const left = (
    <>
      <TitleMain>Enviar PQRS</TitleMain>

      <PqrsForm />
    </>
  );

  /** Contenido del bloque derecho: botones de login/registro y redes */
  const right = (
    <>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        ¿Quieres Iniciar Sesión?
      </Typography>
      <LoginButton />

      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        ¿Aún no te has registrado?
      </Typography>
      <RegisterButton />

      <Typography
        variant="body2"
        textAlign="center"
        sx={{ color: "gray", mb: 2 }}
      >
        Conócenos en nuestras redes sociales
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <FacebookIcon sx={{ cursor: "pointer" }} />
        <InstagramIcon sx={{ cursor: "pointer" }} />
        <TwitterIcon sx={{ cursor: "pointer" }} />
      </Stack>
    </>
  );

  return (
    <AuthLayout
      showContent={true}
      snackbar={{ open: false, message: "", severity: "info" }}
      setSnackbar={() => {}}
      left={left}
      right={right}
    />
  );
}
