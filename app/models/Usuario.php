<?php
// app/models/Usuario.php

class Usuario extends Model
{
    protected string $table = 'USUARIOS';
    protected string $primaryKey = 'id';

    public function findByEmail(string $email): ?array
    {
        $sql = 'SELECT * FROM USUARIOS WHERE email = :email LIMIT 1';
        $stmt = $this->query($sql, ['email' => $email]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function findById(int $id): ?array
    {
        return $this->find($id);
    }
}
