const Usuario = require("../models/Usuario");
const EquipeUsuario = require("../models/EqupeUsuario");
const Equipe = require("../models/Equipe");



module.exports = {

    async create(req, res){
        
        const {celular, id_equipe} = req.body.queryResult.parameters;
        const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));

        await EquipeUsuario.create({
            id_usuario: usuario.id,
            id_equipe: id_equipe
        }).then(() => { return res.json({text: `Usuário cadastrado no grupo`})}).catch(err => console.error(err));

    },

    async select(req, res) {

        const {id_equipe} = req.body.queryResult.parameters;
        const membros = await Equipe.findByPk(Number(id_equipe), {attributes: ['nome', 'descricao'], include:{
            model: Usuario,
            as: 'participantes',
            through: {
                attributes: []
            }
        }})

        return res.json({text: membros})
    }
}