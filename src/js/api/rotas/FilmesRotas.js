import { Router } from 'express';
import { FilmesController } from '../controllers/FilmesController.js';

const filmesRotas = Router();
const filmesController = new FilmesController();

// Como no server.js usamos "app.use('/filmes', filmesRoutes)", 
// a rota "/" aqui dentro já representa nativamente "/filmes".
filmesRotas.get('/', filmesController.listar);

// (Ponto de inserção para as futuras rotas):
// filmesRoutes.post('/:id/avaliar', avaliacoesController.avaliar);
// filmesRoutes.get('/:id', filmesController.buscarPorId);

export default filmesRotas;
