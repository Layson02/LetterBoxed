// ==========================================
// Reactivity.js — Sistema de Reatividade com Proxy
// Mini framework inspirado no Vue 3 (Vanilla JS puro)
// ==========================================

// Variável global que rastreia qual "efeito" está rodando no momento.
// Isso permite que o Proxy saiba quem está lendo cada propriedade.
let effectAtual = null;

/**
 * Cria um objeto reativo usando Proxy.
 * Qualquer alteração nas propriedades desse objeto vai disparar
 * automaticamente todas as funções que dependem dessa propriedade.
 * 
 * @param {Object} objetoOriginal - O objeto com os dados iniciais.
 * @returns {Proxy} - O objeto reativo (use normalmente como um objeto comum).
 * 
 * @example
 * const estado = reactive({ nome: '', idade: 0 });
 * estado.nome = 'João'; // Dispara atualização automática no DOM
 */
export function reactive(objetoOriginal) {
    // Mapa de dependências: para cada propriedade, guarda um Set de funções
    // que precisam rodar quando aquela propriedade mudar.
    const dependencias = {};

    return new Proxy(objetoOriginal, {
        // Intercepta LEITURA de propriedade (ex: estado.nome)
        get(alvo, propriedade) {
            // Se existe um efeito rodando, registra ele como dependente desta propriedade
            if (effectAtual) {
                if (!dependencias[propriedade]) {
                    dependencias[propriedade] = new Set();
                }
                dependencias[propriedade].add(effectAtual);
            }
            return alvo[propriedade];
        },

        // Intercepta ESCRITA de propriedade (ex: estado.nome = 'João')
        set(alvo, propriedade, novoValor) {
            const valorAntigo = alvo[propriedade];
            alvo[propriedade] = novoValor;

            // Só dispara as dependências se o valor realmente mudou
            if (valorAntigo !== novoValor && dependencias[propriedade]) {
                // Executa cada função que depende dessa propriedade
                dependencias[propriedade].forEach(fn => fn());
            }

            return true; // Proxy exige retornar true para confirmar a escrita
        }
    });
}

/**
 * Registra uma função que será executada automaticamente
 * sempre que qualquer propriedade reativa lida dentro dela mudar.
 * 
 * @param {Function} fn - A função a ser observada.
 * 
 * @example
 * const estado = reactive({ contador: 0 });
 * watch(() => {
 *     document.getElementById('display').textContent = estado.contador;
 * });
 * estado.contador++; // O display atualiza sozinho!
 */
export function watch(fn) {
    effectAtual = fn;    // Marca esta função como o "efeito ativo"
    fn();                // Executa uma vez para registrar as dependências
    effectAtual = null;  // Limpa a marcação
}

/**
 * Conecta um <input>, <select> ou <textarea> a uma propriedade do estado reativo.
 * Cria uma ponte bidirecional:
 *   - Quando o usuário digita → atualiza o estado
 *   - Quando o estado muda via código → atualiza o input
 * 
 * @param {string} seletor - Seletor CSS do elemento (ex: '#meu-input')
 * @param {Proxy} estado - O objeto reativo criado com reactive()
 * @param {string} chave - Nome da propriedade no estado (ex: 'nome')
 * 
 * @example
 * const estado = reactive({ usuario: '' });
 * bindInput('#campo-usuario', estado, 'usuario');
 */
export function bindInput(seletor, estado, chave) {
    const elemento = document.querySelector(seletor);
    if (!elemento) {
        console.warn(`[Reactivity] bindInput: elemento "${seletor}" não encontrado no DOM.`);
        return;
    }

    // Direção 1: Estado → Input (atualiza o input quando o estado muda)
    watch(() => {
        if (elemento.value !== String(estado[chave])) {
            elemento.value = estado[chave];
        }
    });

    // Direção 2: Input → Estado (atualiza o estado quando o usuário digita)
    elemento.addEventListener('input', () => {
        estado[chave] = elemento.value;
    });
}

/**
 * Conecta um elemento de texto (qualquer tag) a uma propriedade do estado reativo.
 * Quando o estado mudar, o texto do elemento é atualizado automaticamente.
 * 
 * @param {string} seletor - Seletor CSS do elemento (ex: '#titulo')
 * @param {Proxy} estado - O objeto reativo criado com reactive()
 * @param {string} chave - Nome da propriedade no estado (ex: 'titulo')
 * 
 * @example
 * const estado = reactive({ mensagem: 'Olá!' });
 * bindText('#saudacao', estado, 'mensagem');
 * estado.mensagem = 'Bem-vindo!'; // O elemento atualiza sozinho
 */
export function bindText(seletor, estado, chave) {
    const elemento = document.querySelector(seletor);
    if (!elemento) {
        console.warn(`[Reactivity] bindText: elemento "${seletor}" não encontrado no DOM.`);
        return;
    }

    watch(() => {
        elemento.textContent = estado[chave];
    });
}

/**
 * Conecta um array reativo a um container do DOM.
 * Sempre que o array mudar, o container é redesenhado usando a função de render fornecida.
 * 
 * @param {string} seletorContainer - Seletor CSS do container (ex: '#lista-filmes')
 * @param {Proxy} estado - O objeto reativo
 * @param {string} chaveArray - Nome da propriedade que contém o array (ex: 'filmes')
 * @param {Function} funcaoRender - Função que recebe um item do array e retorna uma string HTML
 * 
 * @example
 * const estado = reactive({ itens: [] });
 * bindList('#minha-lista', estado, 'itens', (item) => {
 *     return `<li>${item.nome}</li>`;
 * });
 * estado.itens = [{ nome: 'Item 1' }, { nome: 'Item 2' }]; // Lista redesenha sozinha!
 */
export function bindList(seletorContainer, estado, chaveArray, funcaoRender) {
    const container = document.querySelector(seletorContainer);
    if (!container) {
        console.warn(`[Reactivity] bindList: container "${seletorContainer}" não encontrado no DOM.`);
        return;
    }

    watch(() => {
        const lista = estado[chaveArray];

        if (!lista || lista.length === 0) {
            container.innerHTML = '<p>Nenhum item encontrado.</p>';
            return;
        }

        // Gera o HTML de cada item usando a função de render do desenvolvedor
        container.innerHTML = lista.map(funcaoRender).join('');
    });
}
