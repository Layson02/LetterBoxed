import { ListarFilmesUseCase } from '../useCases/ListarFilmesUseCase.js';
import { SeedService } from '../useCases/SeedService.js';

console.log('--- Controller carregado com sucesso ---'); // Teste de importação

export class FilmesController {
    async listar(req, res) {
        console.log('--- Método listar foi disparado! ---'); // Teste de rota
        try {
            // ... resto do código
            // Pegamos as variáveis da URL (ex: /filmes?pagina=2&genero=28)
            const pagina = req.query.pagina || 1;
            const genero = req.query.genero || '';
            const ano = req.query.ano || '';

            // Instanciamos a lógica do Caso de Uso
            const listarFilmesUseCase = new ListarFilmesUseCase();
            
            // Executamos esperando a resposta do TMDB
            const filmes = await listarFilmesUseCase.execute({ pagina, genero, ano });

            // Devolvemos para o FrontEnd com formato JSON 200 (Sucesso)
            return res.status(200).json(filmes);

        } catch (error) {
            console.error('Falha no FilmesController:', error);
            // Devolvemos um erro claro pro frontend se algo quebrar no TMDB
            console.log("DETALHE DO ERRO:", error.message);
            return res.status(500).json({ error: 'Erro interno ao tentar listar os filmes' });
        }
    }

    async seed(req, res) {
        console.log('--- Método seed foi disparado pelo Cron Job / Endpoint ---');
        try {
            const paginas = parseInt(req.query.paginas) || 2;
            const dataMinima = req.query.dataMinima || null;

            const seedService = new SeedService();
            const resultado = await seedService.executarSeed(paginas, dataMinima);

            return res.status(200).json(resultado);
        } catch (error) {
            console.error('Falha no Seed de Filmes:', error);
            return res.status(500).json({ error: 'Erro interno durante a execução do seed' });
        }
    }
}
