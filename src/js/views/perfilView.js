// src/js/views/perfilView.js

export const perfilView = {
    template: () => `
        <section class="container-perfil">
            <div class="info-usuario">
                <img id="foto-usuario" src="https://via.placeholder.com/100" alt="Foto">
                <div>
                    <h2 id="nome-usuario">Carregando...</h2>
                    <p id="email-usuario">-</p>
                </div>
            </div>
            <section class="stats-usuario">
                <div class="stat-item">
                    <span class="stat-numero" id="total-filmes">0</span>
                    <span class="stat-label">Filmes Assistidos</span>
                </div>
                <div class="stat-item">
                    <span class="stat-numero" id="media-avaliacao">0</span>
                    <span class="stat-label">Nota Média</span>
                </div>
            </section>
            <section class="filmes-usuario">
                <h2>Meus Filmes Favoritos</h2>
                <div id="user-movies-grid" class="grid-filmes"></div>
            </section>
        </section>
    `,

    init: async (app) => {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

        app.updateNav([
            { label: 'Catálogo', href: '#/catalogo' },
            { label: 'Meu Perfil', href: '#/perfil', active: true },
            { label: 'Sair', href: '#/logout' }
        ]);

        document.querySelector('#nome-usuario').textContent = usuario.nome || 'Usuário';
        document.querySelector('#email-usuario').textContent = usuario.email || '-';

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            document.querySelector('#total-filmes').textContent = data.totalFilmes || 0;
            document.querySelector('#media-avaliacao').textContent = (data.mediaNota || 0).toFixed(1);
        } catch (error) {
            console.error('Erro:', error);
        }
    },

    destroy: () => {}
};
