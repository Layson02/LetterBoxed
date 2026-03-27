// Arquivo central de integração com o Frontend (Catálogo)
// Mapeando todos os elementos interativos do HTML da página catalogo.html

const domElements = {
    // Painel de Filtros e Busca
    inputBusca: document.getElementById('busca-filme'),
    selectGenero: document.getElementById('filtro-genero'),
    selectAno: document.getElementById('filtro-ano'),
    btnBuscar: document.getElementById('btn-buscar'),

    // Container onde os filmes serão desenhados na tela
    containerFilmes: document.getElementById('catalogo-filmes')
};

// ==========================================
// FUNÇÕES DE LÓGICA E CONEXÃO COM A API
// ==========================================

// Função que chama a nossa API Express local
async function buscarFilmes(pagina = 1, genero = '', ano = '') {
    try {
        domElements.containerFilmes.innerHTML = '<p>Carregando filmes...</p>';

        // Monta a URL passando as variáveis do filtro para a nossa API (/filmes?pagina=X&genero=Y&ano=Z)
        const paramString = new URLSearchParams({ pagina, genero, ano }).toString();

        const response = await fetch(`http://localhost:3000/filmes?${paramString}`);

        if (!response.ok) {
            throw new Error('Servidor não respondeu OK.');
        }

        const data = await response.json();

        // Chamamos a função de desenho enviando só o array de filmes que veio no JSON da nossa API
        renderizarCardsDeFilmes(data.filmes);

    } catch (error) {
        console.error('Erro de requisição:', error);
        domElements.containerFilmes.innerHTML = '<p style="color: red;">Erro ao buscar filmes. Esqueceu de ligar o Express com "node src/js/api/server.js"?</p>';
    }
}

// Função para desenhar o HTML dos filmes na tela
function renderizarCardsDeFilmes(filmes) {
    domElements.containerFilmes.innerHTML = ''; // Limpa tudo que havia antes

    if (!filmes || filmes.length === 0) {
        domElements.containerFilmes.innerHTML = '<p>Nenhum filme encontrado com esses filtros.</p>';
        return;
    }

    // Para cada Filme na resposta da nossa API, imprimimos um <article> na tela
    filmes.forEach(filme => {
        // Usa uma imagem substituta caso a API não retorne capa para um filme velho
        const posterHtm = filme.poster 
            ? `<img src="${filme.poster}" alt="Pôster de ${filme.titulo}" class="poster-filme">`
            : `<div class="poster-vazio">Sem Pôster</div>`;

        // Evita imprimir linha vazia de diretor se o filme for da busca geral
        const diretorHtm = filme.diretor ? `<p><em>${filme.diretor}</em></p>` : '';

        const cardHTML = `
            <article class="card-filme">
                ${posterHtm}
                <h3>${filme.titulo} (${filme.ano})</h3>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p><strong>Nota TMDB:</strong> ⭐ ${filme.nota ? filme.nota.toFixed(1) : 0} / 10</p>
                <p><strong>Nota do Site:</strong> ⭐ ${filme.notaPlataforma.toFixed(1)} / 10</p>
                ${diretorHtm}
                <div class="acoes-card">
                    <button class="btn-avaliar">Avaliar (Em breve)</button>
                </div>
            </article>
        `;

        // Injeta antes do fim do elemento Pai
        domElements.containerFilmes.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// ==========================================
// EVENTOS GLOBAIS
// ==========================================

// O "type='module'" no HTML já garante que o Javascript rodará apenas 
// DEPOIS que todo o seu HTML for construído na tela.
console.log("Aplicação iniciada! Buscando os filmes mais populares iniciais...");

// Faz uma busca limpa inicial para preencher o catálogo assim que a variável iniciar!
buscarFilmes();

// Quando o usuário clicar no botão "Buscar" do painel
domElements.btnBuscar.addEventListener('click', (e) => {
    e.preventDefault();

    // Pega as seleções que estão no <select> (como value="28" no caso de Action)
    const generoId = domElements.selectGenero.value;
    const anoId = domElements.selectAno.value;

    // Dispara a busca pra valer chamando a nossa API express com esses valores
    buscarFilmes(1, generoId, anoId);
});
