// ==========================================
// login.js — Bootstrap da aplicação + Lógica de Login
// Este script roda no index.html (carregado com defer, sem type="module")
// Por isso usamos import() dinâmico para carregar os módulos do framework.
// ==========================================

(async function bootstrap() {
    // Carrega o mini framework dinamicamente (necessário pois o HTML não tem type="module")
    const { default: App } = await import('../core/App.js');

    // ==========================================
    // PÁGINA DE LOGIN (index.html)
    // ==========================================

    App.createPage('/index.html', () => {
        // Cria o estado reativo para os campos do formulário
        const estado = App.state({
            usuario: '',
            senha: ''
        });

        // Conecta os inputs ao estado (ponte bidirecional)
        App.bindInput('#usuario', estado, 'usuario');
        App.bindInput('#senha', estado, 'senha');

        // Intercepta a submissão do formulário de login.
        // Precisamos interceptar ANTES do Router para processar os dados.
        App.onSubmit('#form-login', async (evento) => {
            const { usuario, senha } = estado;

            if (!usuario || !senha) {
                alert('Preencha todos os campos!');
                return;
            }



            // TODO: Aqui entraria a chamada real para a API de autenticação
            // const resposta = await fetch('http://localhost:3000/usuarios/login', { ... });

            // Por enquanto, navega direto para o catálogo
            App.navigateTo('src/catalogo.html');
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
