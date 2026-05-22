<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | ImersaLab</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; background: #f2f5f1; color: #222; }
        header { background: #006633; color: #fff; padding: 20px 24px; }
        nav a { color: #fff; margin-right: 16px; text-decoration: none; }
        main { padding: 24px; }
        .cards { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 16px; margin-bottom: 24px; }
        .card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; }
        th, td { padding: 12px 14px; border-bottom: 1px solid #eee; }
        th { text-align: left; background: #f7f8f7; }
        .badge { display: inline-flex; padding: 4px 10px; border-radius: 999px; font-size: 0.85rem; }
        .badge.active { background: #dff5e1; color: #1a6c2d; }
        .badge.inactive { background: #f1f1f1; color: #666; }
    </style>
</head>
<body>
    <header>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
            <div>
                <h1>Dashboard</h1>
                <p>Painel administrativo do ImersaLab</p>
            </div>
            <div>
                <nav>
                    <a href="/admin/ambientes">Ambientes</a>
                    <a href="/admin/categorias">Categorias</a>
                    <a href="/admin/logout">Sair</a>
                </nav>
            </div>
        </div>
    </header>
    <main>
        <div class="cards">
            <div class="card"><strong>Ambientes ativos</strong><p><?= $this->escape($ambientesAtivos) ?></p></div>
            <div class="card"><strong>Ambientes inativos</strong><p><?= $this->escape($ambientesInativos) ?></p></div>
            <div class="card"><strong>Total de categorias</strong><p><?= $this->escape($categoriasTotal) ?></p></div>
        </div>

        <section>
            <h2>Últimos ambientes</h2>
            <table>
                <thead>
                    <tr><th>Título</th><th>Categoria</th><th>Data</th><th>Status</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($ultimosAmbientes as $ambiente): ?>
                        <tr>
                            <td><?= $this->escape($ambiente['titulo']) ?></td>
                            <td><?= $this->escape($ambiente['categoria_nome']) ?></td>
                            <td><?= $this->escape($ambiente['data_adicao']) ?></td>
                            <td><span class="badge <?= $ambiente['disponivel'] ? 'active' : 'inactive' ?>"><?= $ambiente['disponivel'] ? 'Ativo' : 'Inativo' ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>
    </main>
</body>
</html>
