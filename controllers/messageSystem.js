const {TelegramClient} = require('messaging-api-telegram');
const Sequelize = require('../config/db-connection');
const { Op } = require("sequelize");
const Usuario = require('../models/Usuario');

require('dotenv').config();

const messenger = new TelegramClient({
    accessToken: process.env.TELEGRAMTOKEN
})

// Lidando com os erros retornados

messenger.getWebhookInfo().catch((error) => {
    console.log(error); // formatted error message
    console.log(error.stack); // error stack trace
    console.log(error.config); // axios request config
    console.log(error.request); // HTTP request
    console.log(error.response); // HTTP response
});

module.exports = {

    async sendMessage(req, res) {

        plataforma = req.body.plataforma
        estado = req.body.estado
        tipo_sanguineo = req.body.tipo_sanguineo
        mensagem = req.body.mensagem

        if (plataforma === 'todos') {  
            plataforma = {
                [Op.not]: null
            }
        }

        if (estado === 'todos') {
            estado = {
                [Op.not]: null
            }
        }

        if (tipo_sanguineo === 'todos') {
            tipo_sanguineo = {
                [Op.not]: null
            }
        }

        const users = await Usuario.findAll({
            where: {
                plataforma: plataforma,
                estado: estado,
                tipo_sanguineo: tipo_sanguineo,
            }
        }).then(response => {return response}).catch(err => console.error(err));

        users.forEach(user => {

            const celular = user.dataValues.celular;
            console.log(celular)
            messenger.sendMessage(celular, mensagem, {
                disableWebPagePreview: true,
                disableNotification: false,
            })

        });

        return res.send('mensagens enviadas')
    },

    findPlataform: async function () {
        const plataforms = [];

        const allPlataforms = await Sequelize.query("SELECT `plataforma` FROM `usuarios`").then(([resultados, metadados]) => {
            return resultados
        }).catch(err => console.error(err));

        allPlataforms.forEach((item) => {
            plataforms.push(item.plataforma);
        })
        return plataforms;

    },

    findState: async function () {

        const estados = [];

        const todosEstados = await Sequelize.query("SELECT `estado` FROM `usuarios`").then(([resultados, metadados]) => {
            return resultados;
        }).catch(err => console.error(err));

        todosEstados.forEach((item) => {
            estados.push(item.estado);
        })

        return estados;
    },

    findBloodType: async function() {

        const tipos_sanguineos = [];

        const todosOsSangues = await Sequelize.query("SELECT `tipo_sanguineo` FROM `usuarios`").then(([resultados, metadados]) => {
            return resultados;
        }).catch(err => console.error(err));

        todosOsSangues.forEach(item => {
            tipos_sanguineos.push(item.tipo_sanguineo);
        })

        return tipos_sanguineos;
    } 


}