# Proyecto Ecommerce – Instrucciones de Instalación

    Este documento contiene únicamente los pasos esenciales para instalar y ejecutar el proyecto desde cero una vez clonado el repositorio, además de información básica de autoría. La documentación detallada del sistema se encuentra en los archivos complementarios dentro del proyecto.

## 1. Requisitos Previos

### Backend (Django)

    * Python 3.10+
    * PostgreSQL 13+
    * pip
    * virtualenv

### Frontend (React)

* Node.js 18+
* npm o yarn

## 2. Instalación del Proyecto

### 2.1 Clonar el Repositorio

    ```
    git clone https://github.com/Yan-Tovar/elgustador.git
    cd proyecto-ecommerce
    ```

## 3. Instalación del Backend

### 3.1 Crear y activar un entorno virtual

    ```
    cd backend
    python -m venv venv
    source venv/bin/activate
    venv\\Scripts\\activate
    ```

### 3.2 Instalar dependencias

    ```
    pip install -r requirements.txt
    ```

### 3.3 Configurar variables de entorno

    Crear archivo `.env` dentro de `backend`:

    ```
    SECRET_KEY=tu_clave
    DEBUG=True
    DATABASE_NAME=ecommerce
    DATABASE_USER=postgres
    DATABASE_PASSWORD=tu_password
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    EMAIL_HOST_USER=tu_correo
    EMAIL_HOST_PASSWORD=tu_password
    ```

### 3.4 Migraciones

    ```
    python manage.py migrate
    ```

### 3.5 Crear superusuario

    ```
    python manage.py createsuperuser
    ```

### 3.6 Ejecutar servidor

    ```
    python manage.py runserver
    ```

## 4. Instalación del Frontend

### 4.1 Instalar dependencias

    ```
    cd frontend
    npm install
    ```

### 4.2 Variables de entorno

Crear archivo `.env`:

    ```
    VITE_API_URL=http://127.0.0.1:8000/api
    ```

### 4.3 Ejecutar aplicación

    ```
    npm run dev
    ```

## 5. Estructura del Proyecto

    * backend/: API REST en Django
    * frontend/: Aplicación React
    * docs/: Documentación avanzada
    * README.md: Guía de instalación

## 6. Autoría

    Proyecto desarrollado por:
    Yan Tovar
    +57 3216486638

## 7. Licencia

    Este proyecto se distribuye bajo licencia privada o la que el autor determine.
