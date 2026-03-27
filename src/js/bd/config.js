import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'filmes_bd',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false, // mude para console.log se quiser ver as queries executadas
  }
);

async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}

testarConexao();

export default sequelize;
