import Tmdb from '../tmdb.js';
import Filme from '../../entidades/filme.js';

export class ListarFilmesUseCase {
    async execute({ pagina = 1, ano = 2020 }) {
        // Faz a chamada limpa passando as responsabilidades de requisição de volta para a classe Tmdb
        const data = await Tmdb.buscarFilmesPorGenero(pagina, ano);
        
        if (!data || !data.results) {
            return [];
        }

        // Dicionário Oficial TMDB de Gêneros de Filmes (Estático)
        const mapaGeneros = {
            28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia',
            80: 'Crime', 99: 'Documentário', 18: 'Drama', 10751: 'Família',
            14: 'Fantasia', 36: 'História', 27: 'Terror', 10402: 'Música',
            9648: 'Mistério', 10749: 'Romance', 878: 'Ficção Científica',
            10770: 'Cinema TV', 53: 'Thriller', 10752: 'Guerra', 37: 'Faroeste'
        };

        const dataAtual = new Date(); // Auxiliar para bloquear filmes futuros

        // Tratamento de Dados: Convertendo o grande JSON do TMDB na nossa Entidade de Domínio (Filme)
        const filmesTratados = data.results
            .filter(filmeData => {
                // 1. Bloqueia filmes explícitos (+18 / Adult) marcados pelo TMDB
                if (filmeData.adult === true) return false;
                
                // 2. Bloqueia filmes sem data de lançamento exata
                if (!filmeData.release_date) return false;

                // 3. Bloqueia filmes que ainda não foram lançados (data no futuro em relação a hoje)
                const dataLancamento = new Date(filmeData.release_date);
                if (dataLancamento > dataAtual) return false;

                // Se não cair em nenhuma restrição, o filme está liberado pro front-end
                return true;
            })
            .map(filmeData => {
            // Extrai o ano da data (YYYY-MM-DD)
            const anoLancamento = filmeData.release_date ? filmeData.release_date.substring(0, 4) : 'N/A';
            
            // Monta o link da imagem
            const posterPatch = filmeData.poster_path ? `https://image.tmdb.org/t/p/w500${filmeData.poster_path}` : null;
            
            // Mapeia os arrays numéricos para os Nomes por extenso
            const generosTexto = filmeData.genre_ids.map(id => mapaGeneros[id] || 'Outro').join(', ');

            // Instancia a classe Entidade mantendo o TMDB na "nota" geral.
            return new Filme(
                filmeData.id,
                filmeData.title,
                anoLancamento,
                generosTexto,            // Generos Extenso
                filmeData.overview,
                '',                      // Diretor nulo pra listagem geral
                filmeData.vote_average,  // Nota Geral (TMDB)
                [],                      // Sem avaliações de usuários do site
                0,                       // Nota Plataforma (Nota do SEU site começa zero)
                posterPatch,
                ''                       // Roteiristas nulo
            );
        });

        return {
            paginaCorrente: data.page,
            totalPaginas: data.total_pages,
            // Esse é o total bruto da API, antes dos nossos filtros JS aplicados.
            totalFilmesApi: data.total_results, 
            filmes: filmesTratados
        };
    }
}
