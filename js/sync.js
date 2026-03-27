import { sequelize } from './models/index.js';

async function sincronizarBanco() {
  try {
    // Usamos { alter: true } para que o Sequelize apenas ajuste as tabelas que divergirem do modelo
    // sem apagar seus dados (diferente de force: true)
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado! Tabelas (filmes, usuarios, avaliacoes) verificadas/criadas.');
  } catch (error) {
    console.error('Erro ao sincronizar as tabelas:', error);
  } finally {
    process.exit();
  }
}

sincronizarBanco();
