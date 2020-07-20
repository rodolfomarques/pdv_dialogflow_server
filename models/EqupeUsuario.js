const Sequelize = require('sequelize');
const db = require('../config/db-connection');
const Usuario = require('./Usuario');
const Equipe = require('./Equipe');

const EquipeUsuario = db.define('equipeUsuario', {
    id_equipe_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    local: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = EquipeUsuario;