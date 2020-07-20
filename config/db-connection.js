const { Sequelize } = require('sequelize');
require('dotenv').config();

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


module.exports = sequelize;