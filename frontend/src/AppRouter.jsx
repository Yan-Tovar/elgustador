import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import DepartamentoPage from "./pages/DepartamentoPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmpleadoDashboard from "./pages/EmpleadoDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";
import ProductosPage from "./pages/ProductosPage";
import CategoriasPage from "./pages/CategoriasPage";
import DetalleCategoria from "./pages/DetalleCategoria";

// CRUD Admin
import CategoriasList from "./views/admin/categorias/CategoriasList";
import CategoriaCreate from "./views/admin/categorias/CategoriaCreate";
import CategoriaEdit from "./views/admin/categorias/CategoriaEdit";

import ProductosList from "./views/admin/productos/ProductosList";
import ProductoCreate from "./views/admin/productos/ProductoCreate";
import ProductoEdit from "./views/admin/productos/ProductoEdit";

import OfertasList from "./views/admin/ofertas/OfertasList";
import OfertaCreate from "./views/admin/ofertas/OfertaCreate";
import OfertaEdit from "./views/admin/ofertas/OfertaEdit";

import AdminPedidos from "./views/admin/pedidos/AdminPedidos";

import AdminFacturas from "./views/admin/facturas/AdminFacturas";

// CRUD Notas (cualquier usuario logueado)
import NotasList from "./views/notas/NotasList";
import NotaCreate from "./views/notas/NotaCreate";
import NotaEdit from "./views/notas/NotaEdit";

// Carrito y sus acciones
import CarritoPage from "./pages/CarritoPage";
import CarritoEventosPage from "./pages/CarritoEventosPage";

import PedidosPage from "./pages/PedidosPage";
import PedidoDetallePage from "./pages/PedidoDetallePage";

import CheckoutFlow from "./pages/CheckoutFlow"

import FacturaPage from "./pages/FacturaPage";
import FacturasPage from "./pages/FacturasPage";

import PrivateRoute from "./components/PrivateRoute";
import { Check } from "@mui/icons-material";

export default function AppRouter() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>

        {/* =====================================
              RUTAS PÚBLICAS
        ===================================== */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/" />} 
        />

        <Route 
          path="/register" 
          element={!user ? <RegisterPage /> : <Navigate to="/" />} 
        />

        <Route 
          path="/passwordreset" 
          element={!user ? <PasswordResetRequest /> : <Navigate to="/" />} 
        />

        <Route 
          path="/auth/reset-password/:uid/:token" 
          element={!user ? <PasswordResetConfirm /> : <Navigate to="/" />} 
        />

        {/* =====================================
              REDIRECCIÓN POR ROL
        ===================================== */}
        <Route 
          path="/" 
          element={
            user?.rol === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : user?.rol === "empleado" ? (
              <Navigate to="/employee/dashboard" />
            ) : user?.rol === "cliente" ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* =====================================
              DASHBOARDS PRIVADOS
        ===================================== */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute 
              component={AdminDashboard} 
              roles={['admin']} 
            />
          } 
        />

        <Route 
          path="/employee/dashboard" 
          element={
            <PrivateRoute 
              component={EmpleadoDashboard} 
              roles={['empleado', 'admin']} 
            />
          } 
        />

        <Route
          path="/categorias"
          element={
            <PrivateRoute
              component={CategoriasPage}
              roles={["cliente", "empleado", "admin"]}
            />
          }
        />

        <Route
          path="/categorias/:id"
          element={
            <PrivateRoute
              component={DetalleCategoria}
              roles={["cliente", "empleado", "admin"]}
            />
          }
        />

        <Route
          path="/productos"
          element={
            <PrivateRoute
              component={ProductosPage}
              roles={["cliente", "empleado", "admin"]}
            />
          }
        />

        <Route 
          path="/pedidos" 
          element={
            <PrivateRoute 
              component={PedidosPage}
              roles={["cliente", "empleado", "admin"]}
            />
          } 
        />

        <Route 
          path="/pedidos/:id" 
          element={
            <PrivateRoute 
              component={PedidoDetallePage}
              roles={["cliente", "empleado", "admin"]}
            />
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute 
              component={ClienteDashboard} 
              roles={['cliente', 'empleado', 'admin']} 
            />
          } 
        />

        <Route 
          path="/checkout" 
          element={
            <PrivateRoute 
              component={CheckoutFlow} 
              roles={['cliente', 'empleado', 'admin']} 
            />}
        />

        <Route 
          path="/checkout/:pedidoId" 
          element={
            <PrivateRoute 
              component={CheckoutFlow} 
              roles={['cliente', 'empleado', 'admin']} 
            />}
        />

        <Route 
          path="/factura/:facturaId" 
          element={
            <PrivateRoute 
              component={FacturaPage} 
              roles={['cliente', 'empleado', 'admin']} 
            />} 
        />

        <Route 
          path="/facturas" 
          element={
            <PrivateRoute 
              component={FacturasPage} 
              roles={['cliente', 'empleado', 'admin']} 
            />} 
        />

        {/* =====================================
              CRUD DEPARTAMENTOS — SOLO ADMIN
        ===================================== */}
        <Route 
          path="/admin/departamentos" 
          element={
            <PrivateRoute 
              component={DepartamentoPage} 
              roles={['admin']} 
            />
          } 
        />

        {/* ============================================================
                CRUD CATEGORÍAS — SOLO ADMIN
        ============================================================ */}
        <Route
          path="/admin/categorias"
          element={<PrivateRoute component={CategoriasList} roles={['admin']} />}
        />

        <Route
          path="/admin/categorias/nuevo"
          element={<PrivateRoute component={CategoriaCreate} roles={['admin']} />}
        />

        <Route
          path="/admin/categorias/:id/editar"
          element={<PrivateRoute component={CategoriaEdit} roles={['admin']} />}
        />

        {/* ============================================================
                PEDIDOS - FACTURAS — SOLO ADMIN
        ============================================================ */}

        <Route
          path="/admin/pedidos"
          element={<PrivateRoute component={AdminPedidos} roles={['admin']} />}
        />

        <Route
          path="/admin/facturas"
          element={<PrivateRoute component={AdminFacturas} roles={['admin']} />}
        />

        {/* ============================================================
                CRUD PRODUCTOS — SOLO ADMIN
        ============================================================ */}
        <Route
          path="/admin/productos"
          element={<PrivateRoute component={ProductosList} roles={['admin']} />}
        />

        <Route
          path="/admin/productos/nuevo"
          element={<PrivateRoute component={ProductoCreate} roles={['admin']} />}
        />

        <Route
          path="/admin/productos/:id/editar"
          element={<PrivateRoute component={ProductoEdit} roles={['admin']} />}
        />

        {/* ============================================================
                CRUD OFERTAS — SOLO ADMIN
        ============================================================ */}
        <Route
          path="/admin/ofertas"
          element={<PrivateRoute component={OfertasList} roles={['admin']} />}
        />

        <Route
          path="/admin/ofertas/nuevo"
          element={<PrivateRoute component={OfertaCreate} roles={['admin']} />}
        />

        <Route
          path="/admin/ofertas/:id/editar"
          element={<PrivateRoute component={OfertaEdit} roles={['admin']} />}
        />

        {/* ============================================================
                CRUD NOTAS — CUALQUIER USUARIO LOGEADO
        ============================================================ */}
        <Route
          path="/notas"
          element={
            <PrivateRoute 
              component={NotasList} 
              roles={['admin', 'empleado', 'cliente']} 
            />
          }
        />

        <Route
          path="/notas/nueva"
          element={
            <PrivateRoute 
              component={NotaCreate} 
              roles={['admin', 'empleado', 'cliente']} 
            />
          }
        />

        <Route
          path="/notas/:id/editar"
          element={
            <PrivateRoute 
              component={NotaEdit} 
              roles={['admin', 'empleado', 'cliente']} 
            />
          }
        />
                
        {/* ============================================================
                CARRITO — ACCESO: cliente, empleado, admin
        ============================================================ */}
        <Route
          path="/carrito"
          element={
            <PrivateRoute
              component={CarritoPage}
              roles={["cliente", "empleado", "admin"]}
            />
          }
        />

        {/* ============================================================
                EVENTOS DE CARRITO — ACCESO: solo admin
        ============================================================ */}
        <Route
          path="/carrito-eventos"
          element={
            <PrivateRoute
              component={CarritoEventosPage}
              roles={["admin"]}
            />
          }
        />

      </Routes>
    </Router>
  );
}
