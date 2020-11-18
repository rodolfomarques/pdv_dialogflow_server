const { TelegramClient } = require('messaging-api-telegram');
const Doacao = require('../models/Doacao');
const Usuario = require('../models/Usuario');

const messenger = new TelegramClient({
    accessToken: '1430926803:AAFO3mg-eDgKllf2R3enbKCJ_qICwqTdJFw'
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

    sendMessenge(celular, mensagem){

        // Essa função recebe um numero de contato com o usuário
        // como mensagem, a funçao recebe uma string

        messenger.sendMessage(celular, mensagem,{
            disableWebPagePreview: true,
            disableNotification: true,
        })
            console.log(`mensagens enviadas`);


    },

    async canDonateAllUsers() {

        //Esta função retorna um array com a lista de todos os usuários aptos a doarem, com seus nomes, celulares e tempo da ultima doação

        const ultimasDoacoes = await Usuario.findAll({
            where:{plataforma: 'telegram'}, 
            include: {
                model: Doacao,
                as: 'doacoes',
                attributes: ['data']   
            },
            attributes: ['nome', 'celular', 'sexo']
        }).then(resultado => {

            var listaCompleta = []
            
            resultado.forEach(doador =>{

                var listaDoacao = doador.dataValues.doacoes;

                if(listaDoacao.length == 0) {

                    listaCompleta.push({
                        nome: doador.dataValues.nome,
                        celular: doador.dataValues.celular,
                        sexo: doador.dataValues.sexo,
                        data: '2000-01-01'
                    });

                } else {

                    var numUltimaDoacao = listaDoacao.length -1;
                    var ultimaDoacao = listaDoacao[numUltimaDoacao];
                    var valorUltimaData = ultimaDoacao.dataValues.data;
                
                    listaCompleta.push({
                        nome: doador.dataValues.nome,
                        celular: doador.dataValues.celular,
                        sexo: doador.dataValues.sexo,
                        data: valorUltimaData
                    });
                }                
            })

            return listaCompleta;
        
        }).catch(err => {console.error(err)})

        var listaFinaldeUsuarios = []

        ultimasDoacoes.forEach(usuario =>{

            // - Calculo da diferença entre o dia da última doação e o dia de hoje  

            const hoje = Date.now();
            const dataAnterior = new Date(usuario.data);
            const dataHoje = new Date(hoje);
            const dif = Math.abs(dataHoje.getTime() - dataAnterior.getTime());
            const diasDeDiferenca = Math.ceil(dif / (1000 * 60 * 60 * 24) - 1);

            // - Associação do sexo com o tempo mínimo de doacão

            var sexo = usuario.sexo.toString().toLowerCase()

            if (sexo == 'masculino' && diasDeDiferenca >= 60) {

                listaFinaldeUsuarios.push({
                    nome: usuario.nome,
                    sexo: usuario.sexo,
                    celular: usuario.celular,
                    dias_de_diferenca: diasDeDiferenca,
                })

            } else if(sexo == 'feminino' && diasDeDiferenca >= 90) {

                listaFinaldeUsuarios.push({
                    nome: usuario.nome,
                    sexo: usuario.sexo,
                    celular: usuario.celular,
                    dias_de_diferenca: diasDeDiferenca,
                })
        
            } else {

                console.log('deu ruim')
                
            } 

        })

        return listaFinaldeUsuarios;

    }
    // uma funcão que verifique todos os usuário do telegram que já podem doar
    //

}