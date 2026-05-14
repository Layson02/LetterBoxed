# 🎬 LetterBoxed

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

> Plataforma web interativa desenvolvida para catalogar filmes, atribuir notas e registrar críticas pessoais, com arquitetura em camadas e persistência em banco de dados relacional.

---

## 💻 Sobre o Projeto

O **LetterBoxed** oferece um espaço limpo e direto para registro de opiniões sobre filmes. O sistema possui uma API robusta em Node.js com persistência via PostgreSQL e ORM Sequelize, alimentada inicialmente pelos dados do TMDB e servida de forma reativa no front-end.

## 🚀 Funcionalidades

- **Autenticação JWT:** Sistema de login seguro com tokens.
- **Catálogo SQL Local:** Listagem paginada e otimizada de filmes diretamente do banco PostgreSQL.
- **Filtros Dinâmicos:** Pesquisa instantânea por título, gênero, ano, diretor e roteiristas.
- **Integração de Seed:** Importação sob demanda de filmes técnicos e sinopses a partir da API TmDB.
- **Avaliações e Críticas:** Atribuição de notas (1 a 10) e resenhas textuais de usuários.

---

## 🐳 Como Executar com Docker Compose

O projeto está totalmente conteinerizado, permitindo rodar a stack completa (Banco de Dados, API Backend e PWA Frontend) com facilidade.

### 1. Subindo a Aplicação
No terminal, na raiz do projeto, execute:
```bash
docker-compose up -d --build
```
> **Nota:** Na primeira subida, o container do backend executa automaticamente as migrações (`npm run migration:run`) para criar todas as tabelas no PostgreSQL.

### 2. Acessando os Serviços
- **Aplicação Web (Catálogo / Login)**: [http://localhost:8080](http://localhost:8080)
- **API Backend**: [http://localhost:3000](http://localhost:3000)

---

## 🌱 Populando o Banco de Dados (Seed)

Para popular a base local com os filmes da API do TMDB, você pode escolher uma das duas opções abaixo:

### Opção A: Pelo Terminal (CLI)
Execute o script de seed diretamente no container do backend:
```bash
docker exec -it letterBoxed npm run seed:tmdb
```

### Opção B: Via Endpoint da API
Dispare o seed chamando o endpoint pelo navegador ou Postman (podendo indicar o número de páginas do TMDB):
```text
GET http://localhost:3000/filmes/seed?paginas=5
```

---

## 🛑 Encerrando os Serviços

Para parar e remover os containers sem perder os dados salvos no volume do PostgreSQL:
```bash
docker-compose down
```

---

## 📁 Estrutura da Arquitetura

```text
📦 LetterBoxed
 ┣ 📂 src
 ┃ ┣ 📂 css           # Estilos globais e componentes
 ┃ ┣ 📂 js
 ┃ ┃ ┣ 📂 api         # Controladores, Rotas e Casos de Uso (Clean Architecture)
 ┃ ┃ ┣ 📂 bd          # Configurações de Conexão e Repositórios
 ┃ ┃ ┣ 📂 entidades   # Classes de Domínio Puro
 ┃ ┃ ┣ 📂 models      # Modelos e Relacionamentos do Sequelize
 ┃ ┃ ┗ 📂 migrations  # Histórico de Evolução do Banco SQL
 ┃ ┗ 📜 catalogo.html # Tela Principal de Listagem
 ┗ 📜 index.html      # Tela de Login / Autenticação
```
