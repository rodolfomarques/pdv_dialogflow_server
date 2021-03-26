const dialogflowFunctions = require('../dialogflow/myFunctions');

module.exports = {

    checkIntent(req, res) {

        var intentName = req.body.queryResult.intent.displayName;
        console.log(req.body)
        switch (intentName) {
            case 'ajuda':
                dialogflowFunctions.ajuda.show(req, res);
                break;
            case 'welcome':
                dialogflowFunctions.welcome.select(req, res);
                break;
            case 'cadastro_usuario':
                dialogflowFunctions.cadastro_usuario.createUser(req, res);
                break;
            case 'Cadastro_usuario_novos_dados':
                dialogflowFunctions.cadastro_usuario.updateUser(req,res);
                break
            case 'deletar_usuario':
                dialogflowFunctions.cadastro_usuario.deleteUser(req, res);
                break
            case 'cadastro_equipe':
                dialogflowFunctions.equipe.create(req, res);
                break;
            case 'cadastro_participante':
                dialogflowFunctions.equipe.associate(req, res);
                break;
            case 'equipe_auto_remocao':
                dialogflowFunctions.equipe.autoRemove(req, res);
                break
            case 'equipe_deletar':
                dialogflowFunctions.equipe.deleteTeam(req, res)
                break
            case 'historico_doacao':
                dialogflowFunctions.doacao.historic(req, res);
                break;
            case 'membros_equipe':
                dialogflowFunctions.equipe.myTeams(req, res)
                break;
            case 'registrar_doacao':
                dialogflowFunctions.doacao.create(req, res);
                break;
            case 'ultima_doacao':
                dialogflowFunctions.doacao.lastData(req, res);
                break;
            case 'tempo_restante':
                dialogflowFunctions.doacao.remainingTime(req, res);
                break;
            case 'equipe_novos_dados':
                dialogflowFunctions.equipe.teamUpdate(req, res);
                break
            case 'meu_perfil':
                dialogflowFunctions.usuario.meuPerfil(req, res);
        }
    }
}