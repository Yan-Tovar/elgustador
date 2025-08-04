<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>El Gustador</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

    <!-- Google Icons (Material Icons) -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Bootstrap CSS (v5.3.2) desde CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Tu CSS personalizado -->
    <link rel="stylesheet" href="{{ asset('css/EstiloObjetos.css') }}">
</head>
<body>

    <!-- Barra de Navegación -->

      @include('partials.barraNavegacion')

    {{-- Opciones de acceso rápido por rol --}}

    @if($usuario_rol == 'Administrador')
      
      <!-- Contenido visual para el Rol Administrador -->
            <div class="container">
              <div class="row">
                <div class="col">
                  <div class="-c-v4">
                    <h4>Botones de acceso rápido</h4>
                  </div>
                  <hr>
                  <div class="-c-v4 -c-v8">
                    <a href="Administrador_EstadisticasYReportes_General.html"><div class="-c-v5">
                      <div class="-e-v1">
                        <i class="material-icons">equalizer</i>
                      </div>
                      <div class="-e-v1">
                        <p>Estadisticas</p>
                      </div>
                    </div></a>
                    <a href="Administrador_EstadisticasYReportes_General.html"><div class="-c-v5">
                      <div class="-e-v1">
                        <i class="material-icons">equalizer</i>
                      </div>
                      <div class="-e-v1">
                        <p>Estadisticas</p>
                      </div>
                    </div></a>
                    <a href="Administrador_EstadisticasYReportes_General.html"><div class="-c-v5">
                      <div class="-e-v1">
                        <i class="material-icons">equalizer</i>
                      </div>
                      <div class="-e-v1">
                        <p>Estadisticas</p>
                      </div>
                    </div></a>
                </div>
                <br>
                </div>
              </div>
              <div class="-c-v4">
                <h4>Notificaciones</h4>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <div class="-c-v1">
                    <div class="-c-v4">
                      <i class="material-icons">notifications</i>
                      <h4>Empleado1 agregó una oferta</h4>
                    </div>
                    <div class="-c-v4">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Laborum rerum reprehenderit ex cupiditate perferendis consequuntur recusandae dolores unde suscipit.</p>
                    </div>
                  </div>
                  <br>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <div class="-c-v1">
                    <div class="-c-v4">
                      <i class="material-icons">notifications</i>
                      <h4>Empleado1 agregó una oferta</h4>
                    </div>
                    <div class="-c-v4">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Laborum rerum reprehenderit ex cupiditate perferendis consequuntur recusandae dolores unde suscipit.</p>
                    </div>
                  </div>
                  <br>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <div class="-c-v1">
                    <div class="-c-v4">
                      <i class="material-icons">notifications</i>
                      <h4>Empleado1 agregó una oferta</h4>
                    </div>
                    <div class="-c-v4">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Laborum rerum reprehenderit ex cupiditate perferendis consequuntur recusandae dolores unde suscipit.</p>
                    </div>
                  </div>
                  <br>
                </div>
              </div>
            </div>
            <br><br><br>
            <!-- Contenedor Inferior (Barra navegación) -->
              @include('partials.accesoRapido')
              
    @elseif($usuario_rol == 'Empleado')

        <!-- Contenido Visual para el rol empleado -->
        <!-- Carrusel -->
            @include('partials.carrusel')
            <!-- Botones -->
            <br>
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <div class="-c-v4">
                    <div class="-e-v1"><button type="button" class="-b-v5-v2">Añadir +</button></div>
                    <div class="-e-v1"><button type="button" class="-b-v5 ">Eliminar -</button></div>
                  </div>
                  <br>
                </div>
              </div> 
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <div class="-c-v4">
                    <h4 class="-tx-v2">Editar</h4> 
                  </div>
                  <hr>
                  <div class="-c-v8 -c-v4">
                    <a href="Empleado_Ofertas.html"><button type="button" class="-b-v2">Ofertas</button></a> 
                    <a href="Empleado_Pedidos_Generales.html"><button type="button" class="-b-v2">Pedidos</button></a> 
                    <a href="Empleado_Categoría.html"><button type="button" class="-b-v2">Categorias</button></a> 
                  </div>
                  <br>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <div class="-c-v4">
                    <h4 class="-tx-v2">Administrar</h4> 
                  </div>
                  <hr>
                  <div class="-c-v8 -c-v4">
                    <a href="Empleado_Tareas.html"><button type="button" class="-b-v2">Tareas</button></a> 
                    <a href="Empleado_Mercancia_Visualizacion.html"><button type="button" class="-b-v2">Mercancía</button></a> 
                    <a href="Empleado_Apuntes_Visualizacion.html"><button type="button" class="-b-v2">Mis Apuntes</button></a> 
                  </div>
                  <br>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <div class="-c-v4">
                    <h4 class="-tx-v2">Interactuar</h4> 
                  </div>
                  <hr>
                  <div class="-c-v8 -c-v4">
                    <a href="Cliente_PaginaPrincipal.html"><button type="button" class="-b-v2">Usuario Cliente</button></a> 
                    <a href="Empleado_Mensaje.html"><button type="button" class="-b-v2">Chat administrador</button></a> 
                  </div>
                  <br>
                </div>
              </div>  
            </div>      
            <br><br><br>
            <!-- Contenedor Inferior (Barra navegación) -->
              @include('partials.accesoRapido')
    @elseif($usuario_rol == 'Cliente')
        <!-- Contenido Visual para el rol cliente -->
        <!-- Carrusel -->
            @include('partials.carrusel')
          <!-- Botones -->
            <br>
            <div class="container">
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <div class="-c-v4">
                    <a href="Cliente_Ofertas.html"><button type="button" class="-b-v3">Ofertas</button></a> 
                    <a href="Cliente_Pedidos_Proceso.html"><button type="button" class="-b-v3">Pedidos</button></a> 
                    <a href="Cliente_Categoria.html"><button type="button" class="-b-v3">Categorias</button></a> 
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <!-- Titulo del conponente -->
                  <br>
                  <div class="-c-v4">
                    <h4 class="-tx-v2">Destacado</h4>
                  </div>
                  <!-- Carrusel Destacado -->
                  <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                      <div class="carousel-item active" data-bs-interval="10000">
                        <!-- Contenedor de producto -->
                        <div class="-c-v3">
                          <div class="-c-v4">
                            <div class="-e-v1">
                              <img src="Imagenes/Producto1.png" alt="">
                            </div>
                            <div class="-e-v1">
                              <p><strong> Cenela molida 10g x 100 unidades</strong></p>
                            </div>
                          </div>
                          <div class="-c-v4">
                            <div class="-e-v2">
                              <p><strong>$ 1.000,00</strong></p>
                            </div>
                            <div class="-e-v2">
                              <a href="Cliente_Producto.html">Más Información</a>
                            </div>
                          </div><hr>
                          <div class="-c-v4">
                            <div class="-b-v6 -e-v2">
                              <button onclick="updateCount(-1)">−</button>
                              <input type="number" id="productCount" value="1" min="0">
                              <button onclick="updateCount(1)">+</button>
                            </div>
                            <a href="Cliente_Camion.html"><button type="button" class="-b-v5 -e-v2">Añadir +</button></a>
                          </div>
                        </div>
                      </div>
                      <div class="carousel-item" data-bs-interval="2000">
                        <!-- Contenedor de producto -->
                        <div class="-c-v3">
                          <div class="-c-v4">
                            <div class="-e-v1">
                              <img src="Imagenes/Producto1.png" alt="">
                            </div>
                            <div class="-e-v1">
                              <p><strong> Cenela molida 10g x 100 unidades</strong></p>
                            </div>
                          </div>
                          <div class="-c-v4">
                            <div class="-e-v2">
                              <p><strong>$ 1.000,00</strong></p>
                            </div>
                            <div class="-e-v2">
                              <a href="Cliente_Producto.html">Más Información</a>
                            </div>
                          </div><hr>
                          <div class="-c-v4">
                            <div class="-b-v6 -e-v2">
                              <button onclick="updateCount(-1)">−</button>
                              <input type="number" id="productCount" value="1" min="0">
                              <button onclick="updateCount(1)">+</button>
                            </div>
                            <a href="Cliente_Camion.html"><button type="button" class="-b-v5 -e-v2">Añadir +</button></a>
                          </div>
                        </div>
                      </div>
                      <div class="carousel-item">
                        <!-- Contenedor de producto -->
                        <div class="-c-v3">
                          <div class="-c-v4">
                            <div class="-e-v1">
                              <img src="Imagenes/Producto1.png" alt="">
                            </div>
                            <div class="-e-v1">
                              <p><strong> Cenela molida 10g x 100 unidades</strong></p>
                            </div>
                          </div>
                          <div class="-c-v4">
                            <div class="-e-v2">
                              <p><strong>$ 1.000,00</strong></p>
                            </div>
                            <div class="-e-v2">
                              <a href="Cliente_Producto.html">Más Información</a>
                            </div>
                          </div><hr>
                          <div class="-c-v4">
                            <div class="-b-v6 -e-v2">
                              <button onclick="updateCount(-1)">−</button>
                              <input type="number" id="productCount" value="1" min="0">
                              <button onclick="updateCount(1)">+</button>
                            </div>
                            <a href="Cliente_Camion.html"><button type="button" class="-b-v5 -e-v2">Añadir +</button></a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <!-- Titulo del conponente -->
                  <br>
                  <div class="-c-v4">
                    <h4 class="-tx-v2">Categoría de Productos</h4>
                  </div>
                  <div class="-c-v4">
                    <div class="-c-v8">
                      <a href="Cliente_Categoria.html"><div class="-c-v5">
                        <div>
                          <img src="Imagenes/Producto1.png" alt="">
                        </div>
                        <div>
                          <p>Categoria1</p>
                        </div>
                      </div></a>
                      <a href="Cliente_Categoria.html"><div class="-c-v5">
                        <div>
                          <img src="Imagenes/Producto1.png" alt="">
                        </div>
                        <div>
                          <p>Categoria1</p>
                        </div>
                      </div></a>
                      <a href="Cliente_Categoria.html"><div class="-c-v5">
                        <div>
                          <img src="Imagenes/Producto1.png" alt="">
                        </div>
                        <div>
                          <p>Categoria1</p>
                        </div>
                      </div></a>
                      <a href="Cliente_Categoria.html"><div class="-c-v5">
                        <div>
                          <img src="Imagenes/Producto1.png" alt="">
                        </div>
                        <div>
                          <p>Categoria1</p>
                        </div>
                      </div></a>
                    </div>
                  </div>
                </div>
              </div>  
            </div>      
            <br><br><br>
            <!-- Contenedor Inferior (Barra navegación) -->
              @include('partials.accesoRapido')
    @endif


  <!-- archivo JS Propio-->
  <script src="{{  asset('js/ScriptObjetos.js') }}"></script>
  <!-- Archivo JS Bootstrap -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>