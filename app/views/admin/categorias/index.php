<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Categorias | ImersaLab</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; background: #f2f5f1; color: #222; }
        header { background: #006633; color: white; padding: 20px 24px; display:flex; justify-content:space-between; align-items:center; }
        header a { color: #fff; text-decoration: none; margin-left: 16px; }
        main { padding: 24px; }
        .toolbar { margin-bottom: 20px; }
        .button { display:inline-block; padding: 10px 16px; border-radius: 8px; text-decoration:none; color:#fff; background:#006633; }
        .alert { padding: 12px; border-radius: 10px; margin-bottom: 16px; }
        .alert.success { background: #e8f7e8; color: #1f5b27; }
        .alert.error { background: #fee3e5; color: #9d2a2f; }
        table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; }
        th, td { padding: 14px 16px; border-bottom: 1px solid #eee; }
        th { background: #f7f8f7; text-align:left; }
        .actions form { display:inline-block; margin:0 4px; }
        .actions a, .actions button { padding: 8px 10px; border-radius: 8px; text-decoration:none; border:none; cursor:pointer; color:#fff; }
        .actions a { background:#004d29; }
        .actions button { background:#a12d2e; }
    </style>
</head>
<body>
    <header>
        <div>
            <h1>Categorias</h1>
            <p>Gerencie as categorias do tour virtual</p>
        </div>
        <nav>
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/ambientes">Ambientes</a>
            <a href="/admin/logout">Sair</a>
        </nav>
    </header>
    <main>
        <?php if (!empty($message)): ?>
            <div class="alert success"><?= $this->escape($message) ?></div>
        <?php endif; ?>
        <?php if (!empty($error)): ?>
            <div class="alert error"><?= $this->escape($error) ?></div>
        <?php endif; ?>

        <div class="toolbar">
            <a class="button" href="/admin/categorias/create">Nova Categoria</a>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ambientes</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($categorias as $categoria): ?>
                    <tr>
                        <td><?= $this->escape($categoria['nome']) ?></td>
                        <td><?= $this->escape($categoria['descricao']) ?></td>
                        <td><?= $this->escape($categoria['ambientes_count']) ?></td>
                        <td class="actions">
                            <a href="/admin/categorias/<?= $this->escape($categoria['id']) ?>/edit">Editar</a>
                            <form method="post" action="/admin/categorias/<?= $this->escape($categoria['id']) ?>/delete">
                                <input type="hidden" name="_csrf_token" value="<?= $this->escape($this->generateCsrfToken()) ?>">
                                <button type="submit">Excluir</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</body>
</html>
