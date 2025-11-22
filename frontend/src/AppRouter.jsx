import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DepartamentoPage from "./pages/DepartamentoPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmpleadoDashboard from "./pages/EmpleadoDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";

import PrivateRoute from "./components/PrivateRoute";

export default function AppRouter() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />

        {/* Dashboards según rol */}
        <Route path="/" element={
          user?.rol === "admin" ? <Navigate to="/admin/dashboard" /> :
          user?.rol === "empleado" ? <Navigate to="/employee/dashboard" /> :
          user?.rol === "cliente" ? <Navigate to="/dashboard" /> :
          <Navigate to="/login" />
        }/>

        {/* Rutas privadas con roles */}
        <Route 
          path="/admin/dashboard" 
          element={<PrivateRoute component={AdminDashboard} roles={['admin']} />} 
        />
        <Route 
          path="/employee/dashboard" 
          element={<PrivateRoute component={EmpleadoDashboard} roles={['empleado', 'admin']} />} 
        />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute component={ClienteDashboard} roles={['cliente', 'empleado', 'admin']} />} 
        />

        {/* CRUD de departamentos solo para admin */}
        <Route 
          path="/admin/departamentos" 
          element={<PrivateRoute component={DepartamentoPage} roles={['admin']} />} 
        />
      </Routes>
    </Router>
  );
}
