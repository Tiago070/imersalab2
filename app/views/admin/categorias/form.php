<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $categoria ? 'Editar' : 'Nova' ?> Categoria | ImersaLab</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f2f5f1; margin: 0; color: #222; }
        header { background: #006633; color: white; padding: 20px 24px; }
        main { max-width: 760px; margin: 24px auto; padding: 0 24px; }
        form { background: #fff; padding: 24px; border-radius: 16px; box-shadow: 0 14px 32px rgba(0,0,0,0.08); }
        label { display: block; margin-bottom: 8px; font-weight: bold; }
        input, textarea { width: 100%; padding: 12px; margin-bottom: 16px; border: 1px solid #ccc; border-radius: 10px; }
        textarea { min-height: 140px; }
        button { padding: 12px 18px; border: none; border-radius: 10px; color: #fff; background: #006633; cursor: pointer; }
    </style>
</head>
<body>
    <header>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
            <div>
                <h1><?= $categoria ? 'Editar' : 'Nova' ?> Categoria</h1>
                <p><?= $categoria ? 'Atualize os dados da categoria.' : 'Cadastre uma nova categoria.' ?></p>
            </div>
            <div>
                <a href="/admin/categorias" style="color:#fff; text-decoration:none; background: rgba(255,255,255,0.18); padding: 10px 16px; border-radius: 10px;">Voltar</a>
            </div>
        </div>
    </header>
    <main>
        <form method="post" action="<?= $categoria ? '/admin/categorias/' . $this->escape($categoria['id']) . '/update' : '/admin/categorias/store' ?>">
            <input type="hidden" name="_csrf_token" value="<?= $this->escape($this->generateCsrfToken()) ?>">

            <label for="nome">Nome</label>
            <input id="nome" name="nome" type="text" value="<?= $categoria ? $this->escape($categoria['nome']) : '' ?>" required>

            <label for="descricao">Descrição</label>
            <textarea id="descricao" name="descricao"><?= $categoria ? $this->escape($categoria['descricao']) : '' ?></textarea>

            <button type="submit"><?= $categoria ? 'Atualizar categoria' : 'Criar categoria' ?></button>
        </form>
    </main>
</body>
</html>
