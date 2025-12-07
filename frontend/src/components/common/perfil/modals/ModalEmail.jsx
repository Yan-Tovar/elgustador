// components/perfil/modals/ModalEmail.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";

import EmailInput from "../../EmailInput";
import SixDigitCodeInput from "../../SixDigitCodeInput";

import { sendEmailCode, verifyEmailCode } from "../../../../services/auth";
import { updateUsuario } from "../../../../services/usuariosService";

export default function ModalEmail({ open, onClose, usuario, setUsuario }) {
  const [step, setStep] = useState("email"); 
  const [email, setEmail] = useState(usuario.email);
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ===============================
  // 1) Enviar correo para verificar
  // ===============================
  const handleSendCode = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      await sendEmailCode(email);
      setStep("verify");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Este correo no es válido.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 2) Verificar código + actualizar correo
  // ===============================
  const handleVerifyCode = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      await verifyEmailCode(email, code); 

      const res = await updateUsuario({ email });

      setUsuario(res.data);
      onClose();
      setStep("email");
      setCode("");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Código incorrecto. Verifica el código e intenta nuevamente.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setCode("");
    setErrorMsg("");
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {step === "email" ? "Cambiar correo electrónico" : "Verificar código"}
      </DialogTitle>

      <DialogContent dividers>
        {step === "email" && (
          <>
            <EmailInput
              onChange={(e) => setEmail(e.target.value)}
            />

            {errorMsg && (
              <Typography color="error" sx={{ mt: 1 }}>
                {errorMsg}
              </Typography>
            )}
          </>
        )}

        {step === "verify" && (
          <>
            <Typography variant="body2">
              Hemos enviado un código de verificación al correo:<br/>
              1. Verifica Bandeja de entrada<br/>
              2. Verifica Span<br/>
              3. Ingresa el código<br/>
            </Typography>

            <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
              {email}
            </Typography>

            <SixDigitCodeInput value={code} onChange={setCode} />

            {errorMsg && (
              <Typography color="error" sx={{ mt: 2 }}>
                {errorMsg}
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>

        {step === "email" && (
          <Button
            variant="contained"
            onClick={handleSendCode}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Enviar código"}
          </Button>
        )}

        {step === "verify" && (
          <Button
            variant="contained"
            onClick={handleVerifyCode}
            disabled={loading || code.length < 6}
          >
            {loading ? <CircularProgress size={20} /> : "Verificar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
