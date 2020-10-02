const { TelegramClient } = require('messaging-api-telegram');
const Usuario = require('../models/Usuario');

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

    async sendMessenge(){

        const usuarios = await Usuario.findAll({
            where:{
                plataforma: 'telegram'
            }
        }).then(response => {return response}).catch(err => {console.error(err)})

        await usuarios.forEach(user => {

            messenger.sendMessage(user.dataValues.celular, `Oi ${user.dataValues.nome}. Você sabia que o hemocentro está com baixo estoque. Você vai receber uma msg dessas por minuto`,{
                disableWebPagePreview: true,
                disableNotification: true,
            })
            console.log(`mensagens enviadas`);

        });

    }



}