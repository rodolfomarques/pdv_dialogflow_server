const Sequelize = require('sequelize');
const db = require('../config/db-connection');
const Usuario = require('./Usuario');

const Equipe = db.define('equipe', {
    id_equipe: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
});

module.exports = Equipe;