const Doacao = require('../models/Doacao');
const Usuario = require('../models/Usuario');
const Medalhas = require('./medalhas')
const Responses = require('./errors_responses');

module.exports = {

    async create(req, res){

        const {local, celular} = req.body.queryResult.parameters;
        const data = Date.now();
        const usuario = await Usuario.findOne({where:{celular:celular}});

        if(!usuario){
            return res.json({fulfillmentText: `Usuário não localizado, não foi possível registrar a doação.`});
        }

        await Doacao.create({
            data: data,
            local: local,
            id_usuario: usuario.id
        }).then(async (doacao)=> {
            // const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));
            // const usuarioNivel = usuario.dataValue.nivel;
            // const novoNivel = usuarioNivel + 1;
            // const update = await Usuario.update({nivel: novoNivel},{where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));
            return res.json({fulfillmentText: `Sua doação feita no ${doacao.local}, foi registrada no dia ${doacao.data}`});
        }).catch(err => { return res.json({fulfillmentText: `Aconteceu um erro com sua doação: ${err}`})});
    },

    async select(req, res) {
        const {celular} = req.body.queryResult.parameters;
        await Usuario.findAll({where:{celular:celular}, include:{
            model: Doacao,
            as: 'doacoes',
            throught:{attributes: []}
            },
            attributes: ['nome', 'sexo', 'email', 'tipo_sanguineo']
        }).then((resultado) => {

            const listaDoacoes = resultado[0].dataValues.doacoes;

            if(listaDoacoes.length == 0) {

                const userLevel = Medalhas.getLevel(listaDoacoes.length);
                var listaResultado = [`Você não possui doações registradas. A sua insígnia de doador é ${userLevel}`];

            } else {

                const userLevel = Medalhas.getLevel(listaDoacoes.length);
                var listaResultado = [`A sua insígnia de doador é ${userLevel} \n\nSuas doações registradas: \n`];
                var numero = 1;

                listaDoacoes.forEach(element => {

                    var dataDoacao = new Date(element.dataValues.data);
                    var diaDoacao = dataDoacao.getUTCDate();
                    var mesDoacao = dataDoacao.getMonth() + 1;
                    var anoDoacao = dataDoacao.getFullYear()

                    var medalha = Medalhas.getMedal(diaDoacao, mesDoacao)

                    item  = `\n\nDoação número: ${numero} \nLocal da doação: ${element.dataValues.local} \nDia da doação: ${diaDoacao}/${mesDoacao}/${anoDoacao} \nMedalha:` + medalha;
                    listaResultado.push(item);
                    numero++

                });


            }

            lista = listaResultado.join('')
            return res.json({fulfillmentText: `${lista}`});

         }).catch((err) => {
            console.error(err);
            return res.json({fulfillmentText: `Eita, aconteceu um probleminha aqui. Desculpe.`})
        });
    },

    async selectByid(id){
        const doacoes = await Usuario.findAll({where:{id:id}, include:{
            model: Doacao,
            as: 'doacoes',
            throught:{attributes: []}
            },
            attributes: []
        }).then(response => {

            var numDoacoes = response[0].doacoes.length;
            var userLevel = Medalhas.getLevel(numDoacoes);
            var donationData = [];
            var userDonatonData = {userLevel, donationData};

            response[0].doacoes.forEach(
                (element) => {

                    var dataDoacao = new Date(element.dataValues.data);
                    var diaDoacao = dataDoacao.getUTCDate();
                    var mesDoacao = dataDoacao.getMonth() + 1;
                    var anoDoacao = dataDoacao.getFullYear()

                    var medalha = Medalhas.getMedal(diaDoacao, mesDoacao)

                    dados =  {
                        id: element.id,
                        dia: diaDoacao,
                        mes: mesDoacao,
                        ano: anoDoacao,
                        local: element.local,
                        medalha: medalha
                    }
                    donationData.push(dados)

                })

                return userDonatonData;


        }).catch(err => {console.error(err)});
        return doacoes;
    },

    async checkLastData(req, res) {

        const {celular} = req.body.queryResult.parameters;
        const lastData = await Usuario.findAll({where: {celular:celular}, include: {
            model: Doacao,
            as: 'doacoes',
            throught: {attributes: []}
            },
            attributes: []
        }).then(resultado => {


            const listaDoacoes = resultado[0].dataValues.doacoes;
            const numUltimaDoacao = resultado[0].dataValues.doacoes.length - 1;
            const ultimaDoacao = listaDoacoes[numUltimaDoacao];

            return ultimaDoacao.dataValues;

        }).catch(err => {
            return res.json({fulfillmentText: `Infelizmente, não consegui.`});
        })

        return lastData
    },

    async canDonate(req, res) {

        const {celular} = req.body.queryResult.parameters;

         // - Verificação da data da última doação, se ela existir, e seu retorno

        const ultimaData = await Usuario.findAll({where: {celular:celular}, include: {
            model: Doacao,
            as: 'doacoes',
            throught: {attributes: []}
            },
            attributes: []
        }).then(resultado => {

            const listaDoacoes = resultado[0].dataValues.doacoes;

            if (listaDoacoes.length == 0) {

                return semUltimaData = '2000-01-01';

            } else {

                const numUltimaDoacao = resultado[0].dataValues.doacoes.length - 1;
                const ultimaDoacao = listaDoacoes[numUltimaDoacao];
                const valorUltimaData = ultimaDoacao.dataValues.data;
                return valorUltimaData;

            }

        }).catch(err =>{ console.error(err)});

        // - Calculo da diferença entre o dia da última doação e o dia de hoje

        const hoje = Date.now();
        const dataAnterior = new Date(ultimaData);
        const dataHoje = new Date(hoje);
        const dif = Math.abs(dataHoje.getTime() - dataAnterior.getTime());
        const diasDeDiferenca = Math.ceil(dif / (1000 * 60 * 60 * 24) - 1);
        console.log(dif)
        console.log(diasDeDiferenca);
        // - Associação do sexo com o tempo mínimo de doacão

        const usuario = await Usuario.findOne({where:{celular:celular}});

        var sexo = usuario.sexo.toString().toLowerCase()

        if (sexo == 'masculino' && diasDeDiferenca >= 60) {

            return true;

        } else if(sexo == 'feminino' && diasDeDiferenca >= 90) {

            return true;

        } else {

            return false;

        }

    },

    async timeForNextDonation(req, res) {

        const {celular} = req.body.queryResult.parameters;

        if (celular == '') {

            throw Responses.plataform.no_number;
        }
         // - Verificação da data da última doação, se ela existir, e seu retorno

        const ultimaData = await Usuario.findAll({where: {celular:celular}, include: {
            model: Doacao,
            as: 'doacoes',
            throught: {attributes: []}
            },
            attributes: []
        }).then(resultado => {

            if(resultado[0] === undefined || resultado[0] === null) {

                throw 'user_not_found';

            }

            const listaDoacoes = resultado[0].dataValues.doacoes;


            if (listaDoacoes.length == 0) {

                return semUltimaData = '2000-01-01';

            } else {

                const numUltimaDoacao = listaDoacoes.length - 1;
                const ultimaDoacao = listaDoacoes[numUltimaDoacao];
                const valorUltimaData = ultimaDoacao.dataValues.data;
                return valorUltimaData;

            }

        }).catch(err =>{

            console.error(err)
            return err

        });

        // - Calculo da diferença entre o dia da última doação e o dia de hoje

        if (ultimaData == 'user_not_found'){ throw Responses.user.user_not_found }

        const hoje = Date.now();
        const dataAnterior = new Date(ultimaData);
        const dataHoje = new Date(hoje);
        const dif = Math.abs(dataHoje.getTime() - dataAnterior.getTime());
        const diasDeDiferenca = Math.ceil(dif / (1000 * 60 * 60 * 24) - 1);
        console.log(dif);
        console.log(diasDeDiferenca);

        // - Associação do sexo com o tempo mínimo de doacão

        const usuario = await Usuario.findOne({where:{celular:celular}});

        var sexo = usuario.sexo.toString().toLowerCase()

        if (sexo == 'masculino') {

            var time = 60 - diasDeDiferenca;
            return time;

        } else if(sexo == 'feminino') {

            var time = 90 - diasDeDiferenca;
            return time;

        }
    }
}
