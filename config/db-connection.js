const { Sequelize } = require('sequelize');
const Usuario = require('../models/Usuario');
const Doacao = require('../models/Doacao');
const Equipe = require('../models/Equipe');
const EquipeUsuario = require('../models/EqupeUsuario');
require('dotenv').config();

// Inicializando as conexão com o servidor

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASS, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = sequelize.authenticate()
    .then(() => {console.log('A conexão foi estabelecida')})
    .catch(err => {console.error('Não foi possível conectar ao banco de dados: ', err)});


// inicializando a conexão dos models com o servidor

Usuario.init(sequelize);
Doacao.init(sequelize);
Equipe.init(sequelize);
EquipeUsuario.init(sequelize);

// Inicializando as relações entre os models

Usuario.associate(sequelize.models);
Doacao.associate(sequelize.models);
Equipe.associate(sequelize.models);

// Exportando o modulo

module.exports = sequelize;