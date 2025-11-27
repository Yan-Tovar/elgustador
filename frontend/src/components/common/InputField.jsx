import { TextField } from "@mui/material";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  fullWidth = true,
  margin = "normal",
  ...rest
}) {
  return (
    <TextField
      label={label}
      type={type}
      fullWidth
      margin="normal"  
      // margin={margin}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
    />
  );
}
