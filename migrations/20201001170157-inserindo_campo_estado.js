'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('usuarios', 'estado', {
      type: Sequelize.STRING,
      allowNull:false
    });
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('usuarios', 'estado');
  }
};
