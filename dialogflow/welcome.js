const UsuarioControle = require('../controllers/usuarios');

module.exports = {
    
    async select(req, res) {

        const newUser = await UsuarioControle.checkNewUser(req, res).then((respond) => {
            
            if(respond) {
                return res.json({fulfillmentText:`Olá! Eu sou o chatbot do Pontos de Vida! Vejo que você é novo por aqui! Gostaria de se cadastrar na plataforma ou apenas obter informações?`});
            } else {
                return false
            }
        })

        if(!newUser) {

            let userData = await UsuarioControle.userData(req, res).then((response) => {
                
                return res.json({fulfillmentText:`Ola, ${response.nome}! Seja bem Vindo de Volta! O que você gostaria de fazer?`});
            
            })            
        }

    }

}