// ==========================================
// main.js — Página do Catálogo de Filmes
// Refatorado para usar o mini framework reativo com Paginação e Filtros
// ==========================================

import App from '../core/App.js';

// ==========================================
// LÓGICA DA PÁGINA DO CATÁLOGO
// ==========================================

function initCatalogo() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Acesso restrito. Faça login para continuar.');
        window.location.href = '/';
        return;
    }

    let paginaAtual = 1;
    let totalPaginas = 1;

    // ==========================================
    // ESTADO REATIVO
    // ==========================================

    const estado = App.state({
        filmes: [],
        carregando: false,
        erro: null
    });

    // ==========================================
    // BINDINGS (conecta o HTML ao estado)
    // ==========================================

    App.bindList('#catalogo-filmes', estado, 'filmes', renderizarCard);

    // ==========================================
    // EVENTOS
    // ==========================================

    App.onClick('a[href*="index.html"]', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/';
    });

    App.onClick('#btn-buscar', (e) => {
        e.preventDefault();
        console.log('[main.js] Botão de buscar clicado!');
        paginaAtual = 1;
        buscarFilmes(paginaAtual);
    });

    App.onClick('#btn-ant', (e) => {
        e.preventDefault();
        if (paginaAtual > 1) {
            paginaAtual--;
            buscarFilmes(paginaAtual);
        }
    });

    App.onClick('#btn-prox', (e) => {
        e.preventDefault();
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            buscarFilmes(paginaAtual);
        }
    });

    // ==========================================
    // LÓGICA DE NEGÓCIO
    // ==========================================

    async function buscarFilmes(pagina = 1) {
        try {
            const container = document.querySelector('#catalogo-filmes');
            if (container) {
                container.innerHTML = '<p>Carregando filmes...</p>';
            }

            const titulo = document.querySelector('#busca-filme')?.value || '';
            const genero = document.querySelector('#filtro-genero')?.value || '';
            const ano = document.querySelector('#filtro-ano')?.value || '';

            console.log(`[main.js] Buscando - Página: ${pagina}, Título: "${titulo}", Gênero: "${genero}", Ano: "${ano}"`);

            const params = new URLSearchParams({ pagina, genero, ano, titulo }).toString();
            const url = `http://localhost:3000/filmes?${params}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Servidor não respondeu OK. Status: ${response.status}`);
            }

            const data = await response.json();

            estado.filmes = data.filmes || [];
            paginaAtual = data.paginaCorrente || 1;
            totalPaginas = data.totalPaginas || 1;

            const info = document.querySelector('#info-paginas');
            if (info) {
                info.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
            }

            const btnAnt = document.querySelector('#btn-ant');
            if (btnAnt) {
                btnAnt.disabled = paginaAtual <= 1;
            }

            const btnProx = document.querySelector('#btn-prox');
            if (btnProx) {
                btnProx.disabled = paginaAtual >= totalPaginas;
            }

        } catch (error) {
            console.error('[main.js] Erro de requisição:', error);
            const container = document.querySelector('#catalogo-filmes');
            if (container) {
                container.innerHTML = '<p style="color: red;">Erro ao buscar filmes. Verifique o console do navegador.</p>';
            }
        }
    }

    // ==========================================
    // RENDERIZAÇÃO (como desenhar cada card)
    // ==========================================

    function renderizarCard(filme) {
        const posterHtm = filme.poster
            ? `<img src="${filme.poster}" alt="Pôster de ${filme.titulo}" class="poster-filme">`
            : `<div class="poster-vazio">Sem Pôster</div>`;

        const diretorHtml = filme.diretor
            ? `<p><em>${filme.diretor}</em></p>`
            : '';

        return `
            <article class="card-filme">
                <a href="/src/detalhes.html?id=${filme.id}" style="text-decoration: none; color: inherit;">
                    ${posterHtm}
                    <h3>${filme.titulo} (${filme.ano})</h3>
                </a>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p><strong>Nota TMDB:</strong> ⭐ ${filme.nota ? filme.nota.toFixed(1) : 0} / 10</p>
                <p><strong>Nota do Site:</strong> ⭐ ${filme.notaPlataforma ? filme.notaPlataforma.toFixed(1) : 0} / 10</p>
                ${diretorHtml}
                <div class="acoes-card">
                    <button class="btn-avaliar">Avaliar (Em breve)</button>
                </div>
            </article>
        `;
    }

    // Inicia a primeira busca
    buscarFilmes(1);
}

// ==========================================
// REGISTRO DA PÁGINA NO FRAMEWORK
// ==========================================

App.createPage('/src/catalogo.html', initCatalogo);
App.createPage('/src/catalogo', initCatalogo);

// Compatibilidade para acesso direto
if (window.location.pathname.includes('catalogo')) {
    App.createPage(window.location.pathname, initCatalogo);
    App.start();
}
