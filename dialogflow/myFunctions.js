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

            return res.json({fulfillmentText: 'Essas são as coisas que eu posso fazer: \n\n'+
            `[1] Cadastrar usuário: Cadastro um usuário novo.\n`+
            `[2] Registrar doação: Registro a sua nova doação.\n`+
            `[3] Exibir perfil: Apresento informações do seu perfil.\n`+
            `[4] Histórico de doação: Listo os seus registros de doação.\n`+
            `[5] Criar uma equipe: Crio um grupo de doadores.\n`+
            `[6] Inserir um participante: Adiciono um amigo no seu grupo.\n`+
            `[7] Minha equipe: Mostro quem está no seu grupo de doadores.\n`+
            `[8] Tempo restante: Informo o tempo que falta para a próxima doação.`
            });
        }
    },

    // Métodos ligados a intenção de Boas Vindas

    welcome: {
        async select(req, res) {

            const newUser = await UsuarioControle.checkNewUser(req, res).then((respond) => {

                if(respond) {
                    return res.json({fulfillmentText:`Olá! Eu me chamo Socorro, sou a robô do projeto Pontos de Vida! Vejo que você é novo por aqui! Gostaria de se cadastrar na plataforma ou apenas obter informações sobre doação de sangue?\nDigite: ajuda, para saber o que eu consigo fazer.`});
                } else {
                    return false
                }
            })

            if(!newUser) {

                let userData = await UsuarioControle.userData(req, res).then((response) => {

                    return res.json(
                        {
                            fulfillmentText:`Ola, ${response.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}! Seja bem-vindo de volta! O que você gostaria de fazer?\nDigite: ajuda, caso queira as opções.`,
                           // fulfillmentMessages:[
                           //      {
                           //          card: {
                           //              title: `Seja bem-vindo de volta ${response.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}!`,
                           //              subtitle: "É sempre bom conversar com você. Como eu posso te ajudar?",
                           //              imageUri: "https://trello-attachments.s3.amazonaws.com/5c729b2ea75a2e7c59446799/5d8a52b2b50fe1541bc42542/938ceeb3bb4db63a5214967f69d72e58/_Inspira%C3%A7%C3%A3o_05.png"
                           //          }
                           //      }
                           //  ],
                           //  payload: {
                           //      telegram: `seja bem vindo de volta`
                           //  }
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
                    var userName = response.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
                    res.json({fulfillmentText: `Seu cadastro foi alterado para: ${userName}, nascimento em ${response.data_nascimento}, sexo ${response.sexo}, tipo sanguíneo ${response.tipo_sanguineo} e e-mail: ${response.email}`})
            }).catch(err => {res.json({fulfillmentText: err})})
        }

    },

    usuario: {

        async meuPerfil(req, res) {

            const {celular} = req.body.queryResult.parameters;

            const dados = await UsuarioControle.userData(req, res).then(response => {return response}).catch(err => console.error(err));
            const usuario = dados.dataValues;

            const proximaDoacao = await DoacaoControle.timeForNextDonation(req, res).then(time => {return time}).catch(err => console.error(err));

            const dadosDoacao = await DoacaoControle.selectByid(usuario.id).then(response => {return response}).catch(err => {console.error(err)});
            let listaMedalha = [];
            dadosDoacao.donationData.forEach(emoji => {
                listaMedalha.push(emoji.medalha);
            })
            let medalhas = listaMedalha.join('');
            let userLevel = dadosDoacao.userLevel;

            var userName = usuario.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))

            var dataNascimento = new Date(usuario.data_nascimento);
            var diaNascimento = dataNascimento.getUTCDate();
            var mesNascimento = dataNascimento.getMonth() + 1;
            var anoNascimento = dataNascimento.getFullYear()

            res.json({fulfillmentText:
                `Nome: ${userName} \n`+
                `Email: ${usuario.email} \n`+
                `Plataforma: ${usuario.plataforma} \n`+
                `ID na Plataforma: ${usuario.celular} \n`+
                `Data de Nascimento: ${diaNascimento}/${mesNascimento}/${anoNascimento} \n`+
                `Sexo: ${usuario.sexo} \n`+
                `Tipo Sanguineo: ${usuario.tipo_sanguineo} \n`+
                `Nivel: ${userLevel} \n`+
                `Medalhas: ${medalhas} \n`+
                `Tempo para a próxima doação: ${proximaDoacao} dias.`
            });



        }
    },

    // Métodos ligados as intenções de doação

    doacao: {

        async create(req, res){

            // - Verificação se o usuário atingiu o mínimo de tempo de doação

            const podeDoar = await DoacaoControle.canDonate(req, res).then(resposta => {

                // - Registro da doação
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

                var localDoacao = resposta.local.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
                return res.json({fulfillmentText: `A sua última doação foi feita no ${localDoacao}, no dia ${resposta.data}.`});
            }).catch(err => {
                return res.json({fulfillmentText: Response.donation.last_donation_error});
            });
        },

        async remainingTime(req, res) {

            const tempoRestante = await DoacaoControle.timeForNextDonation(req, res).then(response => {

                if (response <= 0) {

                    return res.json({fulfillmentText: `Você já pode voltar a doar! Fale com seus amigos e saiba se eles podem também. \nQuem sabe se você não pega uma carona com eles? :-D`})

                } else {

                    return res.json({fulfillmentText: `Faltam ${response} dias para você poder doar novamente.`});
                }

               }).catch(err => {

                return res.json({fulfillmentText: Response.donation.remaining_time_error});

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
                    res.json({fulfillmentText: Response.team.delete_team})
                });

            } else {

                res.json({fulfillmentText: Response.team.is_not_moderator})
            }

        },

        async associate(req, res){

            const {celular, nome_equipe, email} = req.body.queryResult.parameters;

            // - verificar se quem solicita é o moderador da equipe

            const isModerator = await EquipeUsuarioControler.isModerator(celular, nome_equipe).then(response => {return response}).catch(err => {
                return false;
            })

            if(isModerator){

                // - encontrar o id do membro

                const usuario = await UsuarioControle.userDataByEmail(email).then(userData => {return userData}).catch(err => {
                    return res.json({fulfillmentText: Response.team.friend_not_found})})

                // - encontrar o id do grupo

                const equipe = await EquipeControle.teamDataByName(nome_equipe).then(teamData => {return teamData}).catch(err => {
                    res.json({fulfillmentText: Response.team.team_not_found});
                })

                // verificar ser o usuário já é membro do grupo (evitar registros dúplos)

                const isMember = await EquipeUsuarioControler.isMember(usuario.id, equipe.id).then(response => {return response}).catch(err => {
                    console.error(err);
                });

                if (isMember) {

                    res.json({fulfillmentText: Response.team.is_member})

                } else {

                    // - chamar a função que associa os dois

                    const associacao = await EquipeUsuarioControler.associate(usuario.id, equipe.id).then(response => {

                        // - retorna para o usuário o resultado
                        return true;

                    }).catch(err => {
                        console.log(`erro no my functions ${err}`);
                        res.json({fulfillmentText: Response.team.cant_associate});
                    });

                    var userName = usuario.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
                    var equipeName = equipe.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))

                    if(associacao) {return res.json({fulfillmentText: `O usuário ${userName}, foi inserido na equipe ${equipeName}`});}
                }


            } else {

                res.json({fulfillmentText: Response.team.is_not_moderator});

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
                    res.json({fulfillmentText: Response.team.auto_remove_error});
                })

            } else {

                res.json({fulfillmentText: `Não foi possível remover o usuário do grupo. Se você for o moderador deste grupo, você só poderá sair deletando o grupo.`});

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
               res.json({fulfillmentText: `Eita, alguma coisa deu errado aqui... Não consegui encontrar seus grupos.`});
            });

            if (associacoes === null || associacoes == []){
                return res.json({fulfillmentText: Response.team.team_not_found})
            }

            associacoes.forEach(associacao => {
                idLista.push(associacao.dataValues.id_equipe);
            });

            console.log(`lista de ids: ${idLista}`)
            // - Puxar a lista de grupos e membros a partir dos ids obtidos no passo anterior, e as doações feitas por todos os usuários do grupo

            var gruposDados = [];

            for(i = 0; i < idLista.length; i++){

                const grupo = await EquipeControle.selectTeamById(idLista[i]).then(response => {return response}).catch(err => {console.error(err)});

                var integrantes = []

                for(pessoa = 0; pessoa < grupo.dataValues.participantes.length; pessoa++){

                    let medalhas = await DoacaoControle.selectByid(grupo.dataValues.participantes[pessoa].dataValues.id).then(response => {

                        let emojis = [response.userLevel];
                        let doacoes = response.donationData
                        doacoes.forEach( element => {
                            emojis.push(element.medalha)
                        })

                        return emojis

                    })

                    let [level, ...doacoesEmojis] = medalhas;
                    var userName = grupo.dataValues.participantes[pessoa].dataValues.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
                    integrantes.push(`${level} - ${userName} ${doacoesEmojis}`);
                }

                var resultado = {
                    nome: `${grupo.dataValues.nome.toString().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}`,
                    descricao: `${grupo.dataValues.descricao.toString()}`,
                    integrantes
                }

                gruposDados.push(resultado);

            }

            // organização das informações para serem retornadas

            var resultadosGrupos = []

           gruposDados.forEach(grupo => {

                resultadosGrupos.push(`\nNome do grupo: ${grupo.nome}\n`)
                resultadosGrupos.push(`Descrição: ${grupo.descricao}\n`)
                resultadosGrupos.push(`Integrantes:\n`)

                grupo.integrantes.forEach(pessoa => {
                    resultadosGrupos.push(`${pessoa}\n`)
                })

            })

            // - retorna essa lista de grupos para o usuário para o bot

            return res.json({fulfillmentText:
                'Esses são seus grupos e integrantes: \n'+
                resultadosGrupos.join('')

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
                        return res.json({fulfillmentText: `Os dados do grupo foram atualizados.`})
                    }).catch(err => {res.json({fulfillmentText: `${err}`})})

                } else {

                    res.json({fulfillmentText: Response.team.is_not_moderator})
                }

            } else {

                res.json({fulfillmentText: Response.team.team_not_found});

            }

        }
    },

    testes: {
        async teste(req, res){

            const {celular} = req.body.queryResult.parameters;

            const dados = await UsuarioControle.userData(req, res).then(resposta => {return resposta})
            const doacoesById = await DoacaoControle.selectByid(dados.id).then(resposta => {return resposta})

            // verifica o nível do usuárioa a partir da quantidade de doações


            console.log(doacoesById);

            return res.json(doacoesById);
        }
    }

}
