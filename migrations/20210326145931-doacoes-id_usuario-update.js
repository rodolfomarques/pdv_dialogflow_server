'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('doacoes', 'id_usuario',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'usuarios', key: 'id'},
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('doacoes', 'id_usuario',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'usuarios', key: 'id'},
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  }
};
