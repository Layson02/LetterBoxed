// ==========================================
// login.js — Bootstrap da aplicação + Lógica de Login
// Este script roda no index.html (carregado com defer, sem type="module")
// Por isso usamos import() dinâmico para carregar os módulos do framework.
// 
// ⚠️ SPA - IMPORTANTE PARA MARCOS E GABRIEL:
// Este projeto usa Single Page Application (SPA).
// TODO funciona a partir do index.html. Os arquivos em src/pages/
// são mantidos APENAS COMO REFERÊNCIA VISUAL e não são utilizados.
// Foco: index.html + views renderizadas em JavaScript via roteador hash.
// ==========================================

(async function bootstrap() {
    // Carrega o mini framework dinamicamente (necessário pois o HTML não tem type="module")
    const { default: App } = await import('../core/App.js');

    // ==========================================
    // PÁGINA DE LOGIN (index.html)
    // ==========================================

    function initLogin() {
        // Cria o estado reativo para os campos do formulário
        const estado = App.state({
            usuario: '',
            senha: ''
        });

        // Conecta os inputs ao estado (ponte bidirecional)
        App.bindInput('#usuario', estado, 'usuario');
        App.bindInput('#senha', estado, 'senha');

        // Intercepta a submissão do formulário de login.
        App.onSubmit('#form-login', async (evento) => {
            const { usuario, senha } = estado;

            if (!usuario || !senha) {
                alert('Preencha todos os campos!');
                return;
            }



            // TODO: Aqui entraria a chamada real para a API de autenticação
            // const resposta = await fetch('http://localhost:3000/usuarios/login', { ... });

            // Por enquanto, navega direto para o catálogo
            window.location.hash = '#/catalogo';
        });


    });

    // ==========================================
    // REGISTRO DE OUTRAS PÁGINAS
    // ==========================================

    // Importa e registra a página do catálogo
    await import('./main.js');

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    // Inicia o mini framework (ativa o roteador e dispara os hooks)
    App.start();
})();
