const cron = require('node-cron');
const telegramController = require('./telegram');

// Programação do cron

// Cron executado todos os dias as 13:25

cron.schedule('0 25 13 * * *', async () => {

    console.log('cron rodando as 13:25');

    await telegramController.canDonateAllUsers().then(
        usuarios => {

            usuarios.forEach( user =>{

                var sexo = user.sexo.toString().toLowerCase()

                // Mensagem que lembra o doador no dia em que ele completou o período de espera

                if(sexo == 'masculino' && user.dias_de_diferenca == 60 || sexo == 'feminino' && user.dias_de_diferenca == 90){

                    var nome = user.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
                    telegramController.sendMessenge(user.celular, `Oi ${nome}!! Faz ${user.dias_de_diferenca} dias que você fez sua última doação. Você já pode fazer uma nova doação!`)

                }

                // Mensagem que lembra do doador uma semana depois que ele completou o periodo de espera

                if(sexo == 'masculino' && user.dias_de_diferenca == 67 || sexo == 'feminino' && user.dias_de_diferenca == 97){

                    var nome = user.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
                    telegramController.sendMessenge(user.celular, `Oi ${nome}!! Faz uma semana que você já pode doar novamente. Que tal fazer uma nova doação essa semana?`)

                }

                // Mensagem que lembra do doador um mês depois que ele completou o periodo de espera

                if(sexo == 'masculino' && user.dias_de_diferenca == 90 || sexo == 'feminino' && user.dias_de_diferenca == 120){

                    var nome = user.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
                    telegramController.sendMessenge(user.celular, `Oi ${nome}!! Faz uma mês que você já pode doar sangue. Sua doação é muito importante para manter nosso estoque cheio. Não espere mais! Estamos te esperando no hemocentro.`)

                }
            })
        }
    )

}, {

    scheduled: true,
   timezone: "America/Sao_Paulo"
})


cron.schedule('* * * * * *', () => {

}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
})

module.exports = cron;
