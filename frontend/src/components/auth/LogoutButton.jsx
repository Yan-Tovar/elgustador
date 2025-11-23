import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<LogoutIcon />}
      onClick={logout}
    >
      Cerrar sesión
    </Button>
  );
}
