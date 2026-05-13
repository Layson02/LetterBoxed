class Filme {
    constructor(id, titulo, ano, genero, sinopse, diretor, nota, avaliacoes, notaPlataforma, poster, roteiristas) {
        this.id = id;
        this.titulo = titulo;
        this.ano = ano;
        this.genero = genero;
        this.sinopse = sinopse;
        this.diretor = diretor;
        this.nota = nota;
        this.avaliacoes = avaliacoes;
        this.notaPlataforma = notaPlataforma;
        this.poster = poster;
        this.roteiristas = roteiristas;
    }

    adicionarAvaliacao(avaliacao) {
        this.avaliacoes.push(avaliacao);
        this.calcularNota();
    }

    calcularNota() {
        if (this.avaliacoes.length === 0) {
            this.nota = 0;
            return;
        }

        const soma = this.avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0);
        this.nota = soma / this.avaliacoes.length;
    }
}

export default Filme;