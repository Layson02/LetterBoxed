import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

export class UsuarioRepositorio {
    async buscarPorId(id) {
        const usuariosSalvos = localStorage.getItem('usuarios');
        if (!usuariosSalvos) return null;

        const usuarios = JSON.parse(usuariosSalvos);
        return usuarios.find(u => String(u.id) === String(id)) || null;
    }

    // Função de checagem super popular e útil em entidades de usuário (ex: Login, Duplicidade de Cadastro)
    async buscarPorEmail(email) {
        const usuariosSalvos = localStorage.getItem('usuarios');
        if (!usuariosSalvos) return null;

        const usuarios = JSON.parse(usuariosSalvos);
        return usuarios.find(u => u.email === email) || null;
    }

    async criar(usuario) {
        const usuariosSalvos = localStorage.getItem('usuarios');
        const usuarios = usuariosSalvos ? JSON.parse(usuariosSalvos) : [];

        // Checar conflitos de identidade para não registrar usuários duplicados
        const usuarioExistente = await this.buscarPorEmail(usuario.email);
        if (usuarioExistente) {
            throw new Error("Impossível criar. O e-mail do usuário já existe no banco de dados.");
        }

        // Auto-incremento de chaves primárias local do banco sintético
        if (!usuario.id) {
            usuario.id = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id || 0)) + 1 : 1;
        }

        usuarios.push(usuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return usuario;
    }

    async atualizar(usuario) {
        const usuarioExiste = await this.buscarPorId(usuario.id);

        if (!usuarioExiste) {
            throw new Error("Impossível atualizar. O usuário não foi encontrado no banco.");
        }

        const usuariosSalvos = localStorage.getItem('usuarios');
        const usuarios = JSON.parse(usuariosSalvos);

        const index = usuarios.findIndex(u => String(u.id) === String(usuario.id));
        usuarios[index] = usuario;

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return usuario;
    }
}
