'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('filmes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ano: {
        type: Sequelize.INTEGER,
      },
      genero: {
        type: Sequelize.STRING,
      },
      sinopse: {
        type: Sequelize.TEXT,
      },
      diretor: {
        type: Sequelize.STRING,
      },
      nota: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      notaPlataforma: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      poster: {
        type: Sequelize.STRING,
      },
      roteiristas: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('filmes');
  }
};
