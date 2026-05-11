class Avaliacao {
    constructor(id, filmeId, usuarioId, nota, comentario) {
        this.id = id;
        this.filmeId = filmeId;
        this.usuarioId = usuarioId;
        this.nota = nota;
        this.comentario = comentario;

        this.validar();
    }


    validar() {
        if (this.nota < 0 || this.nota > 10) {
            throw new Error("Negado pela Entidade: A nota deve ser entre 0 e 10.");
        }
        if (this.comentario && this.comentario.trim().length === 0) {
            throw new Error("Negado pela Entidade: O comentário não pode ser apenas espaços vazios.");
        }
        if (this.comentario && this.comentario.length > 500) {
            throw new Error("Negado pela Entidade: O comentário deve ter no máximo 500 caracteres.");
        }
    }


    editar(novaNota, novoComentario) {
        this.nota = novaNota;
        this.comentario = novoComentario;
        this.validar(); // Valida de novo para garantir que não mandaram lixo
    }
}

export default Avaliacao;