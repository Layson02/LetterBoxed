import { DataTypes } from 'sequelize';
import sequelize from '../bd/config.js';

const Filme = sequelize.define('Filme', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ano: {
    type: DataTypes.INTEGER,
  },
  genero: {
    type: DataTypes.STRING,
  },
  sinopse: {
    type: DataTypes.TEXT,
  },
  diretor: {
    type: DataTypes.STRING,
  },
  nota: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  notaPlataforma: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  poster: {
    type: DataTypes.STRING,
  },
  roteiristas: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'filmes',
  timestamps: true,
});

export default Filme;
