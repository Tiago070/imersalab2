<?php
// app/core/Router.php

class Router
{
    private array $routes = [];

    public function add(string $method, string $path, string $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'handler' => $handler,
            'pattern' => $this->createPattern($path),
        ];
    }

    public function dispatch(string $method, string $uri): void
    {
        $method = strtoupper($method);
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if (preg_match($route['pattern'], $path, $matches)) {
                $params = $this->extractParams($matches);
                $this->invokeHandler($route['handler'], $params);
                return;
            }
        }

        $this->sendNotFound();
    }

    private function createPattern(string $path): string
    {
        $escaped = preg_quote($path, '#');
        $pattern = preg_replace_callback('/\\\{([a-zA-Z0-9_]+)\\\}/', function ($matches) {
            return '(?P<' . $matches[1] . '>[^/]+)';
        }, $escaped);

        return '#^' . $pattern . '$#';
    }

    private function extractParams(array $matches): array
    {
        return array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
    }

    private function invokeHandler(string $handler, array $params): void
    {
        [$controllerName, $action] = explode('@', $handler);

        if (!class_exists($controllerName)) {
            $this->sendNotFound();
            return;
        }

        $controller = new $controllerName();

        if (!method_exists($controller, $action)) {
            $this->sendNotFound();
            return;
        }

        call_user_func_array([$controller, $action], $params);
    }

    private function sendNotFound(): void
    {
        header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
        echo '404 Not Found';
        exit;
    }
}
