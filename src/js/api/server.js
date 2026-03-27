import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(cors());

import { FilmesController } from './controllers/FilmesController.js';

// Instanciamos as controllers
const filmesController = new FilmesController();

// Rota de teste
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'Servidor Express rodando com sucesso!'
    });
});

// Endpoint: Listar todos os filmes (Busca do TMDB no momento)
app.get('/filmes', filmesController.listar);

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

export default app;
