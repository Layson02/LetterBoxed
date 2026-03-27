import sequelize from '../bd/config.js';

// Importa os modelos
import Filme from './Filme.js';
import Usuario from './Usuario.js';
import Avaliacao from './Avaliacao.js';

// Estabelece as Associações (Relacionamentos)

// Um Usuário tem muitas Avaliações (1:N)
Usuario.hasMany(Avaliacao, { foreignKey: 'usuarioId', as: 'avaliacoes', onDelete: 'CASCADE' });
// Uma Avaliação pertence a um Usuário (N:1)
Avaliacao.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Um Filme tem muitas Avaliações (1:N)
Filme.hasMany(Avaliacao, { foreignKey: 'filmeId', as: 'avaliacoes', onDelete: 'CASCADE' });
// Uma Avaliação pertence a um Filme (N:1)
Avaliacao.belongsTo(Filme, { foreignKey: 'filmeId', as: 'filme' });

// Exporta tudo centralizado
export { sequelize, Filme, Usuario, Avaliacao };
