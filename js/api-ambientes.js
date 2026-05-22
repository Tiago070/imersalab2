const ambientesApiCache = [];
const categoriasApiCache = [];
let ambientesApiLoaded = false;

async function carregarAmbientesApi() {
    if (ambientesApiLoaded) {
        return;
    }

    try {
        const response = await fetch('/api/ambientes');
        if (!response.ok) {
            throw new Error('Falha ao carregar ambientes da API');
        }

        const result = await response.json();
        if (result.status !== 'success' || !Array.isArray(result.data)) {
            throw new Error('Formato de dados inválido da API');
        }

        ambientesApiCache.length = 0;
        result.data.forEach(ambiente => {
            const categoriaNome = ambiente.categoria && ambiente.categoria.nome ? ambiente.categoria.nome : ambiente.categoria;
            ambientesApiCache.push({
                ...ambiente,
                categoria: categoriaNome,
            });
        });

        categoriasApiCache.length = 0;
        [...new Set(ambientesApiCache.map(ambiente => ambiente.categoria))].forEach(categoria => categoriasApiCache.push(categoria));
        ambientesApiLoaded = true;
    } catch (error) {
        console.error('Erro ao carregar ambientes da API:', error);
        ambientesApiLoaded = true;
    }
}

function obterAmbientesDisponiveis() {
    return ambientesApiCache;
}

function obterCategorias() {
    return categoriasApiCache;
}

function obterAmbientePorId(id) {
    return ambientesApiCache.find(ambiente => ambiente.id === id) || null;
}
