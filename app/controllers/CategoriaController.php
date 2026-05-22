<?php
// app/controllers/CategoriaController.php

class CategoriaController extends Controller
{
    private Categoria $categoriaModel;
    private Ambiente $ambienteModel;

    public function __construct()
    {
        parent::__construct();
        $this->categoriaModel = new Categoria();
        $this->ambienteModel = new Ambiente();
    }

    public function index(): void
    {
        $this->requireAuth();
        $message = $this->getFlash('message');
        $error = $this->getFlash('error');
        $categorias = $this->categoriaModel->findAllWithCount();

        $this->render('admin/categorias/index', [
            'categorias' => $categorias,
            'message' => $message,
            'error' => $error,
        ]);
    }

    public function create(): void
    {
        $this->requireAuth();
        $this->render('admin/categorias/form', ['categoria' => null]);
    }

    public function store(): void
    {
        $this->requireAuth();
        if (!$this->validateCsrfToken($_POST['_csrf_token'] ?? null)) {
            $this->setFlash('error', 'Token CSRF inválido.');
            $this->redirect('/admin/categorias');
        }

        $nome = trim($_POST['nome'] ?? '');
        $descricao = trim($_POST['descricao'] ?? '');

        if ($nome === '') {
            $this->setFlash('error', 'O nome da categoria é obrigatório.');
            $this->redirect('/admin/categorias/create');
        }

        $this->categoriaModel->create(['nome' => $nome, 'descricao' => $descricao]);
        $this->setFlash('message', 'Categoria criada com sucesso.');
        $this->redirect('/admin/categorias');
    }

    public function edit(string $id): void
    {
        $this->requireAuth();
        $categoria = $this->categoriaModel->find((int)$id);

        if (!$categoria) {
            $this->setFlash('error', 'Categoria não encontrada.');
            $this->redirect('/admin/categorias');
        }

        $this->render('admin/categorias/form', ['categoria' => $categoria]);
    }

    public function update(string $id): void
    {
        $this->requireAuth();
        if (!$this->validateCsrfToken($_POST['_csrf_token'] ?? null)) {
            $this->setFlash('error', 'Token CSRF inválido.');
            $this->redirect('/admin/categorias');
        }

        $nome = trim($_POST['nome'] ?? '');
        $descricao = trim($_POST['descricao'] ?? '');

        if ($nome === '') {
            $this->setFlash('error', 'O nome da categoria é obrigatório.');
            $this->redirect('/admin/categorias/' . $id . '/edit');
        }

        $this->categoriaModel->update((int)$id, ['nome' => $nome, 'descricao' => $descricao]);
        $this->setFlash('message', 'Categoria atualizada com sucesso.');
        $this->redirect('/admin/categorias');
    }

    public function delete(string $id): void
    {
        $this->requireAuth();

        if (empty($_SESSION['nivel_acesso']) || $_SESSION['nivel_acesso'] !== 'admin') {
            $this->setFlash('error', 'Apenas administradores podem excluir categorias.');
            $this->redirect('/admin/categorias');
        }

        if (!$this->validateCsrfToken($_POST['_csrf_token'] ?? null)) {
            $this->setFlash('error', 'Token CSRF inválido.');
            $this->redirect('/admin/categorias');
        }

        try {
            $this->categoriaModel->delete((int)$id);
            $this->setFlash('message', 'Categoria excluída com sucesso.');
        } catch (Exception $e) {
            $this->setFlash('error', $e->getMessage());
        }

        $this->redirect('/admin/categorias');
    }
}
