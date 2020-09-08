const Doacao = require('../models/Doacao');
const Usuario = require('../models/Usuario');

module.exports = {

    async create(req, res){

        const {local, celular} = req.body.queryResult.parameters;
        const data = Date.now();
        const usuario = await Usuario.findOne({where:{celular:celular}});
        
        if(!usuario){
            return res.json({fulfillmentText: `Usuário não localizado, não foi possível registrar a doação`});
        }

        await Doacao.create({
            data: data,
            local: local,
            id_usuario: usuario.id
        }).then((doacao)=> {

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
                        
            const listaDoacoes = resultado[0].dataValues.doacoes
            var listaResultado = ['```Lista das suas doações registradas``` \n'];
            
            listaDoacoes.forEach(element => {
                
                
                item  = `*\n\nDoação número ${element.dataValues.id}* \n*Local da doação:* ${element.dataValues.local} \n*Dia da doação:* ${element.dataValues.data}`;
                listaResultado.push(item);

            });

            lista = listaResultado.toString()
            return res.json({fulfillmentText: `${lista}`} );
         }).catch((err) => {
            console.error(err); 
            return res.json({fulfillmentText: `Aconteceu um erro: ${err}`})
        });
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
            return res.json({fulfillmentText: `esse aqui foi o erro: ${err}`});
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