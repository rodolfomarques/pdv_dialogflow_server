const {TelegramClient} = require('messaging-api-telegram');
const Sequelize = require('../config/db-connection');
const { Op } = require("sequelize");
const Usuario = require('../models/Usuario');
const doacaoController = require('./doacoes');

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

        plataforma = req.body.plataforma;
        estado = req.body.estado;
        tipo_sanguineo = req.body.tipo_sanguineo;
        condicao_doado = req.body.condicao_doado;
        mensagem = req.body.mensagem;

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

        //Eu preciso verificar se o usuário já pode doar ou não, e usar este parâmetro como elemento de filtragem
        // pegar os numeros de cada usuário e passar pela função canDonate() do controller doação
        // eu ainda to carente para carai por causa de Julianna... ainda não consigo me desligar (ainda). Ta na hora de pegar outra pessoa o só sair para conversar?

        if(condicao_doado == 'todos') {

            users.forEach(user => {
                const celular = user.dataValues.celular;
                messenger.sendMessage(celular, mensagem, {
                    disableWebPagePreview: true,
                    disableNotification: false,
                })
            });

            return 'mensagens enviadas'

        } else if (condicao_doado == 'podeDoar') {

            users.forEach(user => {
    
                const celular = user.dataValues.celular;
                doacaoController.canDonateByPhone(celular).then(resposta => {
                    if(resposta == true){
                        messenger.sendMessage(celular, mensagem, {
                            disableWebPagePreview: true,
                            disableNotification: false,
                        });

                        console.log(`mensagem enviada para o número ${celular}`);
                    }
                }).catch(err => {return err});

                return 'Mensagens enviadas para os usuários que já podem doar sangue'
    
            });

        } else if (condicao_doado == 'naoPodeDoar') {

            users.forEach(user => {
    
                const celular = user.dataValues.celular;
                doacaoController.canDonateByPhone(celular).then(resposta => {
                    if(resposta == false){
                        messenger.sendMessage(celular, mensagem, {
                            disableWebPagePreview: true,
                            disableNotification: false,
                        });

                        console.log(`mensagem enviada para o número ${celular}`);
                    }
                }).catch(err => {return err});

                return 'Mensagens enviadas para os usuários que ainda não podem doar sangue'
    
            });

        }

    },

    findPlataform: async function () {
        const plataforms = [];

        const allPlataforms = await Sequelize.query("SELECT `plataforma` FROM `usuarios`").then(([resultados, metadados]) => {
            return resultados
        }).catch(err => console.error(err));

        allPlataforms.forEach((item) => {
            plataforms.push(item.plataforma);
        })

        let plataforms_filtradas = plataforms.filter((e, i) => plataforms.indexOf(e) === i);

        return plataforms_filtradas;

    },

    findState: async function () {

        const estados = [];

        const todosEstados = await Sequelize.query("SELECT `estado` FROM `usuarios`").then(([resultados, metadados]) => {
            return resultados;
        }).catch(err => console.error(err));

        todosEstados.forEach((item) => {
            estados.push(item.estado);
        })

        let estados_filtrados = estados.filter((e, i) => estados.indexOf(e) === i);

        return estados_filtrados;
    },

    findBloodType: async function() {

        const tipos_sanguineos = [];

        const todosOsSangues = await Sequelize.query("SELECT `tipo_sanguineo` FROM `usuarios`").then(([resultados, metadados]) => {
            return resultados;
        }).catch(err => console.error(err));

        todosOsSangues.forEach(item => {
            tipos_sanguineos.push(item.tipo_sanguineo);
        })

        let tipos_sanguineos_filtrados = tipos_sanguineos.filter((e, i) => tipos_sanguineos.indexOf(e) === i);

        return tipos_sanguineos_filtrados;
    } 


}