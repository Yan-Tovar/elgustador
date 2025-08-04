<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\VerificarRol;
use App\Http\Controllers\OpcionesUsuarioController;
use App\Http\Controllers\AjustesUsuarioController;

/*
|--------------------------------------------------------------------------
| Rutas Públicas (sin autenticación)
|--------------------------------------------------------------------------
*/

// Página principal (Index)
Route::get('/', function () {
    return view('index');
})->name('inicio');

// Vista de Login
Route::get('/login', function () {
    return view('login');
})->name('login');

// Procesa el Login (Formulario POST)
Route::post('/login', [LoginController::class, 'autenticar'])->name('login.procesar');

// Cierre de sesión (Logout)
Route::get('/logout', function () {
    Session::flush();  // Limpia toda la sesión
    return redirect()->route('login');
})->name('logout');

/*
|--------------------------------------------------------------------------
| Rutas Protegidas por Rol (Middleware VerificarRol)
|--------------------------------------------------------------------------
*/

// Dashboard Unico de Entrada (Pagina Principal)
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Vista de Usuario (Para todos los roles)
Route::get('/opcionesUsuario', [OpcionesUsuarioController::class, 'index'])->name('opcionesUsuario');

// Vista de AjustesUsuario (Para todos los roles)
Route::get('/ajustesUsuario', [AjustesUsuarioController::class, 'index'])->name('ajustesUsuario');

/*
|--------------------------------------------------------------------------
| Ruta Dashboard General (Para pruebas o uso básico)
|--------------------------------------------------------------------------
| Esta ruta verifica si hay sesión iniciada (usuario_id), si no redirige al login.
| Si existe sesión, muestra un mensaje básico.
|--------------------------------------------------------------------------
*/

