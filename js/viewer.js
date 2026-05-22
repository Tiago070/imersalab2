/**
 * VISUALIZADOR 360° - Script Principal
 */

// Referências úteis
const scene = document.getElementById('scene');
const sky = document.getElementById('sky');
const titleElement = document.getElementById('title-ambiente');
const infoElement = document.getElementById('info-texto');
const loadingScreen = document.getElementById('loadingScreen');
const hotspotVoltar = document.getElementById('hotspot-voltar');
const cameraElement = document.getElementById('camera');

// Estado do menu VR
let modoVRAtivo = false;
let vrMenuStack = []; // pilha de histórico de navegação
let vrMenuPageIndex = 0; // página atual
const VR_MENU_MAX_ITEMS = 5;
let vrMenuToggleBlocked = false; // proteção contra cliques rápidos dupl do hotspot
let ambienteAtual = null;

/**
 * Inicializa o visualizador
 */
async function inicializarVisualizador() {
    await carregarAmbientesApi();

    // Obter ID do ambiente da URL
    const idAmbiente = obterParametroURL('id');

    if (!idAmbiente) {
        mostrarErro('Nenhum ambiente especificado. Voltando para campus...');
        setTimeout(() => voltarParaCampus(), 2000);
        return;
    }

    // Obter dados do ambiente
    ambienteAtual = obterAmbientePorId(idAmbiente);

    if (!ambienteAtual) {
        mostrarErro('Ambiente não encontrado. Voltando para campus...');
        setTimeout(() => voltarParaCampus(), 2000);
        return;
    }

    // Carregar ambiente
    carregarAmbiente();
    // Construir menu de navegação de ambientes
    renderizarMenuAmbientes();
}

/**
 * Carrega o ambiente 360°
 */
function carregarAmbiente() {
    if (!ambienteAtual) return;

    try {
        // Atualizar título
        titleElement.textContent = ambienteAtual.titulo;

        // Atualizar informações
        infoElement.textContent = ambienteAtual.descricao || 'Arraste para explorar este ambiente em 360°.';

        // Carregar imagem 360°
        const skyElement = document.querySelector('a-sky');
        if (skyElement) {
            skyElement.setAttribute('src', ambienteAtual.imagem360);
        }

        // Listeners de carregamento
        sky.addEventListener('materialtexture-set', onAmbienteCarregado);
        sky.addEventListener('error', onErroCarregamento);

        // Timeout para carregamento
        setTimeout(() => {
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                onAmbienteCarregado();
            }
        }, 5000); // Máximo 5 segundos
    } catch (erro) {
        console.error('Erro ao carregar ambiente:', erro);
        mostrarErro('Erro ao carregar o ambiente.');
    }
}

/**
 * Renderiza o menu de navegação de ambientes (abaixo do título)
 */
function renderizarMenuAmbientes() {
    const menu = document.getElementById('ambientes-menu');
    if (!menu) return;
    menu.innerHTML = '';

    // Se houver uma categoria selecionada, renderizar só seus ambientes; caso contrário, não mostrar botões
    const categoriaSelecionada = menu.getAttribute('data-categoria');
    if (!categoriaSelecionada) return;

    const lista = obterAmbientesDisponiveis().filter(a => a.categoria === categoriaSelecionada);

    lista.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'ambiente-btn';
        btn.setAttribute('data-id', a.id);

        // Thumbnail
        const img = document.createElement('img');
        img.className = 'ambiente-thumb';
        img.src = a.imagemPreview;
        img.alt = a.titulo + ' preview';
        btn.appendChild(img);

        // Label
        const span = document.createElement('span');
        span.className = 'ambiente-label';
        span.textContent = a.titulo;
        btn.appendChild(span);

        btn.onclick = () => mudarAmbiente(a.id);

        if (ambienteAtual && ambienteAtual.id === a.id) btn.classList.add('active');
        menu.appendChild(btn);
    });
}

/**
 * Renderiza lista de categorias no drawer
 */
function renderizarCategorias() {
    const drawer = document.getElementById('categories-drawer');
    if (!drawer) return;
    drawer.innerHTML = '';

    const categorias = obterCategorias();
    categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = cat;
        btn.onclick = () => {
            toggleCategorias(false);
            const menu = document.getElementById('ambientes-menu');
            if (menu) menu.setAttribute('data-categoria', cat);
            renderizarMenuAmbientes();
        };
        drawer.appendChild(btn);
    });
}

function toggleCategorias(open) {
    const drawer = document.getElementById('categories-drawer');
    const btn = document.getElementById('btn-categorias');
    if (!drawer || !btn) return;
    const shouldOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', shouldOpen);
    drawer.setAttribute('aria-hidden', String(!shouldOpen));
    btn.setAttribute('aria-expanded', String(shouldOpen));
}

/**
 * Muda o ambiente sem sair da visualização 360°
 * @param {string} id - id do ambiente
 */
function mudarAmbiente(id) {
    const novo = obterAmbientePorId(id);
    if (!novo) {
        mostrarErro('Ambiente não encontrado.');
        return;
    }

    if (loadingScreen) loadingScreen.classList.remove('hidden');

    ambienteAtual = novo;

    titleElement.textContent = ambienteAtual.titulo;
    infoElement.textContent = ambienteAtual.descricao || '';

    crossfadeSky(ambienteAtual.imagem360, 600);

    const menu = document.getElementById('ambientes-menu');
    if (menu) {
        const buttons = menu.querySelectorAll('.ambiente-btn');
        buttons.forEach(b => b.classList.toggle('active', b.getAttribute('data-id') === id));
    }
}

/**
 * Crossfade entre sky atual e novo arquivo de imagem
 * @param {string} newSrc
 * @param {number} duration - ms
 */
function crossfadeSky(newSrc, duration = 600) {
    const sceneEl = document.querySelector('a-scene');
    const oldSky = document.querySelector('a-sky');
    if (!sceneEl || !oldSky) return;

    const newSky = document.createElement('a-sky');
    newSky.setAttribute('src', newSrc);
    newSky.setAttribute('rotation', oldSky.getAttribute('rotation') || '0 0 0');
    newSky.setAttribute('material', 'shader: standard; opacity: 0; transparent: true');
    sceneEl.appendChild(newSky);

    const start = performance.now();
    function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const opacityNew = t;
        const opacityOld = 1 - t;
        try {
            newSky.setAttribute('material', `shader: standard; opacity: ${opacityNew}; transparent: true`);
            oldSky.setAttribute('material', `shader: standard; opacity: ${opacityOld}; transparent: true`);
        } catch (e) {
            // não crítico
        }
        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            oldSky.setAttribute('src', newSrc);
            oldSky.setAttribute('material', 'shader: standard; opacity: 1; transparent: false');
            newSky.remove();
            onAmbienteCarregado();
        }
    }
    requestAnimationFrame(step);
}

/**
 * Callback quando ambiente é carregado
 */
function onAmbienteCarregado() {
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
    console.log('Ambiente carregado:', ambienteAtual && ambienteAtual.titulo);
}

/**
 * Callback de erro no carregamento
 */
function onErroCarregamento(erro) {
    console.error('Erro ao carregar imagem 360°:', erro);
    mostrarErro('Erro ao carregar a imagem 360°. Tentando novamente...');
}

/**
 * Obtém parâmetro da URL
 */
function obterParametroURL(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

/**
 * Entra em modo VR
 */
function entrarModoVR() {
    if (scene) {
        scene.enterVR();
        modoVRAtivo = true;
        mostrarNotificacao('Modo VR ativado!', 'success', 3000);
    }
}

/**
 * Volta para a página de campus
 */
function voltarParaCampus() {
    window.location.href = 'index.html';
}

function sairModoVR() {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl && sceneEl.exitVR) {
        sceneEl.exitVR();
        mostrarNotificacao('Saindo do modo VR...', 'info', 1800);
    }
}

function setupVrControllerButtons() {
    const sceneEl = document.querySelector('a-scene');
    if (!sceneEl) return;

    sceneEl.addEventListener('abuttondown', () => {
        if (modoVRAtivo) {
            sairModoVR();
        }
    });

    const hotspotSphere = document.getElementById('hotspot-bola');
    if (hotspotSphere) {
        hotspotSphere.addEventListener('triggerdown', () => {
            if (modoVRAtivo) {
                sairModoVR();
            }
        });
    }
}

function setupLaserVisibility() {
    const left = document.getElementById('laser-left');
    const right = document.getElementById('laser-right');

    function hide(ent) { if (ent) ent.setAttribute('visible', 'false'); }
    function show(ent) { if (ent) ent.setAttribute('visible', 'true'); }

    hide(left); hide(right);

    [left, right].forEach(ent => {
        if (!ent) return;
        ent.addEventListener('controllerconnected', () => show(ent));
        ent.addEventListener('controllerdisconnected', () => hide(ent));
    });

    const sceneEl = document.querySelector('a-scene');
    if (sceneEl) {
        sceneEl.addEventListener('exit-vr', () => { hide(left); hide(right); });
    }
}

/**
 * Mostra notificação de erro
 */
function mostrarErro(mensagem) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background-color: #DC2626;
        color: white;
        padding: 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 100;
        max-width: 400px;
    `;
    errorDiv.textContent = mensagem;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Mostra notificação
 */
function mostrarNotificacao(mensagem, tipo = 'info', duracao = 3000) {
    const cores = {
        success: '#10B981',
        error: '#DC2626',
        info: '#3B82F6'
    };

    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${cores[tipo] || cores.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 100;
        animation: slideInRight 0.3s ease-in-out;
    `;
    notif.textContent = mensagem;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, duracao);
}

/**
 * Dispatcher para ações declaradas em elementos via `data-action`
 * Suporta: `toggle-vr-menu`, `mudar-ambiente:<id>`, `vr-show-ambientes:<categoria>`, etc.
 */
function handleAction(action, el) {
    if (!action) return;
    const parts = action.split(':');
    const cmd = parts[0];
    const payload = parts[1] ? decodeURIComponent(parts[1]) : null;

    if (cmd === 'toggle-vr-menu') {
        toggleVrMenu();
    } else if (cmd === 'sair-vr') {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl && sceneEl.exitVR) {
            sceneEl.exitVR();
            mostrarNotificacao('Saindo do modo VR...', 'info', 2000);
        }
    } else if (cmd === 'voltar-para-campus') {
        if (modoVRAtivo) {
            const sceneEl = document.querySelector('a-scene');
            if (sceneEl && sceneEl.exitVR) {
                sceneEl.exitVR();
                setTimeout(() => voltarParaCampus(), 300);
                return;
            }
        }
        voltarParaCampus();
    } else if (cmd === 'vr-show-ambientes' && payload) {
        vrMenuStack.push({ type: 'categories', page: vrMenuPageIndex });
        vrMenuPageIndex = 0;
        renderizarVRAmbientes(payload);
    } else if (cmd === 'vr-back') {
        if (vrMenuStack.length > 0) {
            const prev = vrMenuStack.pop();
            vrMenuPageIndex = prev.page || 0;
            if (prev.type === 'categories') {
                renderizarVRCategorias();
            }
        }
    } else if (cmd === 'vr-next-page') {
        vrMenuPageIndex += 1;
        if (vrMenuStack.length > 0 && vrMenuStack[vrMenuStack.length - 1].type === 'ambientes') {
            const cat = vrMenuStack[vrMenuStack.length - 1].categoria;
            renderizarVRAmbientes(cat);
        } else {
            renderizarVRCategorias();
        }
    } else if (cmd === 'vr-prev-page') {
        vrMenuPageIndex = Math.max(0, vrMenuPageIndex - 1);
        if (vrMenuStack.length > 0 && vrMenuStack[vrMenuStack.length - 1].type === 'ambientes') {
            const cat = vrMenuStack[vrMenuStack.length - 1].categoria;
            renderizarVRAmbientes(cat);
        } else {
            renderizarVRCategorias();
        }
    } else if (cmd === 'mudar-ambiente' && payload) {
        toggleVrMenu(false);
        vrMenuStack = [];
        vrMenuPageIndex = 0;
        mudarAmbiente(payload);
    }
}

function toggleVrMenu(force) {
    const panel = document.getElementById('vr-menu-panel');
    if (!panel) return;

    if (vrMenuToggleBlocked) return;
    vrMenuToggleBlocked = true;
    setTimeout(() => { vrMenuToggleBlocked = false; }, 300);

    if (typeof force === 'boolean') {
        panel.setAttribute('visible', force);
        if (!force) {
            vrMenuStack = [];
            vrMenuPageIndex = 0;
            while (panel.firstChild) {
                panel.removeChild(panel.firstChild);
            }
        }
        return;
    }
    const vis = panel.getAttribute('visible') === true || panel.getAttribute('visible') === 'true';
    const next = !vis;
    panel.setAttribute('visible', next);
    if (next) {
        vrMenuStack = [];
        vrMenuPageIndex = 0;
        renderizarVRCategorias();
    } else {
        vrMenuStack = [];
        vrMenuPageIndex = 0;
        while (panel.firstChild) {
            panel.removeChild(panel.firstChild);
        }
    }
}

/**
 * Renderiza a lista de categorias no painel VR (compacto, mobile-friendly)
 */
function renderizarVRCategorias() {
    const panel = document.getElementById('vr-menu-panel');
    if (!panel) return;
    while (panel.firstChild) panel.removeChild(panel.firstChild);

    const bg = document.createElement('a-plane');
    bg.setAttribute('width', '1.4');
    bg.setAttribute('height', '1.15');
    bg.setAttribute('color', '#1a1a1a');
    bg.setAttribute('opacity', '0.85');
    bg.setAttribute('position', '0 0 -0.05');
    bg.setAttribute('material', 'shader: flat;');
    panel.appendChild(bg);

    const closeBtn = document.createElement('a-plane');
    closeBtn.setAttribute('width', '0.2');
    closeBtn.setAttribute('height', '0.2');
    closeBtn.setAttribute('color', '#FF6B35');
    closeBtn.setAttribute('opacity', '0.9');
    closeBtn.setAttribute('position', '0.65 0.5 0');
    closeBtn.setAttribute('class', 'vr-ui');
    closeBtn.setAttribute('data-action', 'toggle-vr-menu');
    closeBtn.setAttribute('clickable', '');
    const closeTxt = document.createElement('a-text');
    closeTxt.setAttribute('value', '✕');
    closeTxt.setAttribute('align', 'center');
    closeTxt.setAttribute('color', '#FFFFFF');
    closeTxt.setAttribute('width', '0.5');
    closeTxt.setAttribute('position', '0.65 0.5 0.01');
    closeTxt.setAttribute('scale', '0.55 0.55 0.55');
    panel.appendChild(closeBtn);
    panel.appendChild(closeTxt);

    const title = document.createElement('a-text');
    title.setAttribute('value', 'Categorias');
    title.setAttribute('align', 'center');
    title.setAttribute('color', '#FFD700');
    title.setAttribute('width', '1.0');
    title.setAttribute('position', '0 0.42 0');
    title.setAttribute('scale', '0.55 0.55 0.55');
    panel.appendChild(title);

    const cats = obterCategorias();
    const startIdx = vrMenuPageIndex * VR_MENU_MAX_ITEMS;
    const pageItems = cats.slice(startIdx, startIdx + VR_MENU_MAX_ITEMS);
    const itemHeight = 0.17;
    const startY = 0.30;

    pageItems.forEach((cat, i) => {
        const y = startY - i * itemHeight;
        const btn = document.createElement('a-plane');
        btn.setAttribute('width', '1.1');
        btn.setAttribute('height', '0.16');
        btn.setAttribute('color', '#2E40A0');
        btn.setAttribute('opacity', '0.75');
        btn.setAttribute('position', `0 ${y} 0`);
        btn.setAttribute('class', 'vr-ui');
        btn.setAttribute('data-action', `vr-show-ambientes:${encodeURIComponent(cat)}`);
        btn.setAttribute('clickable', '');

        const txt = document.createElement('a-text');
        txt.setAttribute('value', cat);
        txt.setAttribute('align', 'center');
        txt.setAttribute('color', '#FFFFFF');
        txt.setAttribute('width', '1.0');
        txt.setAttribute('position', `0 ${y} 0.01`);
        txt.setAttribute('scale', '0.52 0.52 0.52');

        panel.appendChild(btn);
        panel.appendChild(txt);
    });

    const bottomY = startY - pageItems.length * itemHeight - 0.12;
    const hasPrev = startIdx > 0;
    const hasNext = startIdx + VR_MENU_MAX_ITEMS < cats.length;

    if (hasNext) {
        const nextBtn = document.createElement('a-plane');
        nextBtn.setAttribute('width', '0.40');
        nextBtn.setAttribute('height', '0.15');
        nextBtn.setAttribute('color', '#2E40A0');
        nextBtn.setAttribute('opacity', '0.8');
        nextBtn.setAttribute('position', '0.25 ' + bottomY + ' 0');
        nextBtn.setAttribute('class', 'vr-ui');
        nextBtn.setAttribute('data-action', 'vr-next-page');
        nextBtn.setAttribute('clickable', '');
        const nextTxt = document.createElement('a-text');
        nextTxt.setAttribute('value', 'Mais →');
        nextTxt.setAttribute('align', 'center');
        nextTxt.setAttribute('color', '#FFFFFF');
        nextTxt.setAttribute('width', '0.7');
        nextTxt.setAttribute('position', '0.25 ' + bottomY + ' 0.01');
        nextTxt.setAttribute('scale', '0.45 0.45 0.45');
        panel.appendChild(nextBtn);
        panel.appendChild(nextTxt);
    }

    if (hasPrev) {
        const prevBtn = document.createElement('a-plane');
        prevBtn.setAttribute('width', '0.40');
        prevBtn.setAttribute('height', '0.15');
        prevBtn.setAttribute('color', '#2E40A0');
        prevBtn.setAttribute('opacity', '0.8');
        prevBtn.setAttribute('position', '-0.25 ' + bottomY + ' 0');
        prevBtn.setAttribute('class', 'vr-ui');
        prevBtn.setAttribute('data-action', 'vr-prev-page');
        prevBtn.setAttribute('clickable', '');
        const prevTxt = document.createElement('a-text');
        prevTxt.setAttribute('value', '← Ant.');
        prevTxt.setAttribute('align', 'center');
        prevTxt.setAttribute('color', '#FFFFFF');
        prevTxt.setAttribute('width', '0.7');
        prevTxt.setAttribute('position', '-0.25 ' + bottomY + ' 0.01');
        prevTxt.setAttribute('scale', '0.45 0.45 0.45');
        panel.appendChild(prevBtn);
        panel.appendChild(prevTxt);
    }
}

/**
 * Renderiza os ambientes de uma categoria no painel VR com paginação
 */
function renderizarVRAmbientes(categoria) {
    const panel = document.getElementById('vr-menu-panel');
    if (!panel) return;
    while (panel.firstChild) panel.removeChild(panel.firstChild);

    const bg = document.createElement('a-plane');
    bg.setAttribute('width', '1.4');
    bg.setAttribute('height', '1.15');
    bg.setAttribute('color', '#1a1a1a');
    bg.setAttribute('opacity', '0.85');
    bg.setAttribute('position', '0 0 -0.05');
    bg.setAttribute('material', 'shader: flat;');
    panel.appendChild(bg);

    const title = document.createElement('a-text');
    title.setAttribute('value', categoria);
    title.setAttribute('align', 'center');
    title.setAttribute('color', '#FFD700');
    title.setAttribute('width', '1.0');
    title.setAttribute('position', '0 0.48 0');
    title.setAttribute('scale', '0.60 0.60 0.60');
    panel.appendChild(title);

    const closeBtn = document.createElement('a-plane');
    closeBtn.setAttribute('width', '0.18');
    closeBtn.setAttribute('height', '0.18');
    closeBtn.setAttribute('color', '#FF6B35');
    closeBtn.setAttribute('opacity', '0.9');
    closeBtn.setAttribute('position', '0.58 0.48 0');
    closeBtn.setAttribute('class', 'vr-ui');
    closeBtn.setAttribute('data-action', 'toggle-vr-menu');
    closeBtn.setAttribute('clickable', '');
    const closeTxt = document.createElement('a-text');
    closeTxt.setAttribute('value', '✕');
    closeTxt.setAttribute('align', 'center');
    closeTxt.setAttribute('color', '#FFFFFF');
    closeTxt.setAttribute('width', '0.5');
    closeTxt.setAttribute('position', '0.58 0.48 0.01');
    closeTxt.setAttribute('scale', '0.50 0.50 0.50');
    panel.appendChild(closeBtn);
    panel.appendChild(closeTxt);

    const backBtn = document.createElement('a-plane');
    backBtn.setAttribute('width', '0.40');
    backBtn.setAttribute('height', '0.15');
    backBtn.setAttribute('color', '#1E6B5D');
    backBtn.setAttribute('opacity', '0.8');
    backBtn.setAttribute('position', '-0.25 0.48 0');
    backBtn.setAttribute('class', 'vr-ui');
    backBtn.setAttribute('data-action', 'vr-back');
    backBtn.setAttribute('clickable', '');
    const backTxt = document.createElement('a-text');
    backTxt.setAttribute('value', '← Cat.');
    backTxt.setAttribute('align', 'center');
    backTxt.setAttribute('color', '#FFFFFF');
    backTxt.setAttribute('width', '0.7');
    backTxt.setAttribute('position', '-0.25 0.48 0.01');
    backTxt.setAttribute('scale', '0.45 0.45 0.45');
    panel.appendChild(backBtn);
    panel.appendChild(backTxt);

    const items = obterAmbientesDisponiveis().filter(a => a.categoria === categoria);
    const startIdx = vrMenuPageIndex * VR_MENU_MAX_ITEMS;
    const pageItems = items.slice(startIdx, startIdx + VR_MENU_MAX_ITEMS);
    const itemHeight = 0.17;
    const startY = 0.30;

    pageItems.forEach((amb, idx) => {
        const y = startY - idx * itemHeight;
        const btn = document.createElement('a-plane');
        btn.setAttribute('width', '1.1');
        btn.setAttribute('height', '0.14');
        btn.setAttribute('color', '#1E6B5D');
        btn.setAttribute('opacity', '0.75');
        btn.setAttribute('position', `0 ${y} 0`);
        btn.setAttribute('class', 'vr-ui');
        btn.setAttribute('data-action', `mudar-ambiente:${amb.id}`);
        btn.setAttribute('clickable', '');

        const txt = document.createElement('a-text');
        txt.setAttribute('value', amb.titulo);
        txt.setAttribute('align', 'center');
        txt.setAttribute('color', '#FFFFFF');
        txt.setAttribute('width', '1.0');
        txt.setAttribute('position', `0 ${y} 0.01`);
        txt.setAttribute('scale', '0.52 0.52 0.52');

        panel.appendChild(btn);
        panel.appendChild(txt);
    });

    const bottomY = startY - pageItems.length * itemHeight - 0.12;
    const hasPrev = startIdx > 0;
    const hasNext = startIdx + VR_MENU_MAX_ITEMS < items.length;

    if (hasNext) {
        const nextBtn = document.createElement('a-plane');
        nextBtn.setAttribute('width', '0.40');
        nextBtn.setAttribute('height', '0.15');
        nextBtn.setAttribute('color', '#1E6B5D');
        nextBtn.setAttribute('opacity', '0.8');
        nextBtn.setAttribute('position', '0.25 ' + bottomY + ' 0');
        nextBtn.setAttribute('class', 'vr-ui');
        nextBtn.setAttribute('data-action', 'vr-next-page');
        nextBtn.setAttribute('clickable', '');
        const nextTxt = document.createElement('a-text');
        nextTxt.setAttribute('value', 'Mais →');
        nextTxt.setAttribute('align', 'center');
        nextTxt.setAttribute('color', '#FFFFFF');
        nextTxt.setAttribute('width', '0.7');
        nextTxt.setAttribute('position', '0.25 ' + bottomY + ' 0.01');
        nextTxt.setAttribute('scale', '0.45 0.45 0.45');
        panel.appendChild(nextBtn);
        panel.appendChild(nextTxt);
    }

    if (hasPrev) {
        const prevBtn = document.createElement('a-plane');
        prevBtn.setAttribute('width', '0.40');
        prevBtn.setAttribute('height', '0.15');
        prevBtn.setAttribute('color', '#1E6B5D');
        prevBtn.setAttribute('opacity', '0.8');
        prevBtn.setAttribute('position', '-0.25 ' + bottomY + ' 0');
        prevBtn.setAttribute('class', 'vr-ui');
        prevBtn.setAttribute('data-action', 'vr-prev-page');
        prevBtn.setAttribute('clickable', '');
        const prevTxt = document.createElement('a-text');
        prevTxt.setAttribute('value', '← Ant.');
        prevTxt.setAttribute('align', 'center');
        prevTxt.setAttribute('color', '#FFFFFF');
        prevTxt.setAttribute('width', '0.7');
        prevTxt.setAttribute('position', '-0.25 ' + bottomY + ' 0.01');
        prevTxt.setAttribute('scale', '0.45 0.45 0.45');
        panel.appendChild(prevBtn);
        panel.appendChild(prevTxt);
    }
}

/**
 * Monitora cliques fora do painel VR para fechá-lo (mobile-friendly)
 */
function setupPanelClickDetection() {
    const panel = document.getElementById('vr-menu-panel');
    const camera = document.querySelector('#camera');
    if (!panel || !camera) return;

    camera.addEventListener('raycaster-intersection', (Event) => {
        const intersected = Event.detail.intersections[0];
        if (!intersected || !intersected.object.el) {
            const panelVis = panel.getAttribute('visible') === true || panel.getAttribute('visible') === 'true';
            if (panelVis && modoVRAtivo) {
                const isMenuItem = intersected && intersected.object && 
                                  intersected.object.el && 
                                  (intersected.object.el.classList.contains('vr-ui') || 
                                   intersected.object.el.closest('[data-action]'));
                if (!isMenuItem) {
                    // Comentado: permitir fechar só com botão X por ora
                }
            }
        }
    });
}

/**
 * Hotspot clicável (evita acionar quando usuário está arrastando)
 */
AFRAME.registerComponent('clickable', {
    init: function() {
        this._start = null;
        this._dragging = false;
        this._isPointed = false;

        this._onPointerDown = (e) => {
            const ev = e.touches ? e.touches[0] : e;
            this._start = { x: ev.clientX || 0, y: ev.clientY || 0, t: Date.now() };
            this._dragging = false;
        };

        this._onPointerMove = (e) => {
            if (!this._start) return;
            const ev = e.touches ? e.touches[0] : e;
            const dx = (ev.clientX || 0) - this._start.x;
            const dy = (ev.clientY || 0) - this._start.y;
            if (Math.hypot(dx, dy) > 8) {
                this._dragging = true;
            }
        };

        this._onPointerUp = () => {
            this._start = null;
        };

        window.addEventListener('pointerdown', this._onPointerDown, { passive: true });
        window.addEventListener('pointermove', this._onPointerMove, { passive: true });
        window.addEventListener('pointerup', this._onPointerUp);

        this._onClick = (evt) => {
            if (this._dragging) return;
            const detail = evt && evt.detail ? evt.detail : null;
            const targetEl = detail && (detail.intersectedEl || (detail.intersection && detail.intersection.object && detail.intersection.object.el));
            if (!this._isPointed) {
                if (!targetEl) return;
                if (targetEl !== this.el) return;
            }
            try { evt.stopPropagation(); } catch (e) {}
            try { evt.stopImmediatePropagation(); } catch (e) {}
            const action = this.el.dataset.action;
            if (action) {
                handleAction(action, this.el);
                return;
            }
            if (modoVRAtivo) {
                const scene = document.querySelector('a-scene');
                if (scene && scene.exitVR) {
                    scene.exitVR();
                }
            } else {
                voltarParaCampus();
            }
        };

        this.el.addEventListener('click', this._onClick);

        this._onRayIntersect = () => { this._isPointed = true; };
        this._onRayClear = () => { this._isPointed = false; };

        this.el.addEventListener('raycaster-intersected', this._onRayIntersect);
        this.el.addEventListener('raycaster-intersected-cleared', this._onRayClear);

        const sceneEl = this.el.sceneEl || document.querySelector('a-scene');
        this._onTriggerDown = (evt) => {
            if (this._dragging) return;
            if (!this._isPointed) return;

            let isTopIntersect = true;
            if (evt && evt.detail) {
                const detail = evt.detail;
                const intersectionEl = detail.intersectedEl || (detail.intersection && detail.intersection.object && detail.intersection.object.el);
                if (intersectionEl && intersectionEl !== this.el) {
                    isTopIntersect = false;
                }
            }

            if (isTopIntersect && evt && evt.detail && !evt.detail.intersectedEl) {
                const cameraEl = document.querySelector('#camera');
                if (cameraEl && cameraEl.components && cameraEl.components.raycaster) {
                    const rc = cameraEl.components.raycaster;
                    if (typeof rc.getIntersection === 'function') {
                        const inter = rc.getIntersection(this.el);
                        isTopIntersect = !!inter;
                    } else if (rc.intersections && rc.intersections.length) {
                        const first = rc.intersections[0];
                        isTopIntersect = !!(first && ((first.object && first.object.el === this.el) || first.el === this.el));
                    }
                }
            }

            if (!isTopIntersect) return;

            try { evt.stopPropagation(); } catch (e) {}
            try { evt.stopImmediatePropagation(); } catch (e) {}

            const action = this.el.dataset.action;
            if (action) {
                handleAction(action, this.el);
                return;
            }

            if (modoVRAtivo) {
                const scene = document.querySelector('a-scene');
                if (scene && scene.exitVR) {
                    scene.exitVR();
                }
            } else {
                voltarParaCampus();
            }
        };

        if (sceneEl) {
            sceneEl.addEventListener('triggerdown', this._onTriggerDown);
        }
    },
    remove: function() {
        window.removeEventListener('pointerdown', this._onPointerDown);
        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('pointerup', this._onPointerUp);
        this.el.removeEventListener('click', this._onClick);

        this.el.removeEventListener('raycaster-intersected', this._onRayIntersect);
        this.el.removeEventListener('raycaster-intersected-cleared', this._onRayClear);

        const sceneEl = this.el.sceneEl || document.querySelector('a-scene');
        if (sceneEl) {
            sceneEl.removeEventListener('triggerdown', this._onTriggerDown);
        }
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => inicializarVisualizador());
} else {
    inicializarVisualizador();
}

document.addEventListener('DOMContentLoaded', () => {
    const btnCat = document.getElementById('btn-categorias');
    if (btnCat) btnCat.addEventListener('click', () => toggleCategorias());
    renderizarCategorias();
    setupPanelClickDetection();
    setupVrControllerButtons();
    setupLaserVisibility();
});

if (scene) {
    scene.addEventListener('enter-vr', () => {
        modoVRAtivo = true;
        const hm = document.getElementById('hotspot-menu');
        if (hm) hm.setAttribute('visible', true);
        const hv = document.getElementById('hotspot-voltar');
        if (hv) hv.setAttribute('visible', true);
        const uiOverlay = document.querySelector('.ui-overlay');
        if (uiOverlay) uiOverlay.style.display = 'none';
    });

    scene.addEventListener('exit-vr', () => {
        modoVRAtivo = false;
        const hm = document.getElementById('hotspot-menu');
        if (hm) hm.setAttribute('visible', false);
        const hv = document.getElementById('hotspot-voltar');
        if (hv) hv.setAttribute('visible', false);
        const panel = document.getElementById('vr-menu-panel');
        if (panel) {
            panel.setAttribute('visible', false);
            while (panel.firstChild) {
                panel.removeChild(panel.firstChild);
            }
            vrMenuStack = [];
            vrMenuPageIndex = 0;
        }
        const uiOverlay = document.querySelector('.ui-overlay');
        if (uiOverlay) uiOverlay.style.display = 'block';
    });
}

window.addEventListener('error', (e) => {
    if (e.filename && e.filename.includes('aframe')) {
        console.error('Erro ao carregar A-Frame');
        mostrarErro('Erro ao carregar o visualizador 3D. Verifique sua conexão.');
    }
});
