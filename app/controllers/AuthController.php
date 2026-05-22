<?php
// app/controllers/AuthController.php

class AuthController extends Controller
{
    private Usuario $usuarioModel;

    public function __construct()
    {
        parent::__construct();
        $this->usuarioModel = new Usuario();
    }

    public function login(): void
    {
        if ($this->isAuthenticated()) {
            $this->redirect('/admin/dashboard');
        }

        $error = $this->getFlash('error');
        $this->render('admin/login', ['error' => $error]);
    }

    public function loginPost(): void
    {
        if (!$this->validateCsrfToken($_POST['_csrf_token'] ?? null)) {
            $this->setFlash('error', 'Token CSRF inválido.');
            $this->redirect('/admin/login');
        }

        $email = trim($_POST['email'] ?? '');
        $senha = $_POST['senha'] ?? '';

        if (empty($email) || empty($senha)) {
            $this->setFlash('error', 'Email e senha são obrigatórios.');
            $this->redirect('/admin/login');
        }

        $usuario = $this->usuarioModel->findByEmail($email);

        if (!$usuario || !$usuario['ativo'] || !password_verify($senha, $usuario['senha_hash'])) {
            $this->setFlash('error', 'Credenciais inválidas.');
            $this->redirect('/admin/login');
        }

        $_SESSION['user_id'] = $usuario['id'];
        $_SESSION['nivel_acesso'] = $usuario['nivel_acesso'];
        $_SESSION['last_activity'] = time();

        $this->redirect('/admin/dashboard');
    }

    public function logout(): void
    {
        session_unset();
        session_destroy();
        session_start();
        $this->redirect('/admin/login');
    }

    public function dashboard(): void
    {
        $this->requireAuth();

        $ambienteModel = new Ambiente();
        $categoriaModel = new Categoria();

        $ambientesAtivos = $ambienteModel->countByStatus(1);
        $ambientesInativos = $ambienteModel->countByStatus(0);
        $categoriasTotal = count($categoriaModel->findAll());
        $ultimosAmbientes = $ambienteModel->findLast(5);

        $this->render('admin/dashboard', [
            'ambientesAtivos' => $ambientesAtivos,
            'ambientesInativos' => $ambientesInativos,
            'categoriasTotal' => $categoriasTotal,
            'ultimosAmbientes' => $ultimosAmbientes,
        ]);
    }

    protected function isAdmin(): bool
    {
        return $this->isAuthenticated() && ($_SESSION['nivel_acesso'] ?? '') === 'admin';
    }
}
