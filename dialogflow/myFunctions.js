// Neste arquivo estão inseridos todas os métodos criados para responder as inteções
// enviadas pelo DialogFlow.
// Para acessar cada um dos métodos, utilize a categoria.metodo()
// Ex: welcome.select()

const UsuarioControle = require('../controllers/usuarios');
const DoacaoControle = require('../controllers/doacoes');
const EquipeControle = require('../controllers/equipe');
const EquipeUsuarioControler = require('../controllers/equipeUsuario');

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
                    return res.json({fulfillmentText:`\`\`\`Olá! Eu sou o chatbot do Pontos de Vida! Vejo que você é novo por aqui! Gostaria de se cadastrar na plataforma ou apenas obter informações sobre doação de sangue?\`\`\`\n*Digite: ajuda, para saber o que eu consigo fazer.*`});
                } else {
                    return false
                }
            })
    
            if(!newUser) {
    
                let userData = await UsuarioControle.userData(req, res).then((response) => {
                    
                    return res.json({fulfillmentText:`\`\`\`Ola, ${response.nome}! Seja bem Vindo de Volta! O que você gostaria de fazer?\`\`\`\n*Digite: ajuda, caso queira as opções.*`});
                
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
                
            // - Verificação se o usuário atingiu o mínimo de tempo de doação

            const podeDoar = await DoacaoControle.canDonate(req, res).then(resposta => { 
                
                // - Registro da doação
                 console.log(resposta);
                if(resposta) {
                
                    return DoacaoControle.create(req, res).then(response => {return response});
    
                } else {
    
                    return res.json({fulfillmentText: `Não foi possível registrar sua doação. Seu prazo de descanso, antes de uma nova doação, ainda não foi cumprido. \n*Verifique quanto tempo falta digitando: próxima doação*`});
                }
            
            }).catch(err => console.error(err));

            return podeDoar;
           
        },

        async historic(req, res) {
            
            const historico = await DoacaoControle.select(req, res);
            return historico;
        },

        async lastData(req, res) {
            
            await DoacaoControle.checkLastData(req, res).then(resposta => {
                console.log(resposta);
                return res.json({fulfillmentText: `A sua ultima doação foi feita no ${resposta.local}, no dia ${resposta.data}.`});
            }).catch(err => {
                return res.json({fulfillmentText: `o erro do myFunctions foi esse aqui: ${err}`});
            });
        }, 

        async remainingTime(req, res) {

            const tempoRestante = await DoacaoControle.timeForNextDonation(req, res).then(response => {
                
                if (response <= 0) {

                    return res.json({fulfillmentText: `Você já pode voltar a doar! Fale com seus amigos e saiba se eles podem também. \nQuem sabe se você não pega uma carona com eles :-D`})
                    
                } else {
                    
                    return res.json({fulfillmentText: `faltam ${response} dias para você pode doar novamente.`});
                }
                
               }).catch(err => console.error(err));
            
            return tempoRestante;

        }
    },

    equipe: {

        async create(req, res){

            const novaEquipe = await EquipeControle.create(req, res);
            return novaEquipe
        },

        async associate(req, res){

            const {celular, nome_equipe, email} = req.body.queryResult.parameters;

            // - verificar se quem solicita é o moderador da equipe

            const isModerator = await EquipeUsuarioControler.isModerator(celular, nome_equipe).then(response => {return response}).catch(err => {
                console.error(err);
                return false;
            })            

            if(isModerator){

                // - encontrar o id do membro
                
                const usuario = await UsuarioControle.userDataByEmail(email).then(userData => {return userData}).catch(err => {
                    console.error(err)
                    return res.json({fulfillmentText: `Não achamos esse usuário para cadastrá-lo`})})
                
                // - encontrar o id do grupo
                
                const equipe = await EquipeControle.teamDataByName(nome_equipe).then(teamData => {return teamData}).catch(err => {
                    console.log(`não achamos a equipe no myFunctios ${err}`);
                    res.json({fulfillmentText: `Não econtramos a equipe você colocou: ${err}`});
                })

                // verificar ser o usuário já é membro do grupo (evitar registros dúplos)

                const isMember = await EquipeUsuarioControler.isMember(usuario.id, equipe.id).then(response => {return response}).catch(err => {
                    console.error(err);
                });

                if (isMember) {

                    res.json({fulfillmentText: `Esse usuário já é membro deste grupo. Não é possível cadastrá-lo novamente`})

                } else {

                    // - chamar a função que associa os dois
        
                    const associacao = await EquipeUsuarioControler.associate(usuario.id, equipe.id).then(response => {return response}).catch(err => {
                        console.log(`erro no my functions ${err}`);
                        res.json({fulfillmentText: `Não foi possivel ligar o usuário à equipe`});
                    });
        
                    // - retorna para o usuário o resultado
        
                    return res.json({fulfillmentText: `O Usuário ${usuario.nome}, foi inserido na equipe ${equipe.nome}`});

                }


            } else {

                res.json({fulfillmentText: `Você não é o moderador desta equipe. Somente moderadores podem cadastrar novos membros`})

            }

        },

        async myTeams(req, res){

            // - Pegar o id do usuário através do numero de celular

            const usuario = await UsuarioControle.userData(req, res).then(userdata => {return userdata}).catch(err => {
                console.error(err);
                res.json({fulfillmentText: `Houve um erro na recuperação do id do usuário na função myTeams `});
            });
            
            // - Verificar na tabela junção em quais registros tem aquele id de usuário e armazerar os id de cada grupo associado

            var idLista = [];
            const associacoes = await EquipeUsuarioControler.findAssociations(usuario.id).then(response => {return response}).catch(err => {
               console.error(err);
               res.json({fulfillmentText: `Houve um erro na recuperação as associações na funcão myTeams`});
            });
            associacoes.forEach(associacao => {
                idLista.push(associacao.dataValues.id_equipe);
            });

            console.log(`lista de ids: ${idLista}`)
            // - Puxar a lista de grupos e membros a partir dos ids obtidos no passo anterior

            var gruposDados = [];

            for(i = 0; i < idLista.length; i++){

                const grupo = await EquipeControle.selectTeamById(idLista[i]).then(response => {return response}).catch(err => {console.error(err)});
                var dadosGrupo = [
                    `\n\n*Nome: ${grupo.dataValues.nome}*`,
                    `\n*Descrição do Grupo:* ${grupo.dataValues.descricao}`,
                ]
                var integrantes = [`\n*Integrantes:*`]
                dadosGrupo.push(integrantes);
                for(pessoa = 0; pessoa < grupo.dataValues.participantes.length; pessoa++){
                    
                    integrantes.push(`\n${grupo.dataValues.participantes[pessoa].dataValues.nome}`);

                }
                gruposDados.push(dadosGrupo);
            }   

            console.log(gruposDados);

            // - retorna essa lista de grupos para o usuário

            return res.json({fulfillmentText: 
                '\`\`\`Estes são seus grupo e integrantes\`\`\`'+
                `${gruposDados}`
            })
        }
    }

}