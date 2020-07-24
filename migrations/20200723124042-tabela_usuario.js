'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      celular: {
        type: Sequelize.BIGINT(13).UNSIGNED,
        allowNull: false
      },
      plataforma: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      sexo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tipo_sanguineo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      privacidade: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      nivel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.dropTable('usuarios');
    
  }
};
