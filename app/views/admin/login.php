<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | ImersaLab</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f6f6f6; color: #222; margin: 0; padding: 0; }
        .container { max-width: 420px; margin: 80px auto; background: #fff; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.08); padding: 32px; }
        .brand { color: #006633; margin-bottom: 24px; text-align: center; }
        .brand h1 { margin: 0; font-size: 1.8rem; }
        label { display: block; margin-bottom: 8px; font-weight: bold; }
        input { width: 100%; padding: 12px; margin-bottom: 16px; border: 1px solid #ddd; border-radius: 6px; }
        button { width: 100%; padding: 12px; background: #006633; border: none; color: white; border-radius: 6px; font-size: 1rem; cursor: pointer; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; }
        .alert.error { background: #ffe6e6; color: #8a1f1f; }
    </style>
</head>
<body>
    <div class="container">
        <div class="brand">
            <h1>ImersaLab</h1>
            <p>Painel Administrativo</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="alert error"><?= $this->escape($error) ?></div>
        <?php endif; ?>

        <form method="post" action="/admin/login">
            <input type="hidden" name="_csrf_token" value="<?= $this->escape($this->generateCsrfToken()) ?>">
            <label for="email">E-mail</label>
            <input id="email" type="email" name="email" required>

            <label for="senha">Senha</label>
            <input id="senha" type="password" name="senha" required>

            <button type="submit">Entrar</button>
        </form>
    </div>
</body>
</html>
