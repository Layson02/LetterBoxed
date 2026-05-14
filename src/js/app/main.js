// ==========================================
// main.js — Página do Catálogo de Filmes
// Refatorado para usar o mini framework reativo com Logs Detalhados
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

        const genero = document.querySelector('#filtro-genero')?.value || '';
        const ano = document.querySelector('#filtro-ano')?.value || '';

        console.log(`[main.js] Filtros de busca - Gênero: "${genero}", Ano: "${ano}"`);
        buscarFilmes(1, genero, ano);
    });

    // ==========================================
    // LÓGICA DE NEGÓCIO
    // ==========================================

    async function buscarFilmes(pagina = 1, genero = '', ano = '') {

        try {
            const container = document.querySelector('#catalogo-filmes');
            if (container) {
                container.innerHTML = '<p>Carregando filmes...</p>';
            }

            const params = new URLSearchParams({ pagina, genero, ano }).toString();
            const url = `http://localhost:3000/filmes?${params}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });


            if (!response.ok) {
                throw new Error(`Servidor não respondeu OK. Status: ${response.status}`);
            }

            const data = await response.json();


            // Ao atribuir o array, o bindList redesenha a lista automaticamente!
            estado.filmes = data.filmes || [];

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
        // Mantemos o nome da variável que você usou no seu link
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
    buscarFilmes();
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
