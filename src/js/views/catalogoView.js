// src/js/views/catalogoView.js

export const catalogoView = {
    template: () => `
        <section class="painel-filtros">
            <input type="text" id="busca-filme" placeholder="Pesquisar título...">
            <select id="filtro-genero">
                <option value="">Todos os Gêneros</option>
                <option value="28">Ação</option>
                <option value="35">Comédia</option>
            </select>
            <select id="filtro-ano">
                <option value="">Ano de Lançamento</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
            </select>
            <button id="btn-buscar">Buscar</button>
        </section>
        <section id="catalogo-filmes" class="grid-filmes">
            <p>Carregando filmes...</p>
        </section>
    `,

    init: async (app) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.hash = '#/login';
            return;
        }

        app.updateNav([
            { label: 'Catálogo', href: '#/catalogo', active: true },
            { label: 'Meu Perfil', href: '#/perfil' },
            { label: 'Sair', href: '#/logout' }
        ]);

        const btnBuscar = document.querySelector('#btn-buscar');
        btnBuscar?.addEventListener('click', async () => {
            const genero = document.querySelector('#filtro-genero').value;
            const ano = document.querySelector('#filtro-ano').value;
            await buscarFilmes(genero, ano);
        });

        await buscarFilmes();

        async function buscarFilmes(genero = '', ano = '') {
            const container = document.querySelector('#catalogo-filmes');
            container.innerHTML = '<p>Carregando filmes...</p>';

            try {
                const params = new URLSearchParams({ genero, ano });
                const response = await fetch(`http://localhost:3000/filmes?${params}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Erro ao buscar filmes');
                const { filmes } = await response.json();
                
                container.innerHTML = filmes.map(f => `
                    <article class="card-filme">
                        <a href="#/detalhes/${f.id}">
                            <img src="${f.poster}" alt="${f.titulo}">
                            <h3>${f.titulo} (${f.ano})</h3>
                        </a>
                        <p><strong>⭐ TMDB:</strong> ${f.nota}/10</p>
                        <p><strong>⭐ Turma:</strong> ${f.notaTurma || '-'}/10</p>
                    </article>
                `).join('');
            } catch (error) {
                console.error('Erro:', error);
                container.innerHTML = '<p style="color: red;">Erro ao carregar filmes</p>';
            }
        }
    },

    destroy: () => {}
};
