<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $ambiente ? 'Editar' : 'Novo' ?> Ambiente | ImersaLab</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f2f5f1; color: #222; margin: 0; }
        header { background: #006633; color: white; padding: 20px 24px; }
        main { max-width: 900px; margin: 24px auto; padding: 0 24px; }
        form { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
        label { display: block; margin-bottom: 8px; font-weight: bold; }
        input, textarea, select { width: 100%; padding: 12px; margin-bottom: 16px; border: 1px solid #ccc; border-radius: 8px; }
        textarea { min-height: 140px; }
        button { padding: 12px 18px; border: none; border-radius: 10px; background: #006633; color: white; cursor: pointer; }
        .flex-row { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 16px; }
    </style>
    <script>
        function slugify(value) {
            return value.toString().toLowerCase()
                .normalize('NFD').replace(/\p{Diacritic}/gu, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }

        function bindSlug() {
            const title = document.querySelector('[name="titulo"]');
            const slug = document.querySelector('[name="slug"]');

            if (!title || !slug) return;
            title.addEventListener('input', () => {
                if (!slug.dataset.touched) {
                    slug.value = slugify(title.value);
                }
            });
            slug.addEventListener('input', () => { slug.dataset.touched = 'true'; });
        }

        window.addEventListener('DOMContentLoaded', bindSlug);
    </script>
</head>
<body>
    <header>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
            <div>
                <h1><?= $ambiente ? 'Editar' : 'Novo' ?> Ambiente</h1>
                <p><?= $ambiente ? 'Atualize os dados do ambiente.' : 'Cadastre um novo ambiente.' ?></p>
            </div>
            <div>
                <a href="/admin/ambientes" style="color:#fff; text-decoration:none; background: rgba(255,255,255,0.18); padding: 10px 16px; border-radius: 10px;">Voltar</a>
            </div>
        </div>
    </header>
    <main>
        <form method="post" action="<?= $ambiente ? '/admin/ambientes/' . $this->escape($ambiente['id']) . '/update' : '/admin/ambientes/store' ?>">
            <input type="hidden" name="_csrf_token" value="<?= $this->escape($this->generateCsrfToken()) ?>">

            <div class="flex-row">
                <div>
                    <label for="titulo">Título</label>
                    <input id="titulo" name="titulo" type="text" value="<?= $ambiente ? $this->escape($ambiente['titulo']) : '' ?>" required>
                </div>
                <div>
                    <label for="slug">Slug</label>
                    <input id="slug" name="slug" type="text" value="<?= $ambiente ? $this->escape($ambiente['slug']) : '' ?>" required>
                </div>
            </div>

            <label for="descricao">Descrição</label>
            <textarea id="descricao" name="descricao"><?= $ambiente ? $this->escape($ambiente['descricao']) : '' ?></textarea>

            <div class="flex-row">
                <div>
                    <label for="imagem_preview">URL imagem preview</label>
                    <input id="imagem_preview" name="imagem_preview" type="url" value="<?= $ambiente ? $this->escape($ambiente['imagem_preview']) : '' ?>">
                </div>
                <div>
                    <label for="imagem_360">URL imagem 360°</label>
                    <input id="imagem_360" name="imagem_360" type="url" value="<?= $ambiente ? $this->escape($ambiente['imagem_360']) : '' ?>" required>
                </div>
            </div>

            <div class="flex-row">
                <div>
                    <label for="categoria_id">Categoria</label>
                    <select id="categoria_id" name="categoria_id" required>
                        <option value="">Selecione uma categoria</option>
                        <?php foreach ($categorias as $categoria): ?>
                            <option value="<?= $this->escape($categoria['id']) ?>" <?= $ambiente && $ambiente['categoria_id'] == $categoria['id'] ? 'selected' : '' ?>>
                                <?= $this->escape($categoria['nome']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label for="data_adicao">Data de adição</label>
                    <input id="data_adicao" name="data_adicao" type="date" value="<?= $ambiente ? $this->escape($ambiente['data_adicao']) : date('Y-m-d') ?>" required>
                </div>
            </div>

            <label for="disponivel">Status</label>
            <select id="disponivel" name="disponivel">
                <option value="1" <?= !$ambiente || $ambiente['disponivel'] == 1 ? 'selected' : '' ?>>Ativo</option>
                <option value="0" <?= $ambiente && $ambiente['disponivel'] == 0 ? 'selected' : '' ?>>Inativo</option>
            </select>

            <button type="submit"><?= $ambiente ? 'Salvar alterações' : 'Criar ambiente' ?></button>
        </form>
    </main>
</body>
</html>
