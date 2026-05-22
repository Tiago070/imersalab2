<?php
// app/controllers/AmbienteController.php

class AmbienteController extends Controller
{
    private Ambiente $ambienteModel;
    private Categoria $categoriaModel;
    private PontoNavegacao $pontoModel;

    public function __construct()
    {
        parent::__construct();
        $this->ambienteModel = new Ambiente();
        $this->categoriaModel = new Categoria();
        $this->pontoModel = new PontoNavegacao();
    }

    public function index(): void
    {
        $this->requireAuth();
        $message = $this->getFlash('message');
        $error = $this->getFlash('error');
        $ambientes = $this->ambienteModel->findAllWithCategory();

        $this->render('admin/ambientes/index', [
            'ambientes' => $ambientes,
            'message' => $message,
            'error' => $error,
        ]);
    }

    public function create(): void
    {
        $this->requireAuth();
        $categorias = $this->categoriaModel->findAll();
        $this->render('admin/ambientes/form', [
            'ambiente' => null,
            'categorias' => $categorias,
        ]);
    }

    public function store(): void
    {
        $this->requireAuth();
        if (!$this->validateCsrfToken($_POST['_csrf_token'] ?? null)) {
            $this->setFlash('error', 'Token CSRF inválido.');
            $this->redirect('/admin/ambientes/create');
        }

        $data = $this->sanitizeAmbienteData($_POST);

        if (empty($data['titulo']) || empty($data['slug']) || empty($data['imagem_360']) || empty($data['categoria_id']) || empty($data['data_adicao'])) {
            $this->setFlash('error', 'Título, slug, imagem 360, categoria e data de adição são obrigatórios.');
            $this->redirect('/admin/ambientes/create');
        }

        $this->ambienteModel->create($data);
        $this->setFlash('message', 'Ambiente criado com sucesso.');
        $this->redirect('/admin/ambientes');
    }

    public function edit(string $id): void
    {
        $this->requireAuth();
        $ambiente = $this->ambienteModel->findById((int)$id);

        if (!$ambiente) {
            $this->setFlash('error', 'Ambiente não encontrado.');
            $this->redirect('/admin/ambientes');
        }

        $categorias = $this->categoriaModel->findAll();
        $this->render('admin/ambientes/form', [
            'ambiente' => $ambiente,
            'categorias' => $categorias,
        ]);
    }

    public function update(string $id): void
    {
        $this->requireAuth();
        if (!$this->validateCsrfToken($_POST['_csrf_token'] ?? null)) {
            $this->setFlash('error', 'Token CSRF inválido.');
            $this->redirect('/admin/ambientes');
        }

        $data = $this->sanitizeAmbienteData($_POST);

        if (empty($data['titulo']) || empty($data['slug']) || empty($data['imagem_360']) || empty($data['categoria_id']) || empty($data['data_adicao'])) {
            $this->setFlash('error', 'Título, slug, imagem 360, categoria e data de adição são obrigatórios.');
            $this->redirect('/admin/ambientes/' . $id . '/edit');
        }

        $this->ambienteModel->update((int)$id, $data);
        $this->setFlash('message', 'Ambiente atualizado com sucesso.');
        $this->redirect('/admin/ambientes');
    }

    public function delete(string $id): void
    {
        $this->requireAuth();

        if (empty($_SESSION['nivel_acesso']) || $_SESSION['nivel_acesso'] !== 'admin') {
            $this->setFlash('error', 'Apenas administradores podem excluir ambientes.');
            $this->redirect('/admin/ambientes');
        }

        if (!$this->validateCsrfToken($_POST['_csrf_token'] ?? null)) {
            $this->setFlash('error', 'Token CSRF inválido.');
            $this->redirect('/admin/ambientes');
        }

        $this->ambienteModel->delete((int)$id);
        $this->setFlash('message', 'Ambiente excluído com sucesso.');
        $this->redirect('/admin/ambientes');
    }

    public function toggle(string $id): void
    {
        $this->requireAuth();

        if (!$this->validateCsrfToken($_POST['_csrf_token'] ?? null)) {
            $this->setFlash('error', 'Token CSRF inválido.');
            $this->redirect('/admin/ambientes');
        }

        $this->ambienteModel->toggleDisponivel((int)$id);
        $this->setFlash('message', 'Status do ambiente atualizado.');
        $this->redirect('/admin/ambientes');
    }

    public function apiIndex(): void
    {
        $categoriaId = isset($_GET['categoria_id']) ? (int)$_GET['categoria_id'] : null;
        $ambientes = $this->ambienteModel->findActive($categoriaId);

        $data = array_map(function ($ambiente) {
            return [
                'id' => $ambiente['slug'],
                'titulo' => $ambiente['titulo'],
                'descricao' => $ambiente['descricao'],
                'imagemPreview' => $ambiente['imagem_preview'],
                'imagem360' => $ambiente['imagem_360'],
                'disponivel' => (bool)$ambiente['disponivel'],
                'dataAdicao' => $ambiente['data_adicao'],
                'categoria' => [
                    'id' => (int)$ambiente['categoria_id'],
                    'nome' => $ambiente['categoria_nome'],
                ],
            ];
        }, $ambientes);

        $this->json(['status' => 'success', 'data' => $data]);
    }

    public function apiShow(string $slug): void
    {
        $ambiente = $this->ambienteModel->findBySlug($slug);

        if (!$ambiente) {
            $this->json(['status' => 'error', 'message' => 'Ambiente não encontrado.'], 404);
        }

        $pontos = $this->pontoModel->findByAmbienteId((int)$ambiente['id']);

        $data = [
            'id' => $ambiente['slug'],
            'titulo' => $ambiente['titulo'],
            'imagem360' => $ambiente['imagem_360'],
            'pontosNavegacao' => array_map(function ($ponto) {
                return [
                    'id' => (int)$ponto['id'],
                    'label' => $ponto['label'],
                    'destinoSlug' => $ponto['destino_slug'],
                    'posicaoX' => (float)$ponto['posicao_x'],
                    'posicaoY' => (float)$ponto['posicao_y'],
                    'posicaoZ' => (float)$ponto['posicao_z'],
                ];
            }, $pontos),
            'categoria' => [
                'id' => (int)$ambiente['categoria_id'],
                'nome' => $ambiente['categoria_nome'],
            ],
        ];

        $this->json(['status' => 'success', 'data' => $data]);
    }

    private function sanitizeAmbienteData(array $input): array
    {
        return [
            'titulo' => trim($input['titulo'] ?? ''),
            'slug' => trim($input['slug'] ?? ''),
            'descricao' => trim($input['descricao'] ?? ''),
            'imagem_preview' => trim($input['imagem_preview'] ?? ''),
            'imagem_360' => trim($input['imagem_360'] ?? ''),
            'categoria_id' => (int)($input['categoria_id'] ?? 0),
            'disponivel' => isset($input['disponivel']) && $input['disponivel'] === '1' ? 1 : 0,
            'data_adicao' => trim($input['data_adicao'] ?? ''),
            'criado_por' => $_SESSION['user_id'] ?? null,
        ];
    }
}
