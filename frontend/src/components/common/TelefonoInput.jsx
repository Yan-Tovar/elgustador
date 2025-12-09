import { useState } from "react";
import { TextField } from "@mui/material";

export default function TelefonoInput({
  value,
  onChange,
  required = true,
  label = "Teléfono",
  name = "telefono",
}) {
  const [error, setError] = useState("");

  const validate = (val) => {
    // Limpiar espacios y guiones
    const cleanVal = val.replace(/\D/g, "");

    // Validación básica para Colombia: móvil empieza con 3 y 10 dígitos
    const movilRegex = /^3\d{9}$/;
    // Fijo opcional: empieza con 1-7 y 7 u 8 dígitos (código de ciudad incluido)
    const fijoRegex = /^[1-7]\d{6,9}$/;

    if (!cleanVal) {
      if (required) {
        setError("El teléfono es requerido.");
        return false;
      } else {
        setError("");
        return true;
      }
    }

    if (!movilRegex.test(cleanVal) && !fijoRegex.test(cleanVal)) {
      setError("Ingresa un número de teléfono válido de Colombia.");
      return false;
    }

    setError("");
    return true;
  };

  const handleChange = (e) => {
    const val = e.target.value;
    validate(val);
    onChange(e);
  };

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      color="secondary"
      margin="normal"
      error={Boolean(error)}
      helperText={error || " "}
      inputProps={{
        maxLength: 10,
        inputMode: "numeric",
        pattern: "[0-9]*",
      }}
    />
  );
}
