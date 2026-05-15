// src/js/views/detalhesView.js

export const detalhesView = {
    template: (filmeId) => `
        <section class="container-detalhes">
            <a href="#/catalogo" class="btn-voltar">← Voltar</a>
            <section class="area-poster">
                <img id="detalhes-poster" src="https://via.placeholder.com/350x500" alt="Poster">
            </section>
            <section class="area-info">
                <h2 id="detalhes-titulo">Carregando...</h2>
                <div class="informacoes-filme">
                    <p><strong>Ano:</strong> <span id="detalhes-ano">-</span></p>
                    <p><strong>Gênero:</strong> <span id="detalhes-genero">-</span></p>
                    <p><strong>Nota TMDB:</strong> <span id="detalhes-nota">-</span></p>
                    <p><strong>Diretor:</strong> <span id="detalhes-diretor">-</span></p>
                </div>
                <div class="descricao-filme">
                    <h3>Sinopse</h3>
                    <p id="detalhes-sinopse">-</p>
                </div>
                <div class="avaliacao-usuario">
                    <h3>Sua Avaliação</h3>
                    <div class="estrelas" id="estrelas"></div>
                    <textarea id="resenha" placeholder="Escreva sua resenha..."></textarea>
                    <button class="btn-avaliar" id="btn-salvar">Salvar Avaliação</button>
                </div>
            </section>
        </section>
    `,

    init: async (app, filmeId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/filmes/${filmeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const filme = await response.json();

            document.querySelector('#detalhes-poster').src = filme.poster;
            document.querySelector('#detalhes-titulo').textContent = filme.titulo;
            document.querySelector('#detalhes-ano').textContent = filme.ano;
            document.querySelector('#detalhes-genero').textContent = filme.genero;
            document.querySelector('#detalhes-nota').textContent = filme.nota;
            document.querySelector('#detalhes-diretor').textContent = filme.diretor || '-';
            document.querySelector('#detalhes-sinopse').textContent = filme.sinopse;

            const estrelasDiv = document.querySelector('#estrelas');
            estrelasDiv.innerHTML = Array(5).fill().map((_, i) => 
                `<span class="estrela" data-valor="${i + 1}">⭐</span>`
            ).join('');

            let estrelasSelecionadas = 0;
            estrelasDiv.querySelectorAll('.estrela').forEach(estrela => {
                estrela.addEventListener('click', (e) => {
                    estrelasSelecionadas = e.target.dataset.valor;
                    estrelasDiv.querySelectorAll('.estrela').forEach((s, i) => {
                        s.classList.toggle('ativa', i < estrelasSelecionadas);
                    });
                });
            });

            document.querySelector('#btn-salvar')?.addEventListener('click', async () => {
                const resenha = document.querySelector('#resenha').value;
                
                await fetch('http://localhost:3000/avaliacoes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        filmeId,
                        nota: estrelasSelecionadas,
                        resenha
                    })
                });

                alert('Avaliação salva!');
                window.location.hash = '#/catalogo';
            });
        } catch (error) {
            console.error('Erro:', error);
        }
    },

    destroy: () => {}
};
