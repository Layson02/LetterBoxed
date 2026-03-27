import { DataTypes } from 'sequelize';
import sequelize from '../bd/config.js';

const Avaliacao = sequelize.define('Avaliacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nota: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 10
    }
  },
  comentario: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'avaliacoes',
  timestamps: true,
});

export default Avaliacao;
