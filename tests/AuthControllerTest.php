<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/bootstrap.php';

class AuthControllerTest extends TestCase
{
    protected function setUp(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        $_SESSION = [];
    }

    public function testLoginComCredenciaisInvalidas(): void
    {
        $_SESSION['csrf_token'] = 'token123';
        $_POST = [
            'email' => 'naoexistente@imersalab.ifgoiano.edu.br',
            'senha' => 'senhaerrada',
            '_csrf_token' => 'token123',
        ];

        $controller = new AuthController();

        try {
            $controller->loginPost();
            $this->fail('A ação deveria redirecionar e lançar RedirectException.');
        } catch (RedirectException $exception) {
            $this->assertSame('/admin/login', $exception->getMessage());
            $this->assertSame('Credenciais inválidas.', $_SESSION['flash_messages']['error']);
        }
    }

    public function testLoginComCredenciaisValidas(): void
    {
        $email = 'testuser@imersalab.ifgoiano.edu.br';
        $password = 'SenhaTeste123!';
        $hash = password_hash($password, PASSWORD_BCRYPT);

        $pdo = Database::getInstance();
        $stmt = $pdo->prepare('INSERT INTO USUARIOS (nome, email, senha_hash, nivel_acesso, ativo) VALUES (:nome, :email, :senha_hash, :nivel_acesso, :ativo)');
        $stmt->execute([
            'nome' => 'Teste Unitário',
            'email' => $email,
            'senha_hash' => $hash,
            'nivel_acesso' => 'editor',
            'ativo' => 1,
        ]);
        $userId = (int)$pdo->lastInsertId();

        $_SESSION['csrf_token'] = 'tokenValid123';
        $_POST = [
            'email' => $email,
            'senha' => $password,
            '_csrf_token' => 'tokenValid123',
        ];

        $controller = new AuthController();

        try {
            $controller->loginPost();
            $this->fail('A ação deveria redirecionar e lançar RedirectException.');
        } catch (RedirectException $exception) {
            $this->assertSame('/admin/dashboard', $exception->getMessage());
            $this->assertSame($userId, $_SESSION['user_id']);
            $this->assertSame('editor', $_SESSION['nivel_acesso']);
        }

        $pdo->prepare('DELETE FROM USUARIOS WHERE id = :id')->execute(['id' => $userId]);
    }
}
