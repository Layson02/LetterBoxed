export class LoginUseCase {
    // Aplicando Inversão de Dependência injetando o Repositório de Usuários
    constructor(usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    async execute({ email, senha }) {
        if (!email || !senha) {
            throw new Error("O E-mail e a senha são obrigatórios.");
        }

        // Busca o usuário usando a função que criamos no repositório
        const usuarioLocalizado = await this.usuarioRepositorio.buscarPorEmail(email);

        // Se o usuário não existir no localStorage
        if (!usuarioLocalizado) {
            // Regra de segurança: Nunca diga "E-mail não encontrado". Diga apenas "Credenciais inválidas"
            // para que hackers não consigam descobrir quem tem conta no seu site.
            throw new Error("E-mail ou senha incorretos.");
        }

        // Fazer a validação da senha. 
        // ATENÇÃO: Como estamos em ambiente de teste com Local Storage, não temos um 'bcrypt' rodando.
        // Se fôssemos usar Bcrypt, seria algo como: 
        // const senhaBate = await bcrypt.compare(senha, usuarioLocalizado.senha);
        const senhaBate = (usuarioLocalizado.senha === senha);

        if (!senhaBate) {
            throw new Error("E-mail ou senha incorretos.");
        }

        // Login feito com sucesso!
        // Retornamos um objeto limpo sem a senha por questão de segurança para o Controller.
        // No futuro, é essa a camada de onde você retornaria um Token JWT!
        return {
            id: usuarioLocalizado.id,
            nome: usuarioLocalizado.nome,
            email: usuarioLocalizado.email
        };
    }
}
