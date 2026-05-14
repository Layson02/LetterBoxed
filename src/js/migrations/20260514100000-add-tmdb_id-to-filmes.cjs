'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('filmes', 'tmdb_id', {
      type: Sequelize.INTEGER,
      unique: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('filmes', 'tmdb_id');
  }
};
