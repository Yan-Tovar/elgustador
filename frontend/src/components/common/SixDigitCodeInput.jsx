import { useState, useRef, useEffect } from "react";
import { Box, TextField } from "@mui/material";

export default function SixDigitCodeInput({ value, onChange, disabled }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    // Si value viene desde el form, separarlo en digits
    if (value && value.length === 6) {
      setDigits(value.split(""));
    }
  }, [value]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, ""); // Solo números
    if (!val) return;

    const newDigits = [...digits];
    newDigits[index] = val[0];
    setDigits(newDigits);

    // Llamar al callback con el valor completo
    onChange(newDigits.join(""));

    // Pasar al siguiente input si existe
    if (index < 5 && val[0]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Borrar el dígito actual
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
        onChange(newDigits.join(""));
      } else if (index > 0) {
        // Mover cursor al input anterior
        inputsRef.current[index - 1].focus();
      }
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}>
      {digits.map((digit, i) => (
        <TextField
          key={i}
          inputRef={(el) => (inputsRef.current[i] = el)}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
          sx={{ width: "3rem" }}
          disabled={disabled}
        />
      ))}
    </Box>
  );
}
