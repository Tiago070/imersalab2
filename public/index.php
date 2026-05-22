<?php
// public/index.php

session_start();

require_once __DIR__ . '/../app/core/Router.php';
require_once __DIR__ . '/../app/core/Controller.php';
require_once __DIR__ . '/../app/core/Model.php';
require_once __DIR__ . '/../config/database.php';

// Autoload controllers and models on demand
spl_autoload_register(function ($class) {
    $paths = [
        __DIR__ . '/../app/controllers/' . $class . '.php',
        __DIR__ . '/../app/models/' . $class . '.php',
    ];

    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
});

$router = new Router();

// Admin authentication
$router->add('GET', '/admin/login', 'AuthController@login');
$router->add('POST', '/admin/login', 'AuthController@loginPost');
$router->add('GET', '/admin/logout', 'AuthController@logout');

// Admin dashboard
$router->add('GET', '/admin/dashboard', 'AuthController@dashboard');

// Categoria routes
$router->add('GET', '/admin/categorias', 'CategoriaController@index');
$router->add('GET', '/admin/categorias/create', 'CategoriaController@create');
$router->add('POST', '/admin/categorias/store', 'CategoriaController@store');
$router->add('GET', '/admin/categorias/{id}/edit', 'CategoriaController@edit');
$router->add('POST', '/admin/categorias/{id}/update', 'CategoriaController@update');
$router->add('POST', '/admin/categorias/{id}/delete', 'CategoriaController@delete');

// Ambiente routes
$router->add('GET', '/admin/ambientes', 'AmbienteController@index');
$router->add('GET', '/admin/ambientes/create', 'AmbienteController@create');
$router->add('POST', '/admin/ambientes/store', 'AmbienteController@store');
$router->add('GET', '/admin/ambientes/{id}/edit', 'AmbienteController@edit');
$router->add('POST', '/admin/ambientes/{id}/update', 'AmbienteController@update');
$router->add('POST', '/admin/ambientes/{id}/delete', 'AmbienteController@delete');
$router->add('POST', '/admin/ambientes/{id}/toggle', 'AmbienteController@toggle');

// Public API routes
$router->add('GET', '/api/ambientes', 'AmbienteController@apiIndex');
$router->add('GET', '/api/ambientes/{slug}', 'AmbienteController@apiShow');

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
