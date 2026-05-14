'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashSenha = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('usuarios', [{
      nome: 'Administrador',
      email: 'admin@admin.com',
      senha: hashSenha,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', { email: 'admin@admin.com' }, {});
  }
};
