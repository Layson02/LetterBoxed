import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(cors());
// Faz o servidor "enxergar" a pasta src onde estão seus HTMLs e CSS
//app.use('/src', express.static('src'));
app.use(express.static('src'));
// ==========================================
// IMPORTAÇÃO DAS ROTAS
// ==========================================
import filmesRotas from './rotas/FilmesRotas.js';
import usuariosRotas from './rotas/UsuariosRotas.js';

// Rota de teste central
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'Servidor Express rodando com sucesso!'
    });
});

// Anexando o roteador de filmes: tudo que começar com "/filmes" cai nesse gerenciador
app.use('/filmes', filmesRotas);
app.use('/usuarios', usuariosRotas);

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

export default app;
