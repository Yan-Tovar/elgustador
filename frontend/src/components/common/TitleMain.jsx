import { Typography } from "@mui/material";

export default function TitleMain({
  children,
  color = "text.secondary",
  variant = "h5",
  component = "h1",
  align = "center",
  fontWeight = "bold",
  gutterBottom = true,
  textShadow = "1px 1px 6px rgba(0,0,0,0.3)",
  sx = {},
}) {
  return (
    <Typography
      variant={variant}
      component={component}
      align={align}
      fontWeight={fontWeight}
      gutterBottom={gutterBottom}
      sx={{
        color,
        textShadow,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}
