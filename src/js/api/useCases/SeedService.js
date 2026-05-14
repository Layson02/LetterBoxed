import Tmdb from '../tmdb.js';
import FilmeEntidade from '../../entidades/filme.js';
import FilmeModel from '../../models/Filme.js';

export class SeedService {
    async executarSeed(paginas = 5, dataMinima = null) {
        console.log(`Iniciando Seed... Páginas: ${paginas}, Data Mínima: ${dataMinima || 'Nenhuma'}`);
        
        let totalProcessado = 0;
        const delay = ms => new Promise(res => setTimeout(res, ms));

        for (let p = 1; p <= paginas; p++) {
            console.log(`Buscando página ${p} de ${paginas}...`);
            const data = await Tmdb.buscarFilmesRecentes(p, dataMinima);
            if (!data || !data.results || data.results.length === 0) {
                console.log('Nenhum filme encontrado na página ou fim da lista.');
                break;
            }

            // Pegar IDs dos filmes válidos
            const ids = data.results
                .filter(f => !f.adult && f.release_date)
                .map(f => f.id);

            // Processar em lotes (chunks) de 10 para não sobrecarregar a API
            const chunkSize = 10;
            const filmesDetalhes = [];

            for (let i = 0; i < ids.length; i += chunkSize) {
                const chunk = ids.slice(i, i + chunkSize);
                const promessas = chunk.map(id => Tmdb.buscarFilmesPorId(id));
                const resultados = await Promise.all(promessas);
                filmesDetalhes.push(...resultados);
                await delay(1000); // 1 segundo de intervalo entre os lotes
            }

            // Transformar na entidade de domínio
            const entidades = filmesDetalhes.map(detalhe => {
                const anoLancamento = detalhe.release_date ? detalhe.release_date.substring(0, 4) : 'N/A';
                const posterPatch = detalhe.poster_path ? `https://image.tmdb.org/t/p/w500${detalhe.poster_path}` : null;
                const generosTexto = detalhe.genres ? detalhe.genres.map(g => g.name).join(', ') : '';

                let diretor = '';
                let roteiristas = '';

                if (detalhe.credits && detalhe.credits.crew) {
                    const dirObj = detalhe.credits.crew.find(c => c.job === 'Director');
                    if (dirObj) diretor = dirObj.name;

                    const rotObjs = detalhe.credits.crew.filter(c => c.job === 'Screenplay' || c.job === 'Writer');
                    roteiristas = rotObjs.map(r => r.name).join(', ');
                }

                // constructor(id, titulo, ano, genero, sinopse, diretor, nota, avaliacoes, notaPlataforma, poster, roteiristas)
                return new FilmeEntidade(
                    detalhe.id,
                    detalhe.title,
                    anoLancamento ? parseInt(anoLancamento) || null : null,
                    generosTexto,
                    detalhe.overview,
                    diretor,
                    detalhe.vote_average,
                    [],
                    0,
                    posterPatch,
                    roteiristas
                );
            });

            // Preparar objetos para inserção no Sequelize
            const registros = entidades.map(e => ({
                tmdb_id: e.id,
                titulo: e.titulo,
                ano: e.ano,
                genero: e.genero,
                sinopse: e.sinopse,
                diretor: e.diretor,
                nota: e.nota,
                notaPlataforma: e.notaPlataforma,
                poster: e.poster,
                roteiristas: e.roteiristas
            }));

            // Inserir no banco via bulkCreate
            if (registros.length > 0) {
                await FilmeModel.bulkCreate(registros, {
                    updateOnDuplicate: ['titulo', 'ano', 'genero', 'sinopse', 'diretor', 'nota', 'poster', 'roteiristas', 'updatedAt'],
                    conflictAttributes: ['tmdb_id']
                });
                totalProcessado += registros.length;
            }

            console.log(`Página ${p} processada com sucesso. Total acumulado: ${totalProcessado} filmes.`);
        }

        return { sucesso: true, totalProcessado };
    }
}
