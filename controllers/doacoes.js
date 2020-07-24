const Doacao = require('../models/Doacao');
const Usuario = require('../models/Usuario');

module.exports = {

    async create(req, res){

        const {data, local, celular} = req.body;
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
        }).catch(err => { return res.json({fulfillmentText: `Aconteceu um erro com sua doação: ${err}`})})
    },

    async select(req, res) {
        const {celular} = req.body;
        const resultado = await Usuario.findAll({where:{celular:celular}})
        return res.json(resultado);
    }
}