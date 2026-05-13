// ==========================================
// Router.js — Roteador SPA com Cache In-Memory
// Navegação sem recarregar a página (History API)
// ==========================================

/**
 * Classe responsável por toda a navegação da aplicação.
 * Intercepta cliques em links e submissões de formulários,
 * carrega o HTML da próxima página via fetch, e troca apenas
 * o conteúdo do <main> sem recarregar o navegador.
 */
class Router {
    constructor() {
        // Cache in-memory: guarda o HTML já baixado para não buscar duas vezes
        this.cache = {};

        // Mapa de hooks: quando uma URL for carregada, executa a função associada
        // Ex: { '/src/catalogo.html': [initCatalogo, outroSetup] }
        this.hooks = {};

        // Seletor do container principal onde as views serão injetadas
        this.containerSelector = 'main';
    }

    /**
     * Inicializa o roteador. Deve ser chamado uma única vez no bootstrap.
     * Faz o cache da página atual e começa a interceptar navegações.
     */
    init() {
        // Cacheia o HTML da página que já está na tela (para o botão "Voltar" funcionar)
        const paginaAtual = window.location.pathname;
        const mainAtual = document.querySelector(this.containerSelector);
        if (mainAtual) {
            this.cache[this._normalizarUrl(paginaAtual)] = mainAtual.innerHTML;
        }

        // Intercepta cliques em links <a>
        document.addEventListener('click', (evento) => this._interceptarLink(evento));

        // Intercepta submissões de formulários <form>
        document.addEventListener('submit', (evento) => this._interceptarForm(evento));

        // Intercepta o botão "Voltar" / "Avançar" do navegador
        window.addEventListener('popstate', (evento) => {
            const url = window.location.pathname;
            this._carregarPagina(url, false); // false = não faz pushState de novo
        });

        // Dispara os hooks da página inicial
        this._dispararHooks(paginaAtual);

        console.log('[Router] Inicializado e interceptando navegações.');
    }

    /**
     * Registra uma função para ser executada quando determinada URL for carregada.
     * Pode ser chamado várias vezes para a mesma URL (as funções se acumulam).
     * 
     * @param {string} url - Caminho da página (ex: '/src/catalogo.html')
     * @param {Function} callback - Função a ser executada quando a página carregar
     * 
     * @example
     * router.onLoad('/src/catalogo.html', () => {
     *     console.log('Catálogo carregado!');
     * });
     */
    onLoad(url, callback) {
        const chave = this._normalizarUrl(url);
        if (!this.hooks[chave]) {
            this.hooks[chave] = [];
        }
        this.hooks[chave].push(callback);
    }

    /**
     * Navega programaticamente para uma URL.
     * Útil quando você quer mudar de página via código (ex: após login).
     * 
     * @param {string} url - Caminho da página destino
     * 
     * @example
     * router.navigateTo('/src/catalogo.html');
     */
    navigateTo(url) {
        this._carregarPagina(url, true);
    }

    // ==========================================
    // MÉTODOS INTERNOS (privados)
    // ==========================================

    /**
     * Intercepta cliques em tags <a> para fazer navegação SPA.
     */
    _interceptarLink(evento) {
        const link = evento.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');

        // Ignora links externos, âncoras (#), e links com target="_blank"
        if (!href || href.startsWith('http') || href.startsWith('#') || link.target === '_blank') {
            return;
        }

        evento.preventDefault();
        this._carregarPagina(href, true);
    }

    /**
     * Intercepta submissão de formulários para fazer navegação SPA.
     * O action do form vira a URL destino.
     */
    _interceptarForm(evento) {
        const form = evento.target.closest('form');
        if (!form) return;

        const action = form.getAttribute('action');

        // Só intercepta se o form tem action para uma página local
        if (!action || action.startsWith('http')) {
            return;
        }

        evento.preventDefault();

        // Dispara um evento customizado para quem quiser processar os dados do form antes
        const eventoCustomizado = new CustomEvent('spa:formSubmit', {
            detail: { form, action, formData: new FormData(form) },
            bubbles: true,
            cancelable: true
        });

        const permitido = document.dispatchEvent(eventoCustomizado);

        // Se ninguém cancelou o evento, faz a navegação
        if (permitido) {
            this._carregarPagina(action, true);
        }
    }

    /**
     * Carrega uma página via fetch, extrai o <main> e injeta no DOM atual.
     * @param {string} url - URL da página a carregar
     * @param {boolean} atualizarHistorico - Se true, faz pushState na History API
     */
    async _carregarPagina(url, atualizarHistorico) {
        const chave = this._normalizarUrl(url);
        const container = document.querySelector(this.containerSelector);

        if (!container) {
            console.error('[Router] Container <main> não encontrado na página.');
            return;
        }

        try {
            let htmlMain;

            // Verifica se já temos no cache
            if (this.cache[chave]) {
                htmlMain = this.cache[chave];
                console.log(`[Router] Usando cache para: ${chave}`);
            } else {
                // Faz o fetch da página
                console.log(`[Router] Buscando via rede: ${url}`);
                const resposta = await fetch(url);

                if (!resposta.ok) {
                    throw new Error(`Erro HTTP ${resposta.status} ao carregar ${url}`);
                }

                const htmlCompleto = await resposta.text();

                // Usa DOMParser para extrair apenas o conteúdo do <main>
                const parser = new DOMParser();
                const docVirtual = parser.parseFromString(htmlCompleto, 'text/html');
                const mainVirtual = docVirtual.querySelector(this.containerSelector);

                if (mainVirtual) {
                    htmlMain = mainVirtual.innerHTML;
                } else {
                    // Fallback: usa o body inteiro se não tiver <main>
                    htmlMain = docVirtual.body.innerHTML;
                }

                // Guarda no cache
                this.cache[chave] = htmlMain;
            }

            // Substitui o conteúdo do container
            container.innerHTML = htmlMain;

            // Atualiza a URL do navegador (sem recarregar)
            if (atualizarHistorico) {
                history.pushState({ url: chave }, '', url);
            }

            // Atualiza o título da página se possível
            this._atualizarTitulo(url);

            // Dispara os hooks registrados para essa URL
            this._dispararHooks(url);

        } catch (erro) {
            console.error(`[Router] Falha ao carregar página: ${url}`, erro);
            container.innerHTML = `<p style="color: red;">Erro ao carregar a página. Verifique se o arquivo existe.</p>`;
        }
    }

    /**
     * Dispara todas as funções registradas via onLoad() para a URL.
     */
    _dispararHooks(url) {
        const chave = this._normalizarUrl(url);
        console.log(`[Router] Disparando hooks para chave: "${chave}" (URL original: "${url}")`);

        if (this.hooks[chave]) {
            console.log(`[Router] Encontrados ${this.hooks[chave].length} hooks para "${chave}". Executando...`);
            this.hooks[chave].forEach((fn, index) => {
                try {
                    fn();
                } catch (erro) {
                    console.error(`[Router] Erro ao executar hook #${index} para ${chave}:`, erro);
                }
            });
        } else {
            console.log(`[Router] Nenhum hook registrado para chave: "${chave}". Chaves registradas:`, Object.keys(this.hooks));
        }
    }

    /**
     * Normaliza URLs para comparação consistente no cache e nos hooks.
     * Resolve caminhos relativos de forma robusta usando a API nativa URL.
     */
    _normalizarUrl(url) {
        try {
            // Se já for uma URL completa, resolve. Se for relativa, resolve baseado no local atual.
            const urlResolvida = new URL(url, window.location.href);
            let limpa = urlResolvida.pathname;

            // Remove barra final se não for a raiz
            if (limpa.length > 1 && limpa.endsWith('/')) {
                limpa = limpa.slice(0, -1);
            }
            return limpa;
        } catch (erro) {
            console.warn('[Router] Falha ao normalizar URL:', url, erro);
            return url;
        }
    }

    /**
     * Tenta atualizar o título da aba do navegador baseado na URL.
     */
    _atualizarTitulo(url) {
        const mapasTitulos = {
            'index.html': 'LetterBoxed - Home',
            'catalogo.html': 'LetterBoxed - Catálogo',
        };

        for (const [fragmento, titulo] of Object.entries(mapasTitulos)) {
            if (url.includes(fragmento)) {
                document.title = titulo;
                return;
            }
        }
    }
}

// Exporta uma instância única (Singleton) do roteador
const router = new Router();
export default router;
