// Neste arquivo estão inseridos todas os métodos criados para responder as inteções
// enviadas pelo DialogFlow.
// Para acessar cada um dos métodos, utilize a intenção.metodo()
// Ex: welcome.select()

const UsuarioControle = require('../controllers/usuarios');
const DoacaoControle = require('../controllers/doacoes');

module.exports = {

    // Metodo ligado a intenção de Boas Vindas

    ajuda: {

        show (req, res) {

            return res.json({fulfillmentText: '```Estas são as coisas que eu posso fazer:``` \n\n'+
            `*Fazer cadastro*: cadastro um usuário novo.\n`+
            `*Registrar doação*: registra uma nova doação sua.\n`+
            `*Histórico de doação*: Lista as suas doações registradas.\n`+
            `*Criar uma equipe*: cria um grupo de doadores.\n`+
            `*Inserir um participante*: coloca um amigo no seu grupo.\n`+
            `*Quem faz parte da minha equipe?*: Mostra quem esta no seu grupo de doadores.\n`+
            `*tempo restante*: Mostra quanto tempo falta para a próxima doação.`            
            });
        }
    },

    // Métodos ligados a intenção de Boas Vindas

    welcome: {
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
    },

    // Métodos ligados a intenção cadastro_usuario

    cadastro_usuario: {

        async createUser(req, res){

            const novoUsuario = await UsuarioControle.create(req, res);
            return novoUsuario;
    
        }

    },

    // Métodos ligados as intenções de doação

    doacao: {

        async create(req, res){
            

            const novaDoacao = await DoacaoControle.create(req, res);
            return novaDoacao;
        }
    }

}