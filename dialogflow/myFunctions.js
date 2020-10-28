// Neste arquivo estão inseridos todas os métodos criados para responder as inteções
// enviadas pelo DialogFlow.
// Para acessar cada um dos métodos, utilize a categoria.metodo()
// Ex: welcome.select()

const UsuarioControle = require('../controllers/usuarios');
const DoacaoControle = require('../controllers/doacoes');
const EquipeControle = require('../controllers/equipe');
const EquipeUsuarioControler = require('../controllers/equipeUsuario');
const Response = require('../controllers/errors_responses');

module.exports = {

    // Metodo ligado a intenção de Boas Vindas

    ajuda: {

        show (req, res) {

            return res.json({fulfillmentText: 'Estas são as coisas que eu posso fazer: \n\n'+
            `Fazer cadastro: cadastro um usuário novo.\n`+
            `Registrar doação: registra uma nova doação sua.\n`+
            `Histórico de doação: Lista as suas doações registradas.\n`+
            `Criar uma equipe: cria um grupo de doadores.\n`+
            `Inserir um participante: coloca um amigo no seu grupo.\n`+
            `Quem faz parte da minha equipe?: Mostra quem esta no seu grupo de doadores.\n`+
            `tempo restante: Mostra quanto tempo falta para a próxima doação.`            
            });
        }
    },

    // Métodos ligados a intenção de Boas Vindas

    welcome: {
        async select(req, res) {

            const newUser = await UsuarioControle.checkNewUser(req, res).then((respond) => {
                
                if(respond) {
                    return res.json({fulfillmentText:`Olá! Eu sou o chatbot do Pontos de Vida! Vejo que você é novo por aqui! Gostaria de se cadastrar na plataforma ou apenas obter informações sobre doação de sangue?\nDigite: ajuda, para saber o que eu consigo fazer.`});
                } else {
                    return false
                }
            })
    
            if(!newUser) {
    
                let userData = await UsuarioControle.userData(req, res).then((response) => {
                    
                    return res.json(
                        {
                            fulfillmentText:`Ola, ${response.nome}! Seja bem Vindo de Volta! O que você gostaria de fazer?\nDigite: ajuda, caso queira as opções.`,
                            fulfillmentMessages:[
                                {
                                    card: {
                                        title: `Seja bem vindo de volta ${response.nome}!`,
                                        subtitle: "É sempre bom ver você novamente! Como eu posso te ajudar?",
                                        imageUri: "https://trello-attachments.s3.amazonaws.com/5c729b2ea75a2e7c59446799/5d8a52b2b50fe1541bc42542/938ceeb3bb4db63a5214967f69d72e58/_Inspira%C3%A7%C3%A3o_05.png"
                                    }
                                }
                            ],
                            payload: {
                                telegram: `seja bem vindo de volta`
                            }
                    });
                
                })            
            }
    
        }
    },

    // Métodos ligados ao registro e atualização dos dados do usuário

    cadastro_usuario: {

        async createUser(req, res){

            const novoUsuario = await UsuarioControle.create(req, res);
            return novoUsuario;
    
        },

        async updateUser(req, res){

            await UsuarioControle.userUpdate(req, res).then(
                response => {
                    res.json({fulfillmentText: `Seu cadastro foi alterado para: ${response.nome}, nascido em ${response.data_nascimento}, sexo ${response.sexo}, tipo sanguineo ${response.tipo_sanguineo} e email: ${response.email}`})
            }).catch(err => {res.json({fulfillmentText: err})})
        }

    },

    // Alterar meu cadastro para: Rodolfo Marques, nascido em 16/12/1987, sexo masculino e sangue do tipo AB+. Meu email é contato@rodolfomarques.dev

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
    
                    return res.json({fulfillmentText: `Não foi possível registrar sua doação. Seu prazo de descanso, antes de uma nova doação, ainda não foi cumprido. \nVerifique quanto tempo falta digitando: próxima doação`});
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
                
               }).catch(err => {
                   
                console.error(`erro interno: ${err}`)
                return res.json({fulfillmentText: err})

               });
            
            return tempoRestante;

        }
    },

    equipe: {

        async create(req, res){

            const novaEquipe = await EquipeControle.create(req, res);
            return novaEquipe
        },

        async deleteTeam(req, res) {

            const {nome_equipe, celular} = req.body.queryResult.parameters;

            const isModerator = await EquipeUsuarioControler.isModerator(celular, nome_equipe).then(response => {return response}).catch(err => {console.error(err); return false});

            if(isModerator){

                await EquipeControle.deleteTeamByName(nome_equipe).then(() => res.json({fulfillmentText: `Grupo deletado`})).catch(err => {
                    console.error(err);
                    res.json({fulfillmentText: `Aconteceu um erro`})
                });

            } else {

                res.json({fulfillmentText: `Você não é o moderador desse grupo, você não pode deletá-lo`})
            }

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

        async autoRemove(req, res){

            const {nome_equipe, celular} = req.body.queryResult.parameters;
            const usuario = await UsuarioControle.userData(req, res).then(response => {return response}).catch(err => {console.error(err)});

            if(usuario === null || usuario == [] || usuario === undefined){res.json({fulfillmentText: Response.user.user_not_found})}

            const grupo = await EquipeControle.teamDataByName(nome_equipe).then(response => {return response}).catch(err => {console.error(err)});

            if(grupo === null || grupo == [] || grupo === undefined){res.json({fulfillmentText: Response.team.team_not_found})}

            const isMember = await EquipeUsuarioControler.isMember(usuario.id, grupo.id).then(response => {return response}).catch(err => {console.error(err)});
            const isModerator = await EquipeUsuarioControler.isModerator(celular, nome_equipe).then(response => {return response}).catch(err => {console.error(err); return false});

            if(isMember && !isModerator) {

                await EquipeUsuarioControler.autoRemove(usuario.id, grupo.id).then(res.json({fulfillmentText: `Você foi removido do grupo`}))
                .catch(err => {
                    console.error(err);
                    res.json({fulfillmentText: `${err}`});
                })

            } else {

                res.json({fulfillmentText: `Não foi possível remover o usuário do grupo. Se você o moderador deste grupo, você so poderar sair dela ao deletar o grupo.`});

            }
        },

        async myTeams(req, res){

            // - Pegar o id do usuário através do numero de celular

            const usuario = await UsuarioControle.userData(req, res).then(userdata => {return userdata}).catch(err => {
                console.error(err);
            });

            if(usuario === null) {
                return res.json({fulfillmentText: Response.user.user_not_found});
            }
            
            // - Verificar na tabela junção em quais registros tem aquele id de usuário e armazerar os id de cada grupo associado

            var idLista = [];
            const associacoes = await EquipeUsuarioControler.findAssociations(usuario.id).then(response => {return response}).catch(err => {
               console.error(err);
               res.json({fulfillmentText: `Houve um erro na recuperação as associações na funcão myTeams`});
            });

            if (associacoes === null || associacoes == []){
                return res.json({fulfillmentText: Response.team.team_not_found})
            }

            associacoes.forEach(associacao => {
                idLista.push(associacao.dataValues.id_equipe);
            });

            console.log(`lista de ids: ${idLista}`)
            // - Puxar a lista de grupos e membros a partir dos ids obtidos no passo anterior

            var gruposDados = [];

            for(i = 0; i < idLista.length; i++){

                const grupo = await EquipeControle.selectTeamById(idLista[i]).then(response => {return response}).catch(err => {console.error(err)});
                var dadosGrupo = [
                    `\nNome: ${grupo.dataValues.nome}`,
                    `\nDescrição do Grupo: ${grupo.dataValues.descricao}`,
                ]
                var integrantes = [`Integrantes:`]
                dadosGrupo.push(integrantes);
                for(pessoa = 0; pessoa < grupo.dataValues.participantes.length; pessoa++){
                    
                    integrantes.push(`\n${grupo.dataValues.participantes[pessoa].dataValues.nome}`);

                }
                gruposDados.push(dadosGrupo);
            }   

            console.log(gruposDados);

            // - retorna essa lista de grupos para o usuário

            return res.json({fulfillmentText: 
                'Estes são seus grupo e integrantes'+ 
                `${gruposDados}`
            })
        },

        async teamUpdate(req, res) {

            const {celular, nome_equipe, nome_equipe_novo, descricao_equipe} = req.body.queryResult.parameters;

            const teamData = await EquipeControle.teamDataByName(nome_equipe).then(response => {
                return response}).catch(err => {console.error(err); return false});
            
            if(teamData){
                const isModerator = await EquipeUsuarioControler.isModerator(celular, nome_equipe).then(response => {return response}).catch(err => {
                    console.error(err);
                    return false;
                });

                if(isModerator){

                    var id = teamData.dataValues.id;

                    EquipeControle.teamUpdate(id, nome_equipe_novo, descricao_equipe).then(() => {
                        return res.json({fulfillmentText: `Os dados do grupo foram atualizados`})
                    }).catch(err => {res.json({fulfillmentText: `${err}`})})

                } else {

                    res.json({fulfillmentText: Response.team.is_not_moderator})
                }

            } else {

                res.json({fulfillmentText: Response.team.team_not_found});

            }
 
        }
    }

}