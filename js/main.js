/**
 * MAIN.JS - Lógica Principal do Site
 * 
 * Este arquivo centraliza as funcionalidades principais do site:
 * - Controle de menu responsivo
 * - Renderização dinâmica de cards
 * - Gerenciamento de eventos
 * - Utilitários gerais
 */

// ========================================
// MÓDULO: GERENCIAMENTO DE MENU
// ========================================

/**
 * Inicializa o menu responsivo (hamburger)
 */
function initMenuResponsivo() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Fecha menu ao clicar em um link
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    }
  });
}

/**
 * Marca o link de navegação ativo
 */
function getNavHashFromLocation(hash) {
  if (!hash) return '#inicio';

  const normalizedHash = hash.toString().trim().toLowerCase();
  if (normalizedHash === '#development') {
    return '#desenvolvimento';
  }

  if (normalizedHash === '#about') {
    return '#projeto';
  }

  const validHashes = ['#inicio', '#projeto', '#desenvolvimento', '#tour', '#contato'];
  return validHashes.includes(normalizedHash) ? normalizedHash : '#inicio';
}

function marcarNavegacaoAtiva() {
  const hash = getNavHashFromLocation(window.location.hash || '#inicio');
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('hashchange', marcarNavegacaoAtiva);

let categoriaAmbienteSelecionada = 'todos';

async function carregarAmbientesApiComCache() {
  try {
    await carregarAmbientesApi();
  } catch (error) {
    console.error('Erro ao carregar ambientes para o site:', error);
  }
}

function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = document.querySelectorAll('nav a');
  if (!sections.length || !navLinks.length) return;

  const getActiveSectionId = () => {
    const triggerPoint = window.innerHeight / 4;
    let activeId = sections[0].id;

    sections.forEach(section => {
      const { top, bottom } = section.getBoundingClientRect();
      if (top <= triggerPoint && bottom > triggerPoint) {
        activeId = section.id;
      }
    });

    return activeId;
  };

  let scheduled = false;
  const updateActiveLink = () => {
    const activeId = getActiveSectionId();
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
    scheduled = false;
  };

  const onScroll = () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateActiveLink);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateActiveLink();
}

function criarFiltrosAmbientes() {
  const filtroContainer = document.getElementById('filtros');
  if (!filtroContainer || typeof obterCategorias !== 'function') return;

  const categorias = ['todos', ...obterCategorias()];
  filtroContainer.innerHTML = '';

  categorias.forEach(categoria => {
    const button = document.createElement('button');
    button.className = 'filtro-btn';
    if (categoria === 'todos') {
      button.classList.add('active');
      button.textContent = 'Todos';
      button.dataset.categoria = 'todos';
    } else {
      button.textContent = categoria;
      button.dataset.categoria = categoria;
    }

    button.addEventListener('click', () => {
      document.querySelectorAll('#filtros .filtro-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      categoriaAmbienteSelecionada = button.dataset.categoria;
      atualizarAmbientesFiltrados();
    });

    filtroContainer.appendChild(button);
  });
}

function agruparListaPorCategoria(ambientesList) {
  return ambientesList.reduce((acc, ambiente) => {
    if (!acc[ambiente.categoria]) {
      acc[ambiente.categoria] = [];
    }
    acc[ambiente.categoria].push(ambiente);
    return acc;
  }, {});
}

function atualizarAmbientesFiltrados() {
  const container = document.getElementById('ambientes-container');
  if (!container || typeof obterAmbientesDisponiveis !== 'function') return;

  const ambientes = obterAmbientesDisponiveis();
  const ambientesFiltrados = categoriaAmbienteSelecionada === 'todos'
    ? ambientes
    : ambientes.filter(ambiente => ambiente.categoria === categoriaAmbienteSelecionada);

  if (ambientesFiltrados.length === 0) {
    container.innerHTML = '<p class="text-center text-secondary">Nenhum ambiente disponível para esta categoria.</p>';
    return;
  }

  const agrupados = agruparListaPorCategoria(ambientesFiltrados);
  renderizarAmbientesPorCategoria(agrupados, 'ambientes-container');
}

async function carregarAmbientesDisponiveis() {
  await carregarAmbientesApiComCache();
  criarFiltrosAmbientes();
  atualizarAmbientesFiltrados();
}

// ========================================
// MÓDULO: RENDERIZAÇÃO DE CARDS
// ========================================

/**
 * Renderiza cards de ambientes dinamicamente
 * @param {Array} ambientesList - Lista de ambientes para renderizar
 * @param {string} containerId - ID do container onde renderizar
 */
function renderizarCards(ambientesList, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (ambientesList.length === 0) {
    container.innerHTML = '<p class="text-center text-secondary">Nenhum ambiente disponível no momento.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'cards-grid';

  ambientesList.forEach(ambiente => {
    const card = criarCardAmbiente(ambiente);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

/**
 * Cria elemento de card para um ambiente
 * @param {Object} ambiente - Dados do ambiente
 * @returns {HTMLElement} Elemento card
 */
function criarCardAmbiente(ambiente) {
  const card = document.createElement('div');
  card.className = 'card fade-in';

  const imagemSrc = ambiente.disponivel ? ambiente.imagemPreview : `${ambiente.imagemPreview}?disabled`;
  const statusClass = ambiente.disponivel ? '' : 'opacity-reduced';

  const btnTexto = ambiente.disponivel ? 'Abrir em 360°' : 'Em Breve';
  const btnClasse = ambiente.disponivel ? 'btn btn-primary' : 'btn btn-secondary';
  const btnDisabled = ambiente.disponivel ? '' : 'disabled';

  card.innerHTML = `
    ${ambiente.disponivel ? `<a href="viewer.html?id=${ambiente.id}" class="card-image-link" aria-label="Abrir visualizador 360° do ${ambiente.titulo}">` : ''}
    <img 
      src="${imagemSrc}" 
      alt="${ambiente.titulo}" 
      class="card-image ${statusClass}" 
      loading="lazy"
      ${ambiente.disponivel ? 'style="cursor: pointer;"' : ''}
    />
    ${ambiente.disponivel ? '</a>' : ''}
    <div class="card-content">
      <span class="card-category">${ambiente.categoria}</span>
      <h3 class="card-title">${ambiente.titulo}</h3>
      <p class="card-description">${ambiente.descricao}</p>
      <div class="card-footer">
        ${criarBotaoAmbiente(ambiente, btnTexto, btnClasse, btnDisabled)}
      </div>
    </div>
  `;

  return card;
}

/**
 * Cria botão para abrir ambiente em 360°
 * @param {Object} ambiente - Dados do ambiente
 * @param {string} texto - Texto do botão
 * @param {string} classe - Classes CSS do botão
 * @param {string} disabled - Atributo disabled se necessário
 * @returns {string} HTML do botão
 */
function criarBotaoAmbiente(ambiente, texto, classe, disabled) {
  if (!ambiente.disponivel) {
    return `<button class="${classe}" ${disabled}>
      ${texto}
    </button>`;
  }

  return `<a 
    href="viewer.html?id=${ambiente.id}" 
    class="${classe}"
    aria-label="Abrir visualizador 360° do ${ambiente.titulo}"
  >
    ${texto}
  </a>`;
}

/**
 * Renderiza ambientes agrupados por categoria
 * @param {Object} ambientesAgrupados - Ambientes agrupados por categoria
 * @param {string} containerId - ID do container
 */
function renderizarAmbientesPorCategoria(ambientesAgrupados, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  Object.entries(ambientesAgrupados).forEach(([categoria, ambientes]) => {
    const section = document.createElement('section');
    section.className = 'categoria-section';

    const title = document.createElement('h3');
    title.textContent = categoria;
    title.className = 'categoria-titulo';
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    ambientes.forEach(ambiente => {
      grid.appendChild(criarCardAmbiente(ambiente));
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

// ========================================
// MÓDULO: UTILITÁRIOS
// ========================================

/**
 * Copia texto para a área de transferência
 * @param {string} texto - Texto a copiar
 * @returns {Promise} Promise que resolve quando texto é copiado
 */
function copiarParaAreaTransferencia(texto) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(texto).then(() => {
      mostrarNotificacao('Copiado com sucesso!', 'success');
    }).catch(() => {
      mostrarNotificacao('Erro ao copiar', 'error');
    });
  } else {
    // Fallback para navegadores antigos
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      mostrarNotificacao('Copiado com sucesso!', 'success');
    } catch (err) {
      mostrarNotificacao('Erro ao copiar', 'error');
    }
    document.body.removeChild(textArea);
  }
}

/**
 * Exibe notificação temporária
 * @param {string} mensagem - Mensagem a exibir
 * @param {string} tipo - Tipo: 'success', 'error', 'info'
 * @param {number} duracao - Duração em ms (padrão: 3000)
 */
function mostrarNotificacao(mensagem, tipo = 'info', duracao = 3000) {
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao notificacao-${tipo}`;
  notificacao.setAttribute('role', 'alert');
  notificacao.textContent = mensagem;

  // Posicionar no topo da página
  notificacao.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${tipo === 'success' ? '#10B981' : tipo === 'error' ? '#DC2626' : '#3B82F6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease-in-out;
    max-width: 90%;
  `;

  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.style.animation = 'slideInLeft 0.3s ease-in-out reverse';
    setTimeout(() => {
      document.body.removeChild(notificacao);
    }, 300);
  }, duracao);
}

/**
 * Obtém parâmetro da URL
 * @param {string} param - Nome do parâmetro
 * @returns {string|null} Valor do parâmetro ou null
 */
function obterParametroURL(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function openTab(evt, tabName, focusTabs = false) {
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.classList.remove('active'));

  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(tabName);
  if (!targetTab) return;
  targetTab.classList.add('active');

  let activeButton = null;
  if (evt.currentTarget && evt.currentTarget.classList.contains('tab-button')) {
    activeButton = evt.currentTarget;
  } else {
    activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
  }

  if (activeButton) {
    activeButton.classList.add('active');
  }

  if (focusTabs) {
    const targetSection = document.getElementById(tabName);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function copiarEmail(email) {
  if (!email) {
    mostrarNotificacao('E-mail não informado para cópia.', 'error');
    return;
  }
  copiarParaAreaTransferencia(email);
}

/**
 * Scroll suave para elemento
 * @param {string} seletor - Seletor CSS do elemento
 */
function scrollSuave(seletor) {
  const elemento = document.querySelector(seletor);
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ========================================
// MÓDULO: FORMULÁRIOS
// ========================================

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} true se válido
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida formulário básico
 * @param {HTMLFormElement} form - Elemento do formulário
 * @returns {boolean} true se válido
 */
function validarFormulario(form) {
  if (!form) return false;

  const campos = form.querySelectorAll('input, textarea, select');
  let valido = true;

  campos.forEach(campo => {
    if (campo.hasAttribute('required') && campo.value.trim() === '') {
      campo.setAttribute('aria-invalid', 'true');
      valido = false;
    } else {
      campo.setAttribute('aria-invalid', 'false');
    }

    // Validação específica de email
    if (campo.type === 'email' && campo.value.trim() !== '') {
      if (!validarEmail(campo.value)) {
        campo.setAttribute('aria-invalid', 'true');
        valido = false;
      }
    }
  });

  return valido;
}

/**
 * Inicializa listeners de formulários
 */
function initFormularios() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // Validar antes de enviar
      if (!validarFormulario(form)) {
        e.preventDefault();
        mostrarNotificacao('Por favor, preencha todos os campos corretamente', 'error');
        return;
      }

      // Se for o formulário de contato, mostrar feedback enquanto envia
      if (form.id === 'formContato') {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';
        }

        // Formspree fará o envio automaticamente
        // Após sucesso, redirecionará para a URL definida em _next
      }
    });
  });
}

/**
         * Inicializa formulário de contato com envio por email
         * Usa Formspree.io (gratuito) para enviar emails
         */
        function inicializarFormulario() {
            const form = document.getElementById('formContato');
            const submitBtn = document.getElementById('submitBtn');
            const feedbackDiv = document.getElementById('formFeedback');
            const feedbackText = document.getElementById('feedbackText');
            
            if (!form) return;

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Validar formulário
                if (!validarFormulario(form)) {
                    mostrarNotificacao('Por favor, preencha todos os campos corretamente.', 'error');
                    return;
                }

                // Desabilitar botão durante envio
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                feedbackDiv.style.display = 'none';

                try {
                    // Preparar dados do formulário
                    const formData = new FormData(form);
                    
                    // IMPORTANTE: Você precisa configurar o Formspree.io
                    // 1. Acesse https://formspree.io
                    // 2. Registre-se (grátis)
                    // 3. Crie um novo formulário e copie o form_id
                    // 4. Substitua 'xyzabc' na URL abaixo pelo seu form_id
                    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreaqvdn';
                    
                    // Se ainda não configurou, mostre instrução
                    if (FORMSPREE_ENDPOINT.includes('xyzabc')) {
                        mostrarNotificacao('⚠️ Formulário ainda não configurado. Veja instruções no console.', 'info', 5000);
                        console.warn('Para usar o formulário funcional:');
                        console.warn('1. Acesse https://formspree.io');
                        console.warn('2. Crie um novo formulário');
                        console.warn('3. Copie o form_id e substitua em contato.html linha ~470');
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        return;
                    }

                    // Enviar formulário
                    const response = await fetch(FORMSPREE_ENDPOINT, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Sucesso
                        mostrarNotificacao('✓ Mensagem enviada com sucesso!', 'success', 4000);
                        feedbackText.innerHTML = '✓ Mensagem enviada com sucesso! Você receberá uma resposta em breve (máximo 24h).';
                        feedbackDiv.style.display = 'block';
                        form.reset();
                    } else {
                        throw new Error('Erro na resposta do servidor');
                    }
                } catch (error) {
                    console.error('Erro ao enviar:', error);
                    mostrarNotificacao('Erro ao enviar. Tente novamente ou entre em contato direto.', 'error', 4000);
                    feedbackText.innerHTML = '✗ Erro ao enviar. Tente novamente ou contate diretamente: tiagocardoso1357@gmail.com';
                    feedbackDiv.style.backgroundColor = '#FEE2E2';
                    feedbackDiv.style.borderLeftColor = '#DC2626';
                    feedbackDiv.style.display = 'block';
                } finally {
                    // Reabilitar botão
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }

        // Inicializar quando DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                inicializarFormulario();
            });
        } else {
            inicializarFormulario();
        }

// ========================================
// MÓDULO: INICIALIZAÇÃO
// ========================================

/**
 * Inicializa botão voltar ao topo
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  // Mostrar/esconder botão ao scrollar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  // Voltar ao topo ao clicar
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Inicializa todas as funcionalidades
 */
async function inicializarSite() {
  // Inicializar menu responsivo
  initMenuResponsivo();

  // Marcar navegação ativa
  marcarNavegacaoAtiva();

  // Ajustar aba de conteúdo se houver hash direto
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash === 'development' || currentHash === 'about') {
    const btn = document.querySelector(`.tab-button[data-tab="${currentHash}"]`);
    if (btn) {
      openTab({ currentTarget: btn }, currentHash);
    }
  }

  // Inicializar formulários
  initFormularios();

  // Iniciar scroll spy para destacar navegação quando rolar cada seção
  initScrollSpy();

  // Inicializar botão voltar ao topo
  initBackToTop();

  // Carregar e renderizar os ambientes disponíveis na seção de tour
  await carregarAmbientesDisponiveis();

  // Log de inicialização (para debug)
  console.log('Site ImersaLab iniciado com sucesso');
}

// Aguardar carregamento do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => { await inicializarSite(); });
} else {
  inicializarSite();
}

// ========================================
// ESTILOS DINÂMICOS (injetados globalmente)
// ========================================
const style = document.createElement('style');
style.textContent = `
  .opacity-reduced {
    opacity: 0.6;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .categoria-section {
    margin-bottom: 48px;
  }

  .categoria-titulo {
    margin-bottom: 24px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .categoria-titulo::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 24px;
    background-color: var(--color-orange-primary);
    border-radius: 2px;
  }
`;
document.head.appendChild(style);
