import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Força o dotenv a procurar o arquivo .env na pasta /js (um nível acima)
// Isso resolve o problema quando você roda o comando pelo terminal dentro da pasta /api
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class Tmdb {
    // Usar "get options()" faz com que o token seja lido do process.env dinamicamente, 
    // garantindo que o dotenv já carregou as variáveis de ambiente com sucesso.
    static get options() {
        return {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`
            }
        };
    }

    static baseUrl = 'https://api.themoviedb.org/3';

    // Busca filmes de determinados gêneros a partir do ano de 2020
    static async buscarFilmesPorGenero(pagina = 1, anoMinimo = 2020) {
        try {
            // IDs dos gêneros oficiais no TMDB:
            // Ação: 28, Aventura: 12, Comédia: 35, Drama: 18, Fantasia: 14, Terror: 27
            const generos = '28|12|35|18|14|27';

            // O '.gte' (Greater Than or Equal) garante que só venham filmes DESSE ano em diante
            // Se quiser limitar um teto, adicione também '&primary_release_date.lte=2020-12-31'
            const dataMinima = `${anoMinimo}-01-01`;

            const endpoint = `/discover/movie?language=pt-BR&page=${pagina}&primary_release_date.gte=${dataMinima}&with_genres=${generos}&sort_by=popularity.desc`;

            const response = await fetch(`${this.baseUrl}${endpoint}`, this.options);

            if (!response.ok) {
                throw new Error(`Erro na API do TMDB: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar filmes por gênero:', error);
            throw error;
        }
    }

    static async buscarFilmesPorId(id) {
        try {
            // Adicional appending: credits traz todas as informações de elenco (cast) e equipe técnica (crew) do filme
            const endpoint = `/movie/${id}?language=pt-BR&append_to_response=credits`;
            const response = await fetch(`${this.baseUrl}${endpoint}`, this.options);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar filmes por ID:', error);
            throw error;
        }
    }
}

export default Tmdb;