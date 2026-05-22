<?php
// config/database.php

class Database
{
    private static ?PDO $instance = null;

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
            $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
            $name = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'imersalab';
            $user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
            $password = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: '';

            $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            self::$instance = new PDO($dsn, $user, $password, $options);
        }

        return self::$instance;
    }
}

return Database::getInstance();
