import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(cors());

// ==========================================
// IMPORTAÇÃO DAS ROTAS
// ==========================================
import filmesRotas from './rotas/FilmesRotas.js';

// Rota de teste central
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'Servidor Express rodando com sucesso!'
    });
});

// Anexando o roteador de filmes: tudo que começar com "/filmes" cai nesse gerenciador
app.use('/filmes', filmesRotas);

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

export default app;
