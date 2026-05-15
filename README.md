# 🎬 LetterBoxed

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/API-TmDB-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white" alt="TmDB API">
</p>

> Plataforma web interativa desenvolvida por estudantes de Ciência da Computação para catalogar filmes, atribuir notas e registrar críticas pessoais, com foco na turma universitária.

---

## 💻 Sobre o Projeto

O **LetterBoxed** nasceu para resolver a dificuldade de manter um histórico organizado de filmes assistidos. Diferente de redes sociais complexas, nosso sistema oferece um espaço limpo e direto para estudantes de TI registrarem suas opiniões e compararem o "gosto técnico" (baseado nas notas oficiais do TmDB) com o "gosto popular" da sala de aula.

## 🚀 Funcionalidades

- **Autenticação:** Sistema de login via usuário/e-mail e senha.
- **Catálogo Dinâmico:** Integração em tempo real com a API TmDB para busca automática de capas, sinopses e dados técnicos.
- **Gestão de Filmes:** Adição de títulos a listas personalizadas ("Assistidos" e "Favoritos").
- **Avaliações e Críticas:** Atribuição de notas (1 a 10 estrelas) e espaço para resenhas textuais.
- **Filtros Avançados:** Pesquisa rápida de filmes por gênero ou ano de lançamento.
- **Ranking Social:** Comparação da nota global do filme com a nota média atribuída pelos alunos da turma.

## 📁 Estrutura do Projeto

Arquitetura **SPA (Single Page Application)** - Uma única página que carrega todas as views dinamicamente:

```text
📦 LetterBoxed
 ├─ 📄 index.html ⭐ (Página única - entry point)
 │
 ├─ 📁 src/
    ├─ 📁 css/
    │  ├─ style.css
    │  └─ components.css
    │
    ├─ 📁 js/
    │  ├─ 📄 main.js ⭐ (Orquestrador SPA)
    │  ├─ 📁 core/
    │  │  ├─ Router.js
    │  │  ├─ App.js
    │  │  └─ Reactivity.js
    │  ├─ 📁 views/ ⭐ (Views modulares)
    │  │  ├─ loginView.js
    │  │  ├─ registroView.js
    │  │  ├─ catalogoView.js
    │  │  ├─ perfilView.js
    │  │  └─ detalhesView.js
    │  ├─ 📁 api/
    │  ├─ 📁 models/
    │  └─ 📁 bd/
    │
    └─ 📁 pages/
       ├─ catalogo.html
       ├─ perfil.html
       ├─ detalhes.html
       └─ registro.html
 
```

## 🏗️ Arquitetura

A aplicação utiliza **SPA com Hash Routing** (navegação via #/página):

| Rota | View | Status |
|------|------|--------|
| `#/login` | loginView | Pública |
| `#/registro` | registroView | Pública |
| `#/catalogo` | catalogoView | Protegido |
| `#/perfil` | perfilView | Protegido |
| `#/detalhes/:id` | detalhesView | Protegido |
| `#/logout` | Limpa localStorage | Público |

**Fluxo:**
1. User acessa `index.html` (uma única vez)
2. `main.js` coordena rotas via hash
3. Views são módulos JS reutilizáveis
4. Sem reload de página = experiência fluida

---

## 🛠️ Responsabilidades

- **Layson (HTML):** Estrutura e templates
- **Marcos (CSS):** Estilos e responsividade  
- **Gabriel (JavaScript):** Lógica, API e autenticação
- **Lucas (Backend/Org):** Express, BD e coordenação
