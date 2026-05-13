const urlParams = new URLSearchParams(window.location.search);
const filmeId = urlParams.get('id');

const elementos = {
    titulo: document.getElementById('detalhes-titulo'),
    ano: document.getElementById('detalhes-ano'),
    genero: document.getElementById('detalhes-genero'),
    nota: document.getElementById('detalhes-nota'),
    diretor: document.getElementById('detalhes-diretor'),
    sinopse: document.getElementById('detalhes-sinopse'),
    poster: document.getElementById('detalhes-poster')
};

async function carregarDetalhesDoFilme() {
    if (!filmeId) return;

    try {
        // Buscamos na rota que já sabemos que funciona!
        const response = await fetch(`http://localhost:3000/filmes`);
        const data = await response.json();

        // O Gabriel envia um objeto com { filmes: [...] }. Procuramos lá dentro:
        const filme = data.filmes.find(f => f.id == filmeId);

        if (filme) {
            console.log("Dados da entidade Filme:", filme);

            // Preenchendo com os nomes exatos da sua classe Filme
            elementos.titulo.innerText = filme.titulo || "Título indisponível";

            // Na sua entidade, o campo provavelmente se chama 'sinopse'
            elementos.sinopse.innerText = filme.sinopse || "Sinopse não disponível.";

            // O poster já vem com a URL completa montada pelo Gabriel
            elementos.poster.src = filme.poster || "https://via.placeholder.com/350x500";

            if (elementos.ano) elementos.ano.innerText = filme.ano || "---";
            if (elementos.genero) elementos.genero.innerText = filme.genero || "---";

            // Nota do TMDB (que ele chamou de vote_average no código, mas na entidade deve ser 'nota')
            if (elementos.nota) {
                const notaVal = filme.nota || 0;
                elementos.nota.innerText = `⭐ ${notaVal.toFixed(1)} / 10`;
            }

            // Diretor (que ele filtrou da equipe)
            if (elementos.diretor) {
                elementos.diretor.innerText = filme.diretor || "Não informado";
            }
        }
    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
    }
}

carregarDetalhesDoFilme();