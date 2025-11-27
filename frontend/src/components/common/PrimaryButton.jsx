import { Button } from "@mui/material";

export default function PrimaryButton({ children, onClick, type = "button", fullWidth = true }) {
  return (
    <Button
      type={type}
      variant="contained"
      fullWidth={fullWidth}
      size="large"
      onClick={onClick}
      sx={{
        mb: 2,
        mt: 2,
        borderRadius: 3,
        background: "linear-gradient(135deg, #EB2A05, #c82104)",
        fontWeight: "bold",
        color: "white",
        "&:hover": {
          background: "linear-gradient(135deg, #c82104, #EB2A05)",
        },
      }}
    >
      {children}
    </Button>
  );
}
