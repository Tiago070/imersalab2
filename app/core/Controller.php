<?php
// app/core/Controller.php

class RedirectException extends Exception {}

class Controller
{
    protected array $viewData = [];

    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $this->ensureSessionTimeout();
    }

    protected function render(string $view, array $data = []): void
    {
        $this->viewData = array_merge($this->viewData, $data);
        extract($this->viewData, EXTR_SKIP);
        $viewPath = __DIR__ . '/../views/' . $view . '.php';

        if (!file_exists($viewPath)) {
            $this->sendNotFound();
        }

        require $viewPath;
    }

    protected function redirect(string $url): void
    {
        if (PHP_SAPI === 'cli') {
            throw new RedirectException($url);
        }

        header('Location: ' . $url);
        exit;
    }

    protected function setFlash(string $key, string $message): void
    {
        $_SESSION['flash_messages'][$key] = $message;
    }

    protected function getFlash(string $key): ?string
    {
        $message = $_SESSION['flash_messages'][$key] ?? null;
        if (isset($_SESSION['flash_messages'][$key])) {
            unset($_SESSION['flash_messages'][$key]);
        }
        return $message;
    }

    protected function isAuthenticated(): bool
    {
        return !empty($_SESSION['user_id']);
    }

    protected function requireAuth(): void
    {
        if (!$this->isAuthenticated()) {
            $this->redirect('/admin/login');
        }
    }

    protected function json(array $data, int $status = 200): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    protected function escape($value): string
    {
        return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
    }

    protected function generateCsrfToken(): string
    {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['csrf_token'];
    }

    protected function validateCsrfToken(?string $token): bool
    {
        return is_string($token)
            && !empty($_SESSION['csrf_token'])
            && hash_equals($_SESSION['csrf_token'], $token);
    }

    protected function requireCsrfToken(): void
    {
        $token = $_POST['_csrf_token'] ?? null;

        if (!$this->validateCsrfToken($token)) {
            $this->json(['status' => 'error', 'message' => 'Token CSRF inválido'], 403);
        }
    }

    private function ensureSessionTimeout(): void
    {
        $timeout = 1800; // 30 minutes

        if (!empty($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $timeout) {
            session_unset();
            session_destroy();
            session_start();
        }

        $_SESSION['last_activity'] = time();
    }

    private function sendNotFound(): void
    {
        header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
        echo '404 Not Found';
        exit;
    }
}
