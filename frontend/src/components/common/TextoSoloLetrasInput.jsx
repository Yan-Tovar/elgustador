import { useState } from "react";
import { TextField } from "@mui/material";

export default function TextoSoloLetrasInput({
  value,
  onChange,
  required = true,
  maxLength = 70,
  label = "Campo de texto",
  name = "texto"
}) {
  const [error, setError] = useState("");

  const validate = (val) => {
    // Solo letras permitiendo tildes y espacios
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]*$/;

    if (!regex.test(val)) {
      setError("Solo se permiten letras y tildes. No números ni caracteres especiales.");
      return false;
    }

    if (val.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres.`);
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
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      required={required}
      fullWidth
      margin="normal"
      error={Boolean(error)}
      helperText={error || " "} 
      inputProps={{
        maxLength,
      }}
    />
  );
}
