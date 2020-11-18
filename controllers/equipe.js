const Equipe = require('../models/Equipe');
const EquipeUsuario = require('../models/EqupeUsuario');
const Usuario = require('../models/Usuario');



module.exports = {

    async create(req, res){

        const {nome_equipe, descricao_equipe, celular} = req.body.queryResult.parameters;
        const usuario = await Usuario.findOne({where:{celular:celular}}).then(usuario => {
            console.log(`usuário ${usuario.nome} foi encontrado`);
            return usuario;
        }).catch(err => console.error(err));
        const equipe = await Equipe.create({
            nome: nome_equipe,
            descricao: descricao_equipe
        }).then(equipe => {
            console.log(`equipe ${equipe.nome} criada`);
            return equipe;
        })
        .catch(err => console.error(err))

        const novaRelacao = await EquipeUsuario.create({
            id_usuario: usuario.id,
            id_equipe: equipe.id,
            moderador: true
        }).then(equipe_usuario => {
            console.log('relação de moderaçao criada')
            return res.json({fulfillmentText: `O grupo ${equipe.nome} foi criado pelo moderador ${usuario.nome}`})
        }).catch(err => {
            console.log(err);
            return res.json({fulfillmentText: "Não foi possível criar o grupo."});
        })

        return novaRelacao;
    },

    async deleteTeamByName(nome_equipe){

        await Equipe.destroy({
            where: {
                nome: nome_equipe
            }
        })
    },

    async teamUpdate(id_equipe, novo_nome, nova_descricao){

        Equipe.update({
            nome: novo_nome,
            descricao: nova_descricao
        },{
            where:{
                id: id_equipe
            }
        }).then(response => {return response}).catch(err => {throw err})

    },

    async teamDataByName(nome_equipe){

        const equipeDados = await Equipe.findOne({where:{nome: nome_equipe}}).then(dados => { return dados}).catch(err =>{
            console.error(err);
        })

        return equipeDados;
    },

    async selectTeamById(id_equipe) {

        const membros = await Equipe.findByPk(Number(id_equipe), {attributes: ['nome', 'descricao'], include:{
            model: Usuario,
            as: 'participantes',
            through: {
                attributes: []
            }
        }})

        return membros
    }

}
