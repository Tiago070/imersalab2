<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ambientes | ImersaLab</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; background: #f2f5f1; color: #222; }
        header { background: #006633; color: #fff; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
        header a { color: #fff; text-decoration: none; margin-left: 16px; }
        main { padding: 24px; }
        .toolbar { margin-bottom: 20px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .button { display:inline-block; padding: 10px 16px; border-radius: 8px; text-decoration:none; color:#fff; background:#006633; }
        .alert { padding: 12px; border-radius: 10px; margin-bottom: 16px; }
        .alert.success { background: #e8f7e8; color: #1f5b27; }
        .alert.error { background: #fee3e5; color: #9d2a2f; }
        table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; }
        th, td { padding: 14px 16px; border-bottom: 1px solid #eee; }
        th { background: #f7f8f7; text-align:left; }
        .badge { padding: 6px 12px; border-radius: 999px; font-size: 0.85rem; }
        .badge.active { background: #dff5e1; color: #1a6c2d; }
        .badge.inactive { background: #f3f3f3; color: #666; }
        .actions form { display:inline-block; margin:0 4px; }
        .actions button, .actions a { border:none; padding: 8px 10px; border-radius: 8px; text-decoration:none; color:#fff; font-size:0.9rem; cursor:pointer; }
        .actions a { background:#004d29; }
        .actions button { background:#006633; }
        .actions .delete { background:#a12d2e; }
    </style>
</head>
<body>
    <header>
        <div>
            <h1>Ambientes</h1>
            <p>Gerencie os ambientes do tour virtual</p>
        </div>
        <nav>
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/categorias">Categorias</a>
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
            <a class="button" href="/admin/ambientes/create">Novo Ambiente</a>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($ambientes as $ambiente): ?>
                    <tr>
                        <td><?= $this->escape($ambiente['titulo']) ?></td>
                        <td><?= $this->escape($ambiente['categoria_nome']) ?></td>
                        <td><span class="badge <?= $ambiente['disponivel'] ? 'active' : 'inactive' ?>"><?= $ambiente['disponivel'] ? 'Ativo' : 'Inativo' ?></span></td>
                        <td><?= $this->escape($ambiente['data_adicao']) ?></td>
                        <td class="actions">
                            <a href="/admin/ambientes/<?= $this->escape($ambiente['id']) ?>/edit">Editar</a>
                            <form method="post" action="/admin/ambientes/<?= $this->escape($ambiente['id']) ?>/toggle" style="display:inline-block;">
                                <input type="hidden" name="_csrf_token" value="<?= $this->escape($this->generateCsrfToken()) ?>">
                                <button type="submit"><?= $ambiente['disponivel'] ? 'Inativar' : 'Ativar' ?></button>
                            </form>
                            <form method="post" action="/admin/ambientes/<?= $this->escape($ambiente['id']) ?>/delete" style="display:inline-block;">
                                <input type="hidden" name="_csrf_token" value="<?= $this->escape($this->generateCsrfToken()) ?>">
                                <button type="submit" class="delete">Excluir</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</body>
</html>
