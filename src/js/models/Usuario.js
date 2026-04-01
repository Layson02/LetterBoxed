import { DataTypes } from 'sequelize';
import sequelize from '../bd/config.js';
import bcrypt from 'bcrypt'; // Lembre-se de rodar: npm install bcrypt

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'usuarios',
  timestamps: true, // Adiciona createdAt e updatedAt
  hooks: {
    // Hash da senha antes de criar o usuário
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      }
    },
    // Hash da senha antes de atualizar caso seja modificada
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      }
    }
  }
});

// Adiciona um método para checar a senha na autenticação JWT
Usuario.prototype.checarSenha = async function(senhaFornecida) {
  return await bcrypt.compare(senhaFornecida, this.senha);
};

export default Usuario;
