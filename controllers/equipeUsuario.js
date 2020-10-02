const Usuario = require("../models/Usuario");
const EquipeUsuario = require("../models/EqupeUsuario");
const Equipe = require("../models/Equipe");
const { response } = require("express");



module.exports = {

    async associate(id_usuario, id_equipe){
        
        await EquipeUsuario.create({
            id_usuario: id_usuario,
            id_equipe: id_equipe
        }).then((response) => {return response}).catch(err => console.error(err));

    },

    async autoRemove(id_usuario, id_equipe){

        await EquipeUsuario.destroy({
            where:{
                id_usuario: id_usuario,
                id_equipe: id_equipe
            }
        }).then(() => {return true}).catch(err => {console.error(err); return false})
    },

    async isModerator(celular, nome_equipe){

        const usuario = await Usuario.findOne({where:{celular:celular}}).then(userData => {return userData}).catch(err => {
            console.log(`Não foi localizado o usuário na função isModarator: ${err}`);
        });

        const equipe = await Equipe.findOne({where:{nome: nome_equipe}}).then(teamData => {return teamData}).catch(err =>{
            console.log(`não foi localizado a equipe na função isModarator: ${err}`);
        })

        const moderator = await EquipeUsuario.findOne({where:{id_usuario:usuario.id, id_equipe:equipe.id}}).then(
            data => {
                if(data.moderador == true){
                    return true;
                } else {
                    return false;
                }
            }
        ).catch(err => {

            console.log(err)

        })

        return moderator;

    },

    async isMember(id_usuario, id_equipe){

        const member = await EquipeUsuario.findOne({where:{id_usuario: id_usuario, id_equipe: id_equipe}}).then(
            response => {
                if(response === null || response == false){
                    return false;
                } else {
                    return true;
                }
            }
        ).catch(err => {
            console.log(`encontramos um erro na hora de verificar se é um membro ${err}`)
        })

        return member
    },

    async findAssociations(id_usuario){

        const associations = EquipeUsuario.findAll({where:{id_usuario: id_usuario}}).then(response => {return response}).catch(err => {return console.error(err)});
        console.log(associations);
        return associations;
    }

    
}