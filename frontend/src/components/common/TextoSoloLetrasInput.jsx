import { useState } from "react";
import { TextField } from "@mui/material";

export default function TextoSoloLetrasInput({
  value,
  onChange,
  onValidChange,   
  required = true,
  maxLength = 70,
  label = "Campo de texto",
  name = "texto"
}) {
  const [error, setError] = useState("");

  const validate = (val) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]*$/;

    if (!regex.test(val)) {
      setError("Solo se permiten letras y tildes. No números ni caracteres especiales.");
      onValidChange?.(false);
      return false;
    }

    if (val.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres.`);
      onValidChange?.(false);
      return false;
    }

    setError("");
    onValidChange?.(true);
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
      inputProps={{ maxLength }}

      sx={{
        "& .MuiInputBase-input": { color: "#000" },
        "& .MuiInputLabel-root": { color: "#f00909ee" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "#000" },
          "&:hover fieldset": { borderColor: "#ff5722" },
          "&.Mui-focused fieldset": { borderColor: "#ff5722" }
        },
        "& .MuiFormHelperText-root": {
          color: error ? "#ff5722" : "#555"
        }
      }}
    />
  );
}
