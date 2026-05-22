<?php
// app/models/Categoria.php

class Categoria extends Model
{
    protected string $table = 'CATEGORIAS';
    protected string $primaryKey = 'id';

    public function findAllWithCount(): array
    {
        $sql = 'SELECT c.*, COUNT(a.id) AS ambientes_count
                FROM CATEGORIAS c
                LEFT JOIN AMBIENTES a ON a.categoria_id = c.id
                GROUP BY c.id
                ORDER BY c.nome ASC';
        $stmt = $this->query($sql);
        return $stmt->fetchAll();
    }

    public function create(array $data): int
    {
        $sql = 'INSERT INTO CATEGORIAS (nome, descricao) VALUES (:nome, :descricao)';
        $this->query($sql, [
            'nome' => $data['nome'],
            'descricao' => $data['descricao'] ?? null,
        ]);

        return (int)self::$db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE CATEGORIAS SET nome = :nome, descricao = :descricao WHERE id = :id';
        $stmt = $this->query($sql, [
            'nome' => $data['nome'],
            'descricao' => $data['descricao'] ?? null,
            'id' => $id,
        ]);

        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $count = $this->countAmbientes($id);

        if ($count > 0) {
            throw new Exception('Não é possível excluir categoria com ambientes associados.');
        }

        $sql = 'DELETE FROM CATEGORIAS WHERE id = :id';
        $stmt = $this->query($sql, ['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function countAmbientes(int $categoriaId): int
    {
        $sql = 'SELECT COUNT(*) AS total FROM AMBIENTES WHERE categoria_id = :categoria_id';
        $stmt = $this->query($sql, ['categoria_id' => $categoriaId]);
        $result = $stmt->fetch();
        return (int)($result['total'] ?? 0);
    }
}
