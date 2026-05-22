<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/bootstrap.php';

class AmbienteModelTest extends TestCase
{
    private Ambiente $ambienteModel;

    protected function setUp(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        $this->ambienteModel = new Ambiente();
    }

    private function createTestAmbiente(array $data): int
    {
        return $this->ambienteModel->create($data);
    }

    private function deleteAmbiente(int $id): void
    {
        $this->ambienteModel->delete($id);
    }

    public function testCriarAmbiente(): void
    {
        $slug = 'teste-ambiente-' . uniqid();
        $id = $this->createTestAmbiente([
            'slug' => $slug,
            'titulo' => 'Ambiente de Teste',
            'descricao' => 'Ambiente criado durante teste unitário.',
            'imagem_preview' => 'https://example.com/preview.jpg',
            'imagem_360' => 'https://example.com/360.jpg',
            'categoria_id' => 1,
            'criado_por' => 1,
            'disponivel' => 1,
            'data_adicao' => date('Y-m-d'),
        ]);

        $this->assertGreaterThan(0, $id);
        $this->deleteAmbiente($id);
    }

    public function testBuscarAmbienteAtivo(): void
    {
        $slugAtivo = 'teste-ativo-' . uniqid();
        $idAtivo = $this->createTestAmbiente([
            'slug' => $slugAtivo,
            'titulo' => 'Ambiente Ativo',
            'descricao' => 'Ambiente ativo para teste.',
            'imagem_preview' => 'https://example.com/preview-ativo.jpg',
            'imagem_360' => 'https://example.com/360-ativo.jpg',
            'categoria_id' => 1,
            'criado_por' => 1,
            'disponivel' => 1,
            'data_adicao' => date('Y-m-d'),
        ]);

        $slugInativo = 'teste-inativo-' . uniqid();
        $idInativo = $this->createTestAmbiente([
            'slug' => $slugInativo,
            'titulo' => 'Ambiente Inativo',
            'descricao' => 'Ambiente inativo para teste.',
            'imagem_preview' => 'https://example.com/preview-inativo.jpg',
            'imagem_360' => 'https://example.com/360-inativo.jpg',
            'categoria_id' => 1,
            'criado_por' => 1,
            'disponivel' => 0,
            'data_adicao' => date('Y-m-d'),
        ]);

        $resultados = $this->ambienteModel->findActive();
        $slugs = array_column($resultados, 'slug');

        $this->assertContains($slugAtivo, $slugs);
        $this->assertNotContains($slugInativo, $slugs);

        $this->deleteAmbiente($idAtivo);
        $this->deleteAmbiente($idInativo);
    }

    public function testToggleDisponivel(): void
    {
        $slug = 'teste-toggle-' . uniqid();
        $id = $this->createTestAmbiente([
            'slug' => $slug,
            'titulo' => 'Ambiente Toggle',
            'descricao' => 'Teste de alternância de disponibilidade.',
            'imagem_preview' => 'https://example.com/preview-toggle.jpg',
            'imagem_360' => 'https://example.com/360-toggle.jpg',
            'categoria_id' => 1,
            'criado_por' => 1,
            'disponivel' => 1,
            'data_adicao' => date('Y-m-d'),
        ]);

        $this->ambienteModel->toggleDisponivel($id);
        $ambiente = $this->ambienteModel->findById($id);
        $this->assertEquals(0, $ambiente['disponivel']);

        $this->ambienteModel->toggleDisponivel($id);
        $ambiente = $this->ambienteModel->findById($id);
        $this->assertEquals(1, $ambiente['disponivel']);

        $this->deleteAmbiente($id);
    }

    public function testImpedirExclusaoCategoriaComAmbientes(): void
    {
        $categoriaModel = new Categoria();

        $this->expectException(Exception::class);
        $categoriaModel->delete(1);
    }
}
