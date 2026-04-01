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

A arquitetura do Front-end foi organizada da seguinte forma:

```text
📦 LetterBoxed
 ┣ 📂 css           # Arquivos de estilização (layout responsivo)
 ┣ 📂 js            # Lógica de integração com API, DOM e Banco de Dados
 ┣ 📂 src           # Páginas secundárias do sistema
 ┃ ┗ 📜 catalogo.html
 ┗ 📜 index.html    # Página inicial e acesso do aluno (Login)
