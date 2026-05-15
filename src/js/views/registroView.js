// src/js/views/registroView.js

export const registroView = {
    template: () => `
        <section class="container-registro">
            <h2>Criar Conta</h2>
            <form id="form-registro">
                <div class="grupo-input">
                    <input type="text" id="nome" name="nome" required>
                    <label for="nome">Nome Completo:</label>
                </div>
                <div class="grupo-input">
                    <input type="email" id="email" name="email" required>
                    <label for="email">E-mail:</label>
                </div>
                <div class="grupo-input">
                    <input type="password" id="senha" name="senha" required>
                    <label for="senha">Senha:</label>
                </div>
                <div class="grupo-input">
                    <input type="password" id="confirmar-senha" name="confirmar-senha" required>
                    <label for="confirmar-senha">Confirmar Senha:</label>
                </div>
                <button type="submit">Cadastrar</button>
            </form>
            <p>Já possui conta? <a href="#/login">Faça o login</a></p>
        </section>
    `,

    init: async (app) => {
        const form = document.querySelector('#form-registro');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.querySelector('#nome').value;
            const email = document.querySelector('#email').value;
            const senha = document.querySelector('#senha').value;
            const confirmarSenha = document.querySelector('#confirmar-senha').value;
            
            if (senha !== confirmarSenha) {
                alert('Senhas não correspondem');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:3000/usuarios/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });
                
                if (response.ok) {
                    alert('Conta criada! Faça login.');
                    window.location.hash = '#/login';
                } else {
                    const error = await response.json();
                    alert('Erro: ' + error.message);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao criar conta');
            }
        });
    },

    destroy: () => {}
};
