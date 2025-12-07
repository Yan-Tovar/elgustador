import React from "react";
import { TextField } from "@mui/material";

export default function FormInput({ label, value, onChange, type = "text", name, required = false }) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      margin="normal"
      variant="outlined"
    />
  );
}
