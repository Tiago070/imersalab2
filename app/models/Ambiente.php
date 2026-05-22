<?php
// app/models/Ambiente.php

class Ambiente extends Model
{
    protected string $table = 'AMBIENTES';
    protected string $primaryKey = 'id';

    public function findAllWithCategory(): array
    {
        $sql = 'SELECT a.*, c.nome AS categoria_nome, c.id AS categoria_id
                FROM AMBIENTES a
                JOIN CATEGORIAS c ON a.categoria_id = c.id
                ORDER BY a.data_adicao DESC';
        $stmt = $this->query($sql);
        return $stmt->fetchAll();
    }

    public function findActive(?int $categoriaId = null): array
    {
        if ($categoriaId !== null && $categoriaId > 0) {
            $sql = 'SELECT a.*, c.nome AS categoria_nome, c.id AS categoria_id
                    FROM AMBIENTES a
                    JOIN CATEGORIAS c ON a.categoria_id = c.id
                    WHERE a.disponivel = 1 AND a.categoria_id = :categoria_id
                    ORDER BY a.data_adicao DESC';
            $stmt = $this->query($sql, ['categoria_id' => $categoriaId]);
        } else {
            $sql = 'SELECT a.*, c.nome AS categoria_nome, c.id AS categoria_id
                    FROM AMBIENTES a
                    JOIN CATEGORIAS c ON a.categoria_id = c.id
                    WHERE a.disponivel = 1
                    ORDER BY a.data_adicao DESC';
            $stmt = $this->query($sql);
        }

        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $sql = 'SELECT a.*, c.id AS categoria_id, c.nome AS categoria_nome
                FROM AMBIENTES a
                JOIN CATEGORIAS c ON a.categoria_id = c.id
                WHERE a.id = :id
                LIMIT 1';
        $stmt = $this->query($sql, ['id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function findBySlug(string $slug): ?array
    {
        $sql = 'SELECT a.*, c.id AS categoria_id, c.nome AS categoria_nome
                FROM AMBIENTES a
                JOIN CATEGORIAS c ON a.categoria_id = c.id
                WHERE a.slug = :slug
                LIMIT 1';
        $stmt = $this->query($sql, ['slug' => $slug]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function create(array $data): int
    {
        $sql = 'INSERT INTO AMBIENTES (slug, titulo, descricao, imagem_preview, imagem_360, categoria_id, criado_por, disponivel, data_adicao)
                VALUES (:slug, :titulo, :descricao, :imagem_preview, :imagem_360, :categoria_id, :criado_por, :disponivel, :data_adicao)';
        $this->query($sql, [
            'slug' => $data['slug'],
            'titulo' => $data['titulo'],
            'descricao' => $data['descricao'] ?? null,
            'imagem_preview' => $data['imagem_preview'] ?? null,
            'imagem_360' => $data['imagem_360'],
            'categoria_id' => $data['categoria_id'],
            'criado_por' => $data['criado_por'] ?? null,
            'disponivel' => $data['disponivel'],
            'data_adicao' => $data['data_adicao'],
        ]);

        return (int)self::$db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE AMBIENTES SET slug = :slug, titulo = :titulo, descricao = :descricao, imagem_preview = :imagem_preview,
                    imagem_360 = :imagem_360, categoria_id = :categoria_id, disponivel = :disponivel, data_adicao = :data_adicao
                WHERE id = :id';
        $stmt = $this->query($sql, [
            'slug' => $data['slug'],
            'titulo' => $data['titulo'],
            'descricao' => $data['descricao'] ?? null,
            'imagem_preview' => $data['imagem_preview'] ?? null,
            'imagem_360' => $data['imagem_360'],
            'categoria_id' => $data['categoria_id'],
            'disponivel' => $data['disponivel'],
            'data_adicao' => $data['data_adicao'],
            'id' => $id,
        ]);

        return $stmt->rowCount() > 0;
    }

    public function toggleDisponivel(int $id): bool
    {
        $sql = 'UPDATE AMBIENTES SET disponivel = IF(disponivel = 1, 0, 1) WHERE id = :id';
        $stmt = $this->query($sql, ['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM AMBIENTES WHERE id = :id';
        $stmt = $this->query($sql, ['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function countByCategoriaId(int $categoriaId): int
    {
        $sql = 'SELECT COUNT(*) AS total FROM AMBIENTES WHERE categoria_id = :categoria_id';
        $stmt = $this->query($sql, ['categoria_id' => $categoriaId]);
        $result = $stmt->fetch();
        return (int)($result['total'] ?? 0);
    }

    public function countByStatus(int $status): int
    {
        $sql = 'SELECT COUNT(*) AS total FROM AMBIENTES WHERE disponivel = :status';
        $stmt = $this->query($sql, ['status' => $status]);
        $result = $stmt->fetch();
        return (int)($result['total'] ?? 0);
    }

    public function findLast(int $limit = 5): array
    {
        $sql = 'SELECT a.*, c.nome AS categoria_nome FROM AMBIENTES a
                JOIN CATEGORIAS c ON a.categoria_id = c.id
                ORDER BY a.data_adicao DESC
                LIMIT :limit';
        $stmt = self::$db->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
