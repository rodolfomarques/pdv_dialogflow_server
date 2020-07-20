const Sequelize = require('sequelize');
const db = require('../config/db-connection');
const Usuario = require('../models/Usuario');

const Doacao = db.define('doacao', {
    id_doacao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    data: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    local: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'doacoes'
});

module.exports = Doacao;