// ==========================================
// App.js — Facade do Mini Framework (API para Iniciantes)
// Este é o ÚNICO arquivo que o desenvolvedor precisa importar!
// ==========================================

import { reactive, watch, bindInput, bindText, bindList } from './Reactivity.js';
import router from './Router.js';

/**
 * Classe App — A API pública do mini framework.
 * 
 * Esconde toda a complexidade do Proxy, Router e DOM,
 * oferecendo métodos simples e diretos para qualquer pessoa
 * criar páginas interativas com poucas linhas de código.
 * 
 * @example
 * // 1. Importe o App
 * import App from '../core/App.js';
 * 
 * // 2. Registre suas páginas
 * App.createPage('/src/catalogo.html', () => {
 *     const estado = App.state({ filmes: [] });
 *     App.onClick('#btn-buscar', () => buscarFilmes(estado));
 * });
 * 
 * // 3. Inicie a aplicação
 * App.start();
 */
class AppFramework {
    constructor() {
        this._iniciado = false;
    }

    // ==========================================
    // MÉTODOS PRINCIPAIS (use estes!)
    // ==========================================

    /**
     * Cria um estado reativo (um objeto que atualiza a tela sozinho).
     * Use como se fosse um objeto normal — a mágica acontece por trás.
     * 
     * @param {Object} dadosIniciais - Os dados iniciais do estado
     * @returns {Proxy} - O estado reativo
     * 
     * @example
     * const estado = App.state({ nome: '', idade: 0 });
     * estado.nome = 'Maria'; // Tudo que depende de "nome" atualiza sozinho!
     */
    state(dadosIniciais) {
        return reactive(dadosIniciais);
    }

    /**
     * Registra uma página da aplicação.
     * Quando o roteador navegar para essa URL, a função de setup é chamada.
     * 
     * @param {string} url - Caminho da página (ex: '/src/catalogo.html')
     * @param {Function} funcaoSetup - Função que configura a página (bindings, eventos, etc.)
     * 
     * @example
     * App.createPage('/src/catalogo.html', () => {
     *     console.log('Catálogo foi carregado na tela!');
     *     // Configure seus estados, bindings e eventos aqui
     * });
     */
    createPage(url, funcaoSetup) {
        router.onLoad(url, funcaoSetup);
    }

    /**
     * Inicia a aplicação: ativa o roteador e dispara os hooks da página atual.
     * Deve ser chamado UMA VEZ no script principal (geralmente login.js).
     */
    start() {
        if (this._iniciado) {
            console.warn('[App] A aplicação já foi iniciada.');
            return;
        }

        router.init();
        this._iniciado = true;
        console.log('[App] 🚀 Aplicação iniciada com sucesso!');
    }

    // ==========================================
    // BINDINGS (conectar HTML ao estado)
    // ==========================================

    /**
     * Conecta um <input>, <select> ou <textarea> ao estado.
     * O valor do campo e o estado ficam sincronizados automaticamente.
     * 
     * @param {string} seletor - Seletor CSS do campo (ex: '#meu-input')
     * @param {Proxy} estado - Estado reativo criado com App.state()
     * @param {string} chave - Nome da propriedade (ex: 'nome')
     * 
     * @example
     * const estado = App.state({ usuario: '' });
     * App.bindInput('#campo-usuario', estado, 'usuario');
     * // Agora: digitar no input → atualiza estado.usuario
     * //        mudar estado.usuario → atualiza o input
     */
    bindInput(seletor, estado, chave) {
        bindInput(seletor, estado, chave);
    }

    /**
     * Conecta um elemento de texto ao estado.
     * Quando a propriedade mudar, o texto do elemento atualiza sozinho.
     * 
     * @param {string} seletor - Seletor CSS do elemento (ex: '#titulo')
     * @param {Proxy} estado - Estado reativo criado com App.state()
     * @param {string} chave - Nome da propriedade (ex: 'titulo')
     * 
     * @example
     * const estado = App.state({ mensagem: 'Olá mundo!' });
     * App.bindText('#saudacao', estado, 'mensagem');
     * estado.mensagem = 'Bem-vindo!'; // Texto atualiza na tela!
     */
    bindText(seletor, estado, chave) {
        bindText(seletor, estado, chave);
    }

    /**
     * Conecta uma lista (array) do estado a um container do DOM.
     * Quando o array mudar, o container é redesenhado automaticamente.
     * 
     * @param {string} seletorContainer - Seletor CSS do container (ex: '#lista')
     * @param {Proxy} estado - Estado reativo criado com App.state()
     * @param {string} chaveArray - Nome da propriedade que é um array (ex: 'filmes')
     * @param {Function} funcaoRender - Função que recebe 1 item e retorna HTML
     * 
     * @example
     * const estado = App.state({ tarefas: [] });
     * App.bindList('#lista-tarefas', estado, 'tarefas', (tarefa) => {
     *     return `<li>${tarefa.texto}</li>`;
     * });
     * estado.tarefas = [{ texto: 'Estudar JS' }]; // Lista redesenha!
     */
    bindList(seletorContainer, estado, chaveArray, funcaoRender) {
        bindList(seletorContainer, estado, chaveArray, funcaoRender);
    }

    // ==========================================
    // EVENTOS (adicionar interações)
    // ==========================================

    /**
     * Adiciona um evento de clique a um elemento.
     * Atalho para não precisar escrever addEventListener.
     * 
     * @param {string} seletor - Seletor CSS do elemento (ex: '#meu-botao')
     * @param {Function} callback - Função a executar no clique
     * 
     * @example
     * App.onClick('#btn-somar', () => {
     *     estado.contador++;
     * });
     */
    onClick(seletor, callback) {
        const elemento = document.querySelector(seletor);
        if (!elemento) {
            console.warn(`[App] onClick: elemento "${seletor}" não encontrado.`);
            return;
        }
        elemento.addEventListener('click', callback);
    }

    /**
     * Adiciona um evento de submissão a um formulário.
     * Já faz o preventDefault() automaticamente.
     * 
     * @param {string} seletor - Seletor CSS do form (ex: '#meu-form')
     * @param {Function} callback - Função a executar (recebe o evento como parâmetro)
     * 
     * @example
     * App.onSubmit('#form-login', (evento) => {
     *     console.log('Formulário enviado!');
     * });
     */
    onSubmit(seletor, callback) {
        const form = document.querySelector(seletor);
        if (!form) {
            console.warn(`[App] onSubmit: formulário "${seletor}" não encontrado.`);
            return;
        }
        form.addEventListener('submit', (evento) => {
            evento.preventDefault();
            callback(evento);
        });
    }

    // ==========================================
    // NAVEGAÇÃO
    // ==========================================

    /**
     * Navega para outra página sem recarregar o navegador.
     * 
     * @param {string} url - Caminho da página destino
     * 
     * @example
     * App.navigateTo('/src/catalogo.html');
     */
    navigateTo(url) {
        router.navigateTo(url);
    }

    // ==========================================
    // UTILITÁRIOS
    // ==========================================

    /**
     * Observa mudanças no estado e executa uma função customizada.
     * Útil para lógica mais complexa que não se encaixa em bind.
     * 
     * @param {Function} fn - Função que será re-executada quando o estado mudar
     * 
     * @example
     * App.watch(() => {
     *     if (estado.contador > 10) {
     *         console.log('Contador passou de 10!');
     *     }
     * });
     */
    watch(fn) {
        watch(fn);
    }
}

// Exporta uma instância única (Singleton) — o desenvolvedor usa direto
const App = new AppFramework();
export default App;
