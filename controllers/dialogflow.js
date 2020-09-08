const welcome = require('../dialogflow/welcome'); 
const cadastroUsuario = require('../dialogflow/cadastroUsuario');
const dialogflowFunctions = require('../dialogflow/myFunctions');

module.exports = {

    checkIntent(req, res) {

        var intentName = req.body.queryResult.intent.displayName;
        console.log(req.body)
        switch (intentName) {
            case 'ajuda':
                return dialogflowFunctions.ajuda.show(req, res);
                break;
            case 'welcome':
                dialogflowFunctions.welcome.select(req, res);
                break;
            case 'cadastro_usuario':
                dialogflowFunctions.cadastro_usuario.createUser(req, res);
                break;
            case 'cadastro_equipe':
                dialogflowFunctions.equipe.create(req, res);
                break;
            case 'cadastro_participante':
                dialogflowFunctions.equipe.associate(req, res);
                break;
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
        }
    }
}