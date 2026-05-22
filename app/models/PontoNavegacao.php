<?php
// app/models/PontoNavegacao.php

class PontoNavegacao extends Model
{
    protected string $table = 'PONTOS_NAVEGACAO';
    protected string $primaryKey = 'id';

    public function findByAmbienteId(int $ambienteId): array
    {
        $sql = 'SELECT p.*, d.slug AS destino_slug
                FROM PONTOS_NAVEGACAO p
                JOIN AMBIENTES d ON p.destino_id = d.id
                WHERE p.ambiente_id = :ambiente_id
                ORDER BY p.id ASC';
        $stmt = $this->query($sql, ['ambiente_id' => $ambienteId]);
        return $stmt->fetchAll();
    }

    public function create(array $data): int
    {
        $sql = 'INSERT INTO PONTOS_NAVEGACAO (ambiente_id, destino_id, label, posicao_x, posicao_y, posicao_z)
                VALUES (:ambiente_id, :destino_id, :label, :posicao_x, :posicao_y, :posicao_z)';
        $this->query($sql, [
            'ambiente_id' => $data['ambiente_id'],
            'destino_id' => $data['destino_id'],
            'label' => $data['label'],
            'posicao_x' => $data['posicao_x'],
            'posicao_y' => $data['posicao_y'],
            'posicao_z' => $data['posicao_z'],
        ]);

        return (int)self::$db->lastInsertId();
    }

    public function deleteByAmbienteId(int $ambienteId): bool
    {
        $sql = 'DELETE FROM PONTOS_NAVEGACAO WHERE ambiente_id = :ambiente_id';
        $stmt = $this->query($sql, ['ambiente_id' => $ambienteId]);
        return $stmt->rowCount() > 0;
    }
}
