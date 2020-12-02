const { TelegramClient } = require('messaging-api-telegram');
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
    
    async sendMessage(req, res){

        var plataforma = req.body.plataforma
        var estado = req.body.estado
        var tipo_sanguineo = req.body.tipo_sanguineo
        var mensagem = req.body.mensagem

        if(plataforma === 'todos'){
            var plataforma = {[Op.not]: null}
        }

        if(estado === 'todos'){
            var estado = {[Op.not]: null}
        }

        if(tipo_sanguineo === 'todos'){
            var tipo_sanguineo = {[Op.not]: null}
        }

        const users = await Usuario.findAll({where:{
            plataforma: plataforma,
            estado: estado,
            tipo_sanguineo: tipo_sanguineo,
        }}).then(response => {return response}).catch(err => console.error(err));

        users.forEach(user => {

            messenger.sendMessage(user.celular, mensagem,{
                disableWebPagePreview: true,
                disableNotification: false,
            })

        });
    },

        findPlataform: async function() {
            const plataforms = []
        }



}

