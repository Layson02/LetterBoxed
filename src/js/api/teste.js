import Tmdb from "./tmdb.js";
import Filme from "../entidades/filme.js"; // Importa a sua entidade Filme

const filmes = await Tmdb.buscarFilmesPorGenero();
const filmeData = await Tmdb.buscarFilmesPorId(filmes.results[0].id);

// A equipe técnica fica dentro de filme.credits.crew
const equipe = filmeData.credits.crew;

// Filtramos pelo cargo de Diretor e Roteirista (juntamos como texto separado por vírgula)
const diretores = equipe.filter(pessoa => pessoa.job === 'Director').map(d => d.name).join(', ');
const roteiristas = equipe.filter(pessoa => pessoa.department === 'Writing').map(r => r.name).join(', ');

// Pegamos os nomes dos gêneros (Ex: "Ficção científica, Drama")
const generos = filmeData.genres.map(g => g.name).join(', ');
// Pegamos apenas o ano de lançamento "YYYY"
const ano = filmeData.release_date.substring(0, 4);
// Montamos a URL completa do poster
const posterPatch = filmeData.poster_path ? `https://image.tmdb.org/t/p/w500${filmeData.poster_path}` : null;

// Construimos a sua entidade (nota=0 inicial, avaliações vazia)
const meuFilme = new Filme(
    filmeData.id,
    filmeData.title,
    ano,
    generos,
    filmeData.overview,
    diretores,
    filmeData.vote_average,
    [],
    0,
    posterPatch,
    roteiristas
);

console.log("Instância da Entidade Filme Criada:\n");
console.log(meuFilme);