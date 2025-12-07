import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  MenuItem,
  Typography,
  TextField,
  Alert,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import TitleMain from "../components/common/TitleMain";
import PrimaryButton from "../components/common/PrimaryButton";
import LoginButton from "../components/common/LoginButton";
import IdentificacionInput from "../components/common/IdentificacionInput";
import TextoSoloLetrasInput from "../components/common/TextoSoloLetrasInput";
import PasswordSecure from "../components/common/PasswordSecure";
import TelefonoInput from "../components/common/TelefonoInput";
import EmailInput from "../components/common/EmailInput";
import SixDigitCodeInput from "../components/common/SixDigitCodeInput";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

import { registerUser, getDepartamentos, getMunicipios, sendEmailCode, verifyEmailCode } from "../services/auth";
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sendingCode, setSendingCode] = useState(false);

  const [form, setForm] = useState(() => {
    return JSON.parse(localStorage.getItem("registerForm")) || {
      identificacion: "",
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      passwordConfirm: "",
      telefono: "",
      departamento: "",
      municipio: "",
      direccion_detallada: "",
      emailCode: ""
    };
  });

  const [step, setStep] = useState(() => {
    return parseInt(localStorage.getItem("registerStep")) || 1;
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    localStorage.setItem("registerForm", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    localStorage.setItem("registerStep", step);
  }, [step]);

  useEffect(() => {
    async function fetchData() {
      try {
        const depRes = await getDepartamentos();
        setDepartamentos(depRes.data || []);
        const munRes = await getMunicipios();
        setMunicipios(munRes.data || []);
      } catch (err) {
        console.error("Error cargando deps/munis:", err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateStep = async () => {
    setError("");
    if (step === 1) {
      if (!form.identificacion || !form.nombre || !form.apellido) {
        setError("Completa identificación, nombre y apellido.");
        return false;
      }
    } else if (step === 2) {
      if (!form.password || !form.passwordConfirm) {
        setError("Ingresa y confirma la contraseña.");
        return false;
      }
      if (form.password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return false;
      }
      if (form.password !== form.passwordConfirm) {
        setError("Las contraseñas no coinciden.");
        return false;
      }
    } else if (step === 3) {
      if (!form.departamento || !form.municipio) {
        setError("Selecciona departamento y municipio.");
        return false;
      }
    } else if (step === 4) {
      if (!form.email) {
        setError("Ingresa un correo electrónico.");
        return false;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(form.email)) {
        setError("Ingresa un correo válido.");
        return false;
      }
    } else if (step === 5) {
      if (!form.emailCode || form.emailCode.length !== 6) {
        setError("Ingresa el código de verificación de 6 dígitos.");
        return false;
      }
      try {
        const res = await verifyEmailCode(form.email, form.emailCode);
        if (!res || res.status !== 200) {
          setError("Código incorrecto o expirado.");
          return false;
        }
      } catch (err) {
        setError("Código incorrecto o expirado.");
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    setError("");
    if (step === 4 && !emailSent) {
      setSendingCode(true);  
      try {
        const res = await sendEmailCode(form.email);
        // Comprobar si el correo ya existe según la respuesta del backend
        if (res.data && res.data.status === "exists") {
          setError(res.data.detail); // <-- mensaje del backend
          return;
        }

        setEmailSent(true);
        setSnackbar({ open: true, message: "Código enviado al correo", severity: "success" });
      } catch (err) {
        setError("Error al enviar el código, intenta de nuevo.");
        console.error(err);
      } finally {
        setSendingCode(false); 
      }
    }

    if (await validateStep()) {
      setStep((s) => Math.min(5, s + 1));
    }
  };

  const handleBack = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateStep())) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        identificacion: form.identificacion,
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        telefono: form.telefono,
        departamento: parseInt(form.departamento || 0),
        municipio: parseInt(form.municipio || 0),
        direccion_detallada: form.direccion_detallada,
      };

      const res = await registerUser(payload);

      const backendMessage =
        (res.data && (res.data.message || (res.data.user && `Usuario creado: ${res.data.user.email || res.data.user.username || res.data.user.id}`))) ||
        "Registro exitoso";

      setSnackbar({ open: true, message: backendMessage, severity: "success" });
      localStorage.removeItem("registerForm");
      localStorage.removeItem("registerStep");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Error en register:", err);
      const msg =
        (err.response && (err.response.data.detail || err.response.data.message || JSON.stringify(err.response.data))) ||
        "Error en el registro";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const municipiosFiltrados = municipios.filter(
    (m) => m.departamento && form.departamento && m.departamento.id === parseInt(form.departamento)
  );

  const leftContent = (
    <>
      <TitleMain>Registro de Usuario</TitleMain>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Paso 1 — Datos personales
            </Typography>
            <IdentificacionInput value={form.identificacion} onChange={handleChange} />
            <TextoSoloLetrasInput label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
            <TextoSoloLetrasInput label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} />
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Paso 2 — Contraseña
            </Typography>
            <PasswordSecure
              onValid={(pwd) =>
                setForm((prev) => ({
                  ...prev,
                  password: pwd,
                  passwordConfirm: pwd,
                }))
              }
            />
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Paso 3 — Dirección
            </Typography>
            <TextField select fullWidth label="Departamento" name="departamento" value={form.departamento} onChange={handleChange} required margin="normal">
              {departamentos.map((dep) => (
                <MenuItem key={dep.id} value={dep.id}>
                  {dep.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField select fullWidth label="Municipio" name="municipio" value={form.municipio} onChange={handleChange} required margin="normal">
              {municipiosFiltrados.map((mun) => (
                <MenuItem key={mun.id} value={mun.id}>
                  {mun.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField fullWidth label="Dirección detallada" name="direccion_detallada" value={form.direccion_detallada} onChange={handleChange} margin="normal" />
          </>
        )}

        {step === 4 && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Paso 4 — Comunicación
            </Typography>
            <EmailInput label="Correo electrónico" name="email" value={form.email} onChange={handleChange} />
            <TelefonoInput value={form.telefono} onChange={handleChange} label="Teléfono" name="telefono" />
          </>
        )}

        {step === 5 && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Paso 5 — Verificación de correo
            </Typography>

            <SixDigitCodeInput
              value={form.emailCode}
              onChange={(val) => setForm({ ...form, emailCode: val })}
              disabled={sendingCode || loading}
            />
          </>
        )}

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          {step > 1 && (
            <Button variant="outlined" onClick={handleBack} disabled={loading}>
              Atrás
            </Button>
          )}

          {step < 5 ? (
            <>
              {step === 4 ? (
                sendingCode ? (
                  // Mostrar mensaje mientras se envía
                  <Typography sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                    Enviando...
                  </Typography>
                ) : (
                  // Mostrar botón solo si NO se está enviando
                  <PrimaryButton onClick={handleNext}>
                    Enviar código
                  </PrimaryButton>
                )
              ) : (
                <PrimaryButton onClick={handleNext} disabled={loading}>
                  Siguiente
                </PrimaryButton>
              )}
            </>
          ) : (
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Finalizar registro"}
            </PrimaryButton>
          )}
        </Box>
      </form>
    </>
  );

  const rightContent = (
    <>
      <Typography variant="body2" textAlign="center" sx={{ color: "gray", mb: 2 }}>
        Si ya estas registrado
      </Typography>
      <LoginButton/>
      <Typography variant="body2" textAlign="center" sx={{ color: "gray", mb: 2 }}>
        Conocenos en nuestras redes sociales
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
        <FacebookIcon sx={{ cursor: "pointer" }} />
        <InstagramIcon sx={{ cursor: "pointer" }} />
        <TwitterIcon sx={{ cursor: "pointer" }} />
      </Stack>
    </>
  );

  return <AuthLayout showContent={true} snackbar={snackbar} setSnackbar={setSnackbar} left={leftContent} right={rightContent} />;
}
