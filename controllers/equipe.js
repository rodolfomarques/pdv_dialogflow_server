const Equipe = require('../models/Equipe');
const EquipeUsuario = require('../models/EqupeUsuario');
const Usuario = require('../models/Usuario');


module.exports = {

    async create(req, res){

        const {nome, descricao, celular} = req.body;
        const usuario = await Usuario.findOne({where:{celular:celular}}).then(usuario => {
            console.log(`usuário ${usuario.nome} foi encontrado`);
            return usuario;
        }).catch(err => console.error(err));
        const equipe = await Equipe.create({
            nome: nome,
            descricao: descricao
        }).then(equipe => {
            console.log(`equipe ${equipe.nome} criada`);
            return equipe;
        })
        .catch(err => console.err(err))

        EquipeUsuario.create({
            id_usuario: usuario.id,
            id_equipe: equipe.id,
            moderador: true
        }).then(equipe_usuario => {
            return res.json({text: `O grupo ${equipe.nome} foi criado, pelo modelador ${usuario.nome}, log da associação ${equipe_usuario}`})
        }).catch(err => {
            console.log(err)
            return res.json("não foi possível criar o grupo");
        })
    },

}