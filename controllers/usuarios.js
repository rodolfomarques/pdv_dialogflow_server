const Usuario = require('../models/Usuario');

module.exports = {

    async checkNewUser(req, res){

        const {celular} = req.body.queryResult.parameters;
        const novoUsuario = await Usuario.findAll({where:{celular: celular}}).then((response) => {

            if(response == [] || response == false) {
                return true;
            } else {
                return false;
            }
        }).catch((err) => {console.error(err)})

        return novoUsuario;

    },

    async create(req, res){

        const {nome, email, celular, plataforma, data_nascimento, sexo, tipo_sanguineo, estado} = req.body.queryResult.parameters;

        const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));

        if(usuario) { return res.json({fulfillmentText: `Esse usuário já está cadastrado`})}

        await Usuario.create({
            nome: nome,
            email: email,
            celular: Number(celular),
            plataforma: plataforma,
            data_nascimento: data_nascimento,
            sexo: sexo,
            tipo_sanguineo: tipo_sanguineo,
            estado: estado
        }).then(
            (novoUsuario) => {
                return res.json({fulfillmentText: `O usuário ${novoUsuario.nome}, no estado ${novoUsuario.estado}, do sexo ${novoUsuario.sexo}, com nascimento em ${novoUsuario.data_nascimento}, e com o e-mail ${novoUsuario.email} foi criado. O seu número registrado é ${novoUsuario.celular}, via ${novoUsuario.plataforma}`})
            }
        ).catch(
            err => {
                console.error(err)
                res.json({fulfillmentText: `Lamento. Aconteceu um erro no seu cadastro.`})
            })
    },

    async userUpdate(req, res) {

        const {nome, email, celular, plataforma, data_nascimento, sexo, tipo_sanguineo, estado} = req.body.queryResult.parameters;

        const update = await Usuario.update({
            nome: nome,
            email: email,
            plataforma: plataforma,
            data_nascimento: data_nascimento,
            sexo: sexo,
            tipo_sanguineo: tipo_sanguineo,
            estado: estado
        },{
            where: {
                celular: Number(celular)
            }
        }).then(() => {return true}).catch(err => {console.error(err); return false});

        if(update) {

            const {celular} = req.body.queryResult.parameters;
            const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));
            return usuario;

        } else {

            throw 'Não foi possível atualizar.'
        }

    },

    async userData(req, res) {

        const {celular} = req.body.queryResult.parameters;
        const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));
        return usuario;

    },

    async userDataByEmail(email){

        const usuario = await Usuario.findOne({where:{email:email}}).then(userData => {return userData}).catch(err => {return console.error(err)});
        return usuario;
    },

    async updateLevel(celular) {

        const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));
        const usuarioNivel = usuario.dataValue.nivel;
        const novoNivel = usuarioNivel + 1;
        const update = await Usuario.update({nivel: novoNivel},{where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));
        return update;
    }
}
