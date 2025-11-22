# API Documentation

## Introducción

Este documento describe los endpoints principales del backend del ecommerce. Cada sección está organizada por app y recursos, siguiendo una estructura clara y consistente.

---

## Autenticación y Usuarios

**Base URL:** `/api/usuarios/`

### **1. Registro de usuario**

**POST** `/api/usuarios/registro/`
Crea un nuevo usuario.

### **2. Login (por email o identificación)**

**POST** `/api/token/`
Devuelve access y refresh tokens.

### **3. Perfil del usuario autenticado**

**GET** `/api/usuarios/perfil/`
Devuelve los datos del usuario logueado.

---

## Productos

**Base URL:** `/api/productos/`

### **1. Lista de productos**

**GET** `/api/productos/`

### **2. Detalle de un producto**

**GET** `/api/productos/<id>/`

### **3. Crear producto** (staff/admin)

**POST** `/api/productos/`

### **4. Buscar productos**

**GET** `/api/productos/buscar/?q=texto`

---

## Categorías

**Base URL:** `/api/categorias/`

### **1. Listar categorías**

**GET** `/api/categorias/`

### **2. Crear categoría** (admin)

**POST** `/api/categorias/`

---

## Carrito

**Base URL:** `/api/carrito/`

### **1. Ver carrito**

**GET** `/api/carrito/`

### **2. Añadir producto al carrito**

**POST** `/api/carrito/agregar/`

* `{ producto_id, cantidad }`

### **3. Vaciar carrito**

**POST** `/api/carrito/vaciar/`

---

## Pedidos

**Base URL:** `/api/pedidos/`

### **1. Listar pedidos del usuario**

**GET** `/api/pedidos/mis-pedidos/`

### **2. Crear pedido**

**POST** `/api/pedidos/crear/`

### **3. Detalle del pedido**

**GET** `/api/pedidos/<id>/`

---

## Pagos

**Base URL:** `/api/pagos/`

### **1. Crear orden PayPal**

**POST** `/api/pagos/paypal/create/`

* `{ invoice_id }`

### **2. Capturar orden PayPal**

**POST** `/api/pagos/paypal/capture/`

* `{ order_id }`

---

## Notificaciones

**Base URL:** `/api/notificaciones/`

### **1. Listar notificaciones del usuario**

**GET** `/api/notificaciones/`

### **2. Marcar como leída**

**POST** `/api/notificaciones/<id>/leer/`

---

## PQRS

**Base URL:** `/api/pqrs/`

### **1. Crear PQRS**

**POST** `/api/pqrs/`

### **2. Listar PQRS del usuario**

**GET** `/api/pqrs/mios/`

---

## Departamentos

**Base URL:** `/api/departamentos/`

### **1. Listar departamentos**

**GET** `/api/departamentos/`

---

## Municipios

**Base URL:** `/api/municipios/`

### **1. Listar municipios**

**GET** `/api/municipios/`

---

## Panel Administrador

**Base URL:** `/api/panel-administrador/`

### **1. Visión general del panel**

**GET** `/api/panel-administrador/overview/`

Retorna estadísticas globales:

* Total usuarios
* Total ventas
* Total pedidos del día
* Productos más vendidos

---

## Notas finales

* Todos los endpoints relevantes están protegidos mediante **JWT**.
* El acceso a funciones administrativas requiere rol **empleado** o **admin**.
* El carrito y pedidos siempre pertenecen al usuario autenticado.

---

## Próximas mejoras sugeridas

* Versionado (ej. `/api/v1/...`)
* Documentación Swagger automática
* Tests unitarios para cada endpoint
