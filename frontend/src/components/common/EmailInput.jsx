import { useState } from "react";
import { TextField, FormControl } from "@mui/material";

export default function EmailInput({ value, onChange, required = true, label = "Correo electrónico", name = "email" }) {
  const [error, setError] = useState("");

  const validate = (val) => {
    // Validación básica de correo
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(val)) {
      setError("Ingresa un correo electrónico válido.");
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
    <FormControl fullWidth margin="normal" sx={{ minHeight: 85 }}>
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        error={Boolean(error)}
        helperText={error || " "}
      />
    </FormControl>
  );
}
