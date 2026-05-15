// src/js/views/loginView.js

export const loginView = {
    template: () => `
        <section class="container-login">
            <h2>Fazer Login</h2>
            <form id="form-login">
                <div class="grupo-input">
                    <input type="text" id="usuario" name="usuario" required>
                    <label for="usuario">Usuário ou E-mail:</label>
                </div>
                <div class="grupo-input">
                    <input type="password" id="senha" name="senha" required>
                    <label for="senha">Senha:</label>
                </div>
                <button type="submit">Entrar</button>
            </form>
            <p>Não tem conta? <a href="#/registro">Cadastre-se</a></p>
        </section>
    `,

    init: async (app) => {
        const form = document.querySelector('#form-login');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usuario = document.querySelector('#usuario').value;
            const senha = document.querySelector('#senha').value;
            
            try {
                const response = await fetch('http://localhost:3000/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, senha })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    window.location.hash = '#/catalogo';
                } else {
                    alert('Credenciais inválidas');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao fazer login');
            }
        });
    },

    destroy: () => {}
};
