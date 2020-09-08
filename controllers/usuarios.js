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

        const {nome, email, celular, plataforma, data_nascimento, sexo, tipo_sanguineo} = req.body.queryResult.parameters;

        const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));

        if(usuario) { return res.json({fulfillmentText: `Esse usuário já está cadastrado`})}

        await Usuario.create({
            nome: nome,
            email: email,
            celular: Number(celular),
            plataforma: plataforma,
            data_nascimento: data_nascimento,
            sexo: sexo,
            tipo_sanguineo: tipo_sanguineo
        }).then(
            (novoUsuario) => {
                return res.json({fulfillmentText: `O usuário ${novoUsuario.nome}, do sexo ${novoUsuario.sexo}, nascido em ${novoUsuario.data_nascimento}, e com o email ${novoUsuario.email} foi criado. O seu número de celular registrado é ${novoUsuario.celular}, via ${novoUsuario.plataforma}`})
            }
        ).catch(
            err => {
                console.error(err)
                res.json({fulfillmentText: `Aconteceu um erro no seu cadastro ${err}`})
            })
    },

    async userData(req, res) {

        const {celular} = req.body.queryResult.parameters;
        const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => console.error(err));
        return usuario;
        
    },

    async userDataByEmail(email){

        const usuario = await Usuario.findOne({where:{email:email}}).then(userData => {return userData}).catch(err => {return console.error(err)});
        return usuario;
    }
}