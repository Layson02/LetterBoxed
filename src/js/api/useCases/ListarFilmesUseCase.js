import { FilmeRepositorio } from '../../bd/repositorios/filmeRepositorio.js';

export class ListarFilmesUseCase {
    constructor(filmeRepositorio = new FilmeRepositorio()) {
        this.filmeRepositorio = filmeRepositorio;
    }

    async execute({ pagina = 1, limite = 20, genero = '', ano = '', diretor = '', roteirista = '', titulo = '' }) {
        return await this.filmeRepositorio.listar({ pagina, limite, genero, ano, diretor, roteirista, titulo });
    }
}
