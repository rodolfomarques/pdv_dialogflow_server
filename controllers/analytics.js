const Sequelize = require('../config/db-connection');
const Usuario = require('../models/Usuario');
const Doacao = require('../models/Doacao');
const { compareSync } = require('bcrypt');

module.exports = {

    usuariosTotais: async function() {
        
        const users = await Sequelize.query("SELECT `id` FROM `usuarios`").then((response) => {return response[0]}).catch(err => console.error(err));
        return users.length;

    }, 

    doacoesTotais: async function() {

        const doacoes = await Sequelize.query("SELECT `id` FROM `doacoes`").then(response => {return response[0]}).catch(err => console.error(err));
        return doacoes.length;
    },

    equipesTotais: async function() {

        const equipes = await Sequelize.query("SELECT `id` FROM `equipes`").then(response => {return response[0]}).catch(err => console.error(err));
        return equipes.length;
    },

    doadoresRescorrentes: async function() {

        let contador = 0;

        await Usuario.findAll({include:{
            model: Doacao,
            as: 'doacoes',
            throught:{attributes: ['id']}
            },
            attributes: ['id']
        }).then((resultado) => {

            resultado.forEach((user) => {
                
                const listaDoacoes = user.dataValues.doacoes;
                listaDoacoes.length > 1? contador++: contador = contador;

            })

        }).catch(err => {console.error(err)});

        return contador;
    }
}