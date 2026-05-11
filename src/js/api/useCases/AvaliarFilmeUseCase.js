import Avaliacao from "../../entidades/avaliacao.js";

export class AvaliarFilmeUseCase {
    constructor(filmeRepository) {
        this.filmeRepository = filmeRepository;
    }

    async execute({ userId, filmeId, nota, comentario }) {
        const filme = await this.filmeRepository.buscarPorId(filmeId);

        if (!filme) {
            throw new Error("Filme não encontrado no banco de dados.");
        }

        const novaAvaliacao = new Avaliacao(null, filmeId, userId, nota, comentario);

        filme.adicionarAvaliacao(novaAvaliacao);

        await this.filmeRepository.atualizar(filme);

        return novaAvaliacao;
    }
}