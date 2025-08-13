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

use App\Http\Controllers\ProductosController;
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\ApuntesController;

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

Route::get('/ajustesUsuario', [AjustesUsuarioController::class, 'show'])->name('ajustesUsuario.show');
Route::put('/ajustesUsuario', [AjustesUsuarioController::class, 'update'])->name('ajustesUsuario.update');
// Estas son las rutas para las subir y eliminar imagenes
Route::post('/ajustesUsuario', [AjustesUsuarioController::class, 'subir'])->name('ajustesUsuario.subir');
Route::delete('/ajustesUsuario', [AjustesUsuarioController::class, 'eliminar'])->name('ajustesUsuario.eliminar');
// Estas Son las rutas para el Crud de Productos
Route::resource('productos', ProductosController::class);
// Estas Son las rutas para el Crud de Categorias
Route::resource('categorias', CategoriasController::class);
// Estas son las rutas para el fujo de compra
Route::resource('carrito', CarritoController::class);

// Estas Son las rutas para el Crud de Apuntes
Route::resource('apuntes', ApuntesController::class);



/*
|--------------------------------------------------------------------------
| Ruta Dashboard General (Para pruebas o uso básico)
|--------------------------------------------------------------------------
| Esta ruta verifica si hay sesión iniciada (usuario_id), si no redirige al login.
| Si existe sesión, muestra un mensaje básico.
|--------------------------------------------------------------------------
*/