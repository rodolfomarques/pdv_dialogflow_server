const Sequelize = require('sequelize');
const db = require('../config/db-connection');

const Usuario = db.define('usuario', {
    id_usuario: {
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
        type: Sequelize.INTEGER,
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
    }
});

module.exports = Usuario;