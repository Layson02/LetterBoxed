// Importando o emulador de Local Storage para o Node.js
import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

export class AvaliacaoRepositorio {
    async buscarPorId(id) {
        const avaliacoesSalvas = localStorage.getItem('avaliacoes');
        if (!avaliacoesSalvas) return null;

        const avaliacoes = JSON.parse(avaliacoesSalvas);
        return avaliacoes.find(a => String(a.id) === String(id)) || null;
    }

    async buscarPorFilme(filmeId) {
        const avaliacoesSalvas = localStorage.getItem('avaliacoes');
        if (!avaliacoesSalvas) return [];

        const avaliacoes = JSON.parse(avaliacoesSalvas);
        return avaliacoes.filter(a => String(a.filmeId) === String(filmeId));
    }

    async buscarPorUsuario(usuarioId) {
        const avaliacoesSalvas = localStorage.getItem('avaliacoes');
        if (!avaliacoesSalvas) return [];

        const avaliacoes = JSON.parse(avaliacoesSalvas);
        return avaliacoes.filter(a => String(a.usuarioId) === String(usuarioId));
    }

    async criar(avaliacao) {
        const avaliacoesSalvas = localStorage.getItem('avaliacoes');
        const avaliacoes = avaliacoesSalvas ? JSON.parse(avaliacoesSalvas) : [];

        // Como criamos ela no Use Case com id 'null', o repositório assumirá
        // o papel do banco Postgres aqui de fazer o "Auto-Increment" do Id.
        if (!avaliacao.id) {
            avaliacao.id = avaliacoes.length > 0 ? Math.max(...avaliacoes.map(a => a.id || 0)) + 1 : 1;
        }

        avaliacoes.push(avaliacao); 
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
        return avaliacao;
    }

    async atualizar(avaliacao) {
        const avaliacaoExiste = await this.buscarPorId(avaliacao.id);

        if (!avaliacaoExiste) {
            throw new Error("Impossível atualizar. A avaliação não foi encontrada no banco local.");
        }

        const avaliacoesSalvas = localStorage.getItem('avaliacoes');
        const avaliacoes = JSON.parse(avaliacoesSalvas);

        const index = avaliacoes.findIndex(a => String(a.id) === String(avaliacao.id));
        avaliacoes[index] = avaliacao;
        
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
        return avaliacao;
    }
}
