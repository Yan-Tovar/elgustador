import { useState } from "react";
import { TextField } from "@mui/material";

export default function PasswordSecure({ onValid, passwordValue = "", confirmValue = "" }) {
  const [password, setPassword] = useState(passwordValue);
  const [confirm, setConfirm] = useState(confirmValue);
  const [errors, setErrors] = useState([]);

  const validatePassword = (pwd, confirmPwd) => {
    const newErrors = [];

    if (pwd.length < 8) newErrors.push("La contraseña debe tener al menos 8 caracteres.");
    if (!/[A-Z]/.test(pwd)) newErrors.push("Debe contener al menos una letra mayúscula.");
    if (!/[a-z]/.test(pwd)) newErrors.push("Debe contener al menos una letra minúscula.");
    if (!/[0-9]/.test(pwd)) newErrors.push("Debe contener al menos un número.");
    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(pwd))
      newErrors.push("Debe contener al menos un carácter especial.");
    if (confirmPwd && pwd !== confirmPwd) newErrors.push("Las contraseñas no coinciden.");

    setErrors(newErrors);

    onValid(newErrors.length === 0 ? pwd : null);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    validatePassword(val, confirm);
  };

  const handleConfirmChange = (e) => {
    const val = e.target.value;
    setConfirm(val);
    validatePassword(password, val);
  };

  return (
    <>
      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        required
        fullWidth
        margin="normal"
        error={errors.length > 0}
        helperText={errors.length > 0 ? errors.map((e, i) => <span key={i}>• {e}<br/></span>) : " "}
      />

      <TextField
        label="Confirmar contraseña"
        type="password"
        value={confirm}
        onChange={handleConfirmChange}
        required
        fullWidth
        margin="normal"
        error={errors.length > 0}
        helperText=" " // mantiene espacio igual que otros inputs
      />
    </>
  );
}
