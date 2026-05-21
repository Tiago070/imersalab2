# ImersaLab

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![License](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE-CC-BY-4.0)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![A-Frame](https://img.shields.io/badge/A--Frame-FF6B35?logo=aframe&logoColor=white)](https://aframe.io/)

> ImersaLab é uma plataforma de tours virtuais em 360° criada para apresentar os ambientes do IF Goiano — Campus Ceres com uma experiência imersiva e interativa.

---

## 🌟 O que é ImersaLab?

ImersaLab é uma aplicação web que combina:

- uma página principal responsiva com conteúdo institucional,
- um visualizador 360° dedicado para tours em ambientes do campus,
- um backend PHP que oferece dados via API e administra conteúdos.

A ideia é deixar o visitante navegar em um site estático leve, enquanto a parte dinâmica carrega os ambientes disponíveis por meio de uma API moderna.

---

## 🎓 Como a aplicação funciona

### Visão geral em linguagem simples

ImersaLab tem duas frentes principais:

1. **Site público** (`index.html` e arquivos de frontend)
   - mostra informações do projeto,
   - exibe cards dos ambientes disponíveis,
   - oferece um menu desktop/mobile e um botão para abrir o tour 360°.

2. **Visualizador 360°** (`viewer.html`)
   - carrega um ambiente específico usando o parâmetro `?id=` na URL,
   - renderiza uma esfera 360° com A-Frame,
   - permite trocar de ambiente e entrar em modo VR.

Além disso, há um backend PHP que alimenta esses dados e um conjunto de containers Docker para rodar tudo localmente.

### Como os dados chegam ao frontend

O frontend usa JavaScript para:

- buscar a lista de ambientes em `/api/ambientes`,
- armazenar os resultados em cache local,
- construir os cards e filtros na página principal,
- carregar o ambiente escolhido no visualizador.

Isso significa que o site pode ser apresentado com conteúdo dinâmico sem recarregar a página inteira.

---

## 🧱 Estrutura da aplicação

A aplicação está organizada em duas camadas principais:

### 1. Frontend

- `index.html` — página home com navegação, seções informativas e tour.
- `viewer.html` — visualizador 360° usando o framework A-Frame.
- `css/style.css` — estilos do site principal.
- `css/viewer.css` — estilos do visualizador 360°.
- `js/main.js` — lógica de interface, menu, filtros, renderização de cards e formulários.
- `js/viewer.js` — lógica do visualizador, carregamento de imagens 360°, navegação e VR.
- `js/api-ambientes.js` — módulo de API que busca os dados de ambiente e mantém cache.

### 2. Backend PHP

- `public/index.php` — front controller que recebe todas as requisições e direciona para o roteador.
- `app/core/Router.php` — mecanismo simples de roteamento que encontra a rota correta e invoca o controlador.
- `app/core/Controller.php` — classe base que oferece renderização, redirecionamento, respostas JSON e proteção CSRF.
- `app/core/Model.php` — classe base de modelo que gerencia a conexão PDO com o banco de dados.
- `app/controllers/` — controladores específicos do sistema, incluindo o `AmbienteController`.
- `config/database.php` — configuração de banco de dados MySQL via variáveis de ambiente.

### 3. Docker e infraestrutura local

- `docker-compose.yml` — orquestra os serviços:
  - `nginx` — servidor web e proxy reverso,
  - `php-app` — PHP 8.2 com Apache,
  - `mysql-db` — banco MySQL 8.0,
  - `ftp-server` — servidor FTP opcional.
- `docker/php/Dockerfile` — imagem PHP com extensões necessárias e Composer.
- `docker/nginx/default.conf` — configurações de proxy e entrega de arquivos estáticos.
- `database/schema.sql` e `database/seed.sql` — inicializam o esquema e dados do banco.
- `.env.example` — exemplo de variáveis de ambiente para rodar localmente.

---

## 📚 Estrutura do repositório

```text
imersalab/
├── app/
│   ├── controllers/          # Controladores MVC do backend
│   ├── core/                 # Kernel de Router, Controller e Model
│   ├── models/               # Modelos de dados e consultas ao banco
├── config/
│   └── database.php          # Configuração de conexão PDO
├── css/
│   ├── style.css             # Estilos do site principal
│   └── viewer.css            # Estilos do visualizador 360°
├── database/
│   ├── schema.sql            # Criação de tabelas
│   └── seed.sql              # Dados iniciais do banco
├── data/
│   └── ambientes.js          # Dados estáticos de ambiente
├── docker/
│   ├── nginx/default.conf    # Configuração do Nginx
│   └── php/Dockerfile        # Imagem PHP/Apache
├── js/
│   ├── api-ambientes.js      # Consumo da API pelo frontend
│   ├── main.js               # Interface principal do site
│   └── viewer.js             # Script do visualizador 360°
├── public/
│   └── index.php             # Entrada do backend PHP
├── tests/                    # Testes PHPUnit
├── .env.example              # Exemplo de variáveis de ambiente
├── docker-compose.yml        # Orquestração dos containers
├── manifest.json             # Configuração PWA
├── package.json              # Ferramentas de frontend / metadados
├── README.md                 # Documentação do projeto
└── LICENSE / LICENSE-CC-BY-4.0
```

---

## 🚀 Como executar localmente

### 1. Preparar o ambiente

- Copie o arquivo `.env.example` para `.env`.
- Ajuste os valores de `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` e `DB_ROOT_PASSWORD` conforme necessário.

### 2. Executar com Docker Compose

```bash
cd /home/tiago/imersalab
cp .env.example .env
docker compose up --build
```

O site ficará disponível em:

- `http://localhost` — front-end e API
- `http://localhost/admin` — área administrativa (quando implementada)

### 3. Testar a API diretamente

```bash
curl http://localhost/api/ambientes
```

Você deve receber um JSON com o conjunto de ambientes disponíveis.

---

## 🧪 Testes

O projeto usa PHPUnit para testes de backend.

Para rodar os testes dentro do container PHP:

```bash
docker compose exec php-app bash -lc 'vendor/bin/phpunit --testdox tests'
```

### O que já está testado

- criação de ambientes
- consulta de ambientes ativos
- alternância de disponibilidade de ambiente
- fluxo de autenticação básica

---

## 🛠️ Como a API está estruturada

### Rota pública principal

- `GET /api/ambientes`
  - retorna a lista de ambientes ativos.
- `GET /api/ambientes/{slug}`
  - retorna detalhes do ambiente identificado pelo slug.

### Consumo no frontend

- `js/api-ambientes.js` faz a chamada para `/api/ambientes`.
- `js/main.js` usa esses dados para criar os cards e filtros na página principal.
- `js/viewer.js` carrega o ambiente escolhido em `viewer.html?id=<slug>`.

---

## 💡 Boas práticas de desenvolvimento

- Use nomes de rota e `slug` consistentes entre backend e frontend.
- Mantenha os dados de ambiente sincronizados entre o banco de dados e o arquivo `data/ambientes.js`.
- Adicione testes sempre que criar novas rotas ou lógica de controller.
- Evite expor credenciais no repositório; use o `.env` local.
- Valide os formulários no frontend e no backend.

---

## 📄 Licença

- **MIT License** para o código-fonte.
- **Creative Commons Attribution 4.0 International (CC BY 4.0)** para conteúdo e material criativo.

Arquivos de licença:
- [LICENSE](LICENSE)
- [LICENSE-CC-BY-4.0](LICENSE-CC-BY-4.0)

---

## 📞 Contato

- **Autor:** Tiago Cardoso Ferreira
- **GitHub:** [@Tiago070](https://github.com/Tiago070)
- **Instituição:** IF Goiano — Campus Ceres

Última atualização: Maio 2026
