// Importando um emulador de Local Storage para o Node.js
import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

export class FilmeRepositorio {
    async buscarPorId(id) {
        // Usa o LocalStorage puro exatamente como pedido
        const filmesSalvos = localStorage.getItem('filmes');
        if (!filmesSalvos) return null;

        const filmes = JSON.parse(filmesSalvos);
        return filmes.find(f => String(f.id) === String(id)) || null;
    }

    async criar(filme) {
        const filmesSalvos = localStorage.getItem('filmes');
        const filmes = filmesSalvos ? JSON.parse(filmesSalvos) : [];

        const index = filmes.findIndex(f => String(f.id) === String(filme.id));

        if (index >= 0) {
            throw new Error("Impossível criar. O filme já existe no banco de dados.");
        }

        filmes.push(filme); 
        localStorage.setItem('filmes', JSON.stringify(filmes));
        return filme;
    }

    async atualizar(filme) {
        // Reutilizamos a função da própria classe para validar se o id já está registrado
        const filmeExiste = await this.buscarPorId(filme.id);

        if (!filmeExiste) {
            throw new Error("Impossível atualizar. O filme não foi encontrado no banco.");
        }

        // Recuperamos a lista completa para realizar a sobrescrita (Update)
        const filmesSalvos = localStorage.getItem('filmes');
        const filmes = JSON.parse(filmesSalvos);

        const index = filmes.findIndex(f => String(f.id) === String(filme.id));
        filmes[index] = filme;
        
        localStorage.setItem('filmes', JSON.stringify(filmes));
        return filme;
    }
}