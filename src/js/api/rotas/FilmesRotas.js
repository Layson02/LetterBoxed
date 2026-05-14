import { Router } from 'express';
import { FilmesController } from '../controllers/FilmesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const filmesRotas = Router();
const filmesController = new FilmesController();

// Como no server.js usamos "app.use('/filmes', filmesRoutes)", 
// a rota "/" aqui dentro já representa nativamente "/filmes".
filmesRotas.get('/', authMiddleware, (req, res) => filmesController.listar(req, res));
filmesRotas.post('/seed', (req, res) => filmesController.seed(req, res));

export default filmesRotas;
