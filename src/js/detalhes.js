const filme = JSON.parse(localStorage.getItem('filmeSelecionado'));

if (filme) {

    document.querySelector('.area-poster img').src = filme.poster;

    document.querySelector('.area-info h2').textContent = filme.titulo;

    document.querySelector('.informacoes-filme').innerHTML = `
        <p><strong>Ano:</strong> ${filme.ano}</p>
        <p><strong>Gênero:</strong> ${filme.genero}</p>
        <p><strong>Nota TMDB:</strong> ⭐ ${filme.nota.toFixed(1)} / 10</p>
    `;

    document.querySelector('.descricao-filme p').textContent = filme.sinopse;
}