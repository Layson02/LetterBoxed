import App from '../core/App.js';

function initDetalhes() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Acesso restrito. Faça login para continuar.');
        window.location.href = '/';
        return;
    }

    const estado = App.state({
        titulo: 'Carregando filme...',
        ano: '---',
        genero: '---',
        notaFormatada: '---',
        diretor: '---',
        sinopse: 'Buscando informações no servidor...',
        poster: 'https://via.placeholder.com/350x500'
    });

    App.bindText('#detalhes-titulo', estado, 'titulo');
    App.bindText('#detalhes-ano', estado, 'ano');
    App.bindText('#detalhes-genero', estado, 'genero');
    App.bindText('#detalhes-nota', estado, 'notaFormatada');
    App.bindText('#detalhes-diretor', estado, 'diretor');
    App.bindText('#detalhes-sinopse', estado, 'sinopse');

    App.onClick('a[href*="index.html"]', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/';
    });

    App.watch(() => {
        const posterEl = document.getElementById('detalhes-poster');
        if (posterEl) {
            posterEl.src = estado.poster;
        }
    });

    async function carregarDetalhesDoFilme() {
        const urlParams = new URLSearchParams(window.location.search);
        const filmeId = urlParams.get('id');
        if (!filmeId) return;

        try {
            const response = await fetch(`http://localhost:3000/filmes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            const filme = data.filmes.find(f => f.id == filmeId);

            if (filme) {
                console.log("Dados da entidade Filme:", filme);

                estado.titulo = filme.titulo || "Título indisponível";
                estado.sinopse = filme.sinopse || "Sinopse não disponível.";
                estado.poster = filme.poster || "https://via.placeholder.com/350x500";
                estado.ano = filme.ano || "---";
                estado.genero = filme.genero || "---";
                const notaVal = filme.nota || 0;
                estado.notaFormatada = `⭐ ${notaVal.toFixed(1)} / 10`;
                estado.diretor = filme.diretor || "Não informado";
            }
        } catch (error) {
            console.error("Erro ao carregar detalhes:", error);
            estado.titulo = "Erro ao carregar filme";
            estado.sinopse = "Não foi possível carregar os detalhes do filme.";
        }
    }

    carregarDetalhesDoFilme();
}

App.createPage('/src/detalhes.html', initDetalhes);
App.createPage('/src/detalhes', initDetalhes);

if (window.location.pathname.includes('detalhes')) {
    App.createPage(window.location.pathname, initDetalhes);
    App.start();
}
