import { useState } from "react";
import { TextField } from "@mui/material";

export default function IdentificacionInput({
  value,
  onChange,
  required = true,
  minLength = 6,
  maxLength = 12,
  label = "Identificación",
  name = "identificacion",
}) {
  const [error, setError] = useState("");

  const validate = (val) => {
    // Solo números
    if (!/^\d*$/.test(val)) {
      setError("Solo se permiten números.");
      return false;
    }

    // Longitud mínima
    if (val.length < minLength) {
      setError(`La identificación debe tener al menos ${minLength} números.`);
      return false;
    }

    // Longitud máxima
    if (val.length > maxLength) {
      setError(`La identificación no puede pasar de ${maxLength} números.`);
      return false;
    }

    // Todo correcto
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const val = e.target.value;

    // Validación en tiempo real
    validate(val);

    // Actualiza estado del formulario padre
    onChange(e);
  };

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      required={required}
      fullWidth
      margin="normal"
      error={Boolean(error)}
      helperText={error}
      inputProps={{
        maxLength: maxLength,
        inputMode: "numeric",
        pattern: "[0-9]*",
      }}
    />
  );
}
