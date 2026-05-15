import { Router } from 'express';
import { UsuariosController } from '../controllers/UsuariosController.js';

const usuariosRotas = Router();
const usuariosController = new UsuariosController();

usuariosRotas.post('/login', (req, res) => usuariosController.login(req, res));

export default usuariosRotas;
