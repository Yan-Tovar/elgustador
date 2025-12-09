// src/views/admin/productos/ProductosList.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Tooltip,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import UsuariosStats from "../../../components/common/estadisticas/UsuariosStats";

export default function UsuariosStatsPage() {
 
  return (
    <DashboardLayout>
        <UsuariosStats />
    </DashboardLayout>
  );
}
