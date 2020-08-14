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
                return res.json({fulfillmentText: `esse equipe foi cadastrada`});
                break;
            case 'cadastro_participante':
                return res.json({fulfillmentText:`Esse usuário foi inserido no seu grupo de doadores`});
                break;
            case 'historico_doacao':
                return res.json({fulfillmentText:`Essa foram as suas doações registradas aqui na plataforma`});
                break;
            case 'membros_equipe':
                return res.json({fulfillmentText: `Estas são as pessoa que fazem parte das sua equipe`})
                break;
            case 'registrar_doacao':
                dialogflowFunctions.doacao.create(req, res);
                break;
        }
    }
}