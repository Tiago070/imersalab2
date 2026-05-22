<?php
// app/core/Model.php

require_once __DIR__ . '/../../config/database.php';

class Model
{
    protected static ?PDO $db = null;
    protected string $table = '';
    protected string $primaryKey = 'id';

    public function __construct()
    {
        $this->initDb();
    }

    protected function initDb(): void
    {
        if (self::$db === null) {
            self::$db = Database::getInstance();
        }
    }

    protected function query(string $sql, array $params = []): PDOStatement
    {
        $stmt = self::$db->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue(is_int($key) ? $key + 1 : ':' . ltrim($key, ':'), $value);
        }
        $stmt->execute();
        return $stmt;
    }

    public function find($id): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id LIMIT 1";
        $stmt = $this->query($sql, ['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function findAll(): array
    {
        $sql = "SELECT * FROM {$this->table} ORDER BY {$this->primaryKey} DESC";
        $stmt = $this->query($sql);
        return $stmt->fetchAll();
    }
}
